const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Institution = new Schema({
	name: { type: String, required: true },
	url: { type: String, required: true },
	email_domain: { type: String, required: true }
},
	{ timestamps: true }
);

module.exports = mongoose.model('Institution', Institution);