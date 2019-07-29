const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
	address: {
		type: String,
		required: true,
		trim: true
	},
	address2: {
		type: String,
		trim: true
	},
	city: {
		type: String,
		required: true,
		trim: true
	},
	state: {
		type: String,
		required: true,
		trim: true
	},
	zip: {
		type: String,
		required: true,
		trim: true
	},
});

module.exports = mongoose.model('Address', AddressSchema);