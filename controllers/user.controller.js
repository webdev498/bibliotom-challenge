'use strict';
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const validateDomain = require('./institution.controller');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = {
    register: function(req, res, next) {
        var user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: String(req.body.email),
			role: req.body.role,
			password: req.body.password
		});
		// Encrypt password
	   	user.password = user.setPassword(req.body.password);
	   
		// link to institution
		let extractDomain = user.email.split('@')[1]; 
		
		let role  = req.body.role.toLowerCase().trim() 
		let acceptableRole = ["student", "academic", "administrator"]
		if (acceptableRole.indexOf(role) === -1) {
			res.status(400).json({ message: 'invalid role' })
			return;
			}



		validateDomain.getInstitution(extractDomain)
			.then(data => {
				// let domainExist = data && data !== undefined && data !== null ? true : false
				if (data) {
					user.save(err => {
						if (err) {
							res.status(400).json(err);
							return;
						}
						var token = user.generateJwt();
						return res.status(200).json({'token': token})
					});
				} else if (data === undefined || data === null) {
					return res.status(400).json({ message: 'User not added, email does not exist' })
				}else {
					return res.status(400).json({ message: "User already exists" })
				}
			})
			.catch(err => {
				console.error(err);
			})

    },
    login: function(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
			if (err || !user) {
				console.log(info)
				return res.status(400).json({
					message : info.message
				})
			}
			req.login(user, {session: false}, (err) => {
				console.log(user)
				if (err) {
					res.send(err)
				}
				//generate token
				var expiry = new Date();
				expiry.setDate(expiry.getDate() + 30);
				const token = jwt.sign({
					_id: user._id,
					email: user.email,
					name: user.name,
					role: user.role,
					exp: parseInt(expiry.getTime() / 1000),
				}, config.env.JWT_SECRET);
				return res.json({token});
			})
		})
		(req, res);
    }
};