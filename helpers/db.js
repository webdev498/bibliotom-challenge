'use strict';
const config = require('../config.json');
const mongoose = require('mongoose');
mongoose.connect(config.connectionString, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    Book: require('../models/book.model'),
    Institution: require('../models/institution.model'),
    User: require('../models/user.model'),
}