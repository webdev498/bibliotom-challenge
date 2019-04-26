'use strict';
const passport = require('passport');
const passportJWT = require('passport-jwt')

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

const crypto = require('crypto');
const User = require('./../models/user.model');

const config = require('../config.json');

function getValidPassword (password, salt) {
	var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')+ "_"+ salt;
	return hash;
}
passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
},
function(email, password, done) {
    User.findOne({email},  function(err, user) {
        if (err) return done(err);
        // Return if user not found in database
        if (!user) {
            return done(null, false, {
				message: 'User not found',
				email, password
            })
        }
		// Return if password is incorrect
		let salt = user.password.split('_')[1]
		
		let enteredPassword = getValidPassword(password, salt)


        if (user.password !== enteredPassword) {
            return done(null, false, {
                message: 'Password is incorrect'
            })
        }
		// Return user object for correct credentials
        return done(null, user);
    })
}
));

passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey:  config.env.JWT_SECRET
}, function(jwtPayload, cb){
	return User.findOne({email: jwtPayload.email})
		.then(user => {
			return cb(null, user);
		})
		.catch(err=>{
			return cb(err);
		})
}
))