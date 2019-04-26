const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const config = require('../config.json');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
	name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	role: { type: String, required: true },
    password: { type: String, required: true }
},
{ timestamps: true });

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
    return this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex') + "_"+ this.salt;
};

UserSchema.methods.validPassword = function(password, salt) {
    var hash = crypto.pbkdf2Sync(toString(password), salt, 1000, 64, 'sha512').toString('hex')+ "_"+ salt;
    return this.hash === hash;
}

UserSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        role: this.role,
        exp: parseInt(expiry.getTime() / 1000),
    }, config.env.JWT_SECRET);
};

module.exports = mongoose.model('User', UserSchema);