var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var Location = new Schema({
	'city': String,
	'fullName': String,
	'code': String
});

module.exports = mongoose.model('Location', Location);