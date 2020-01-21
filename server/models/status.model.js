const mongoose = require('mongoose');

const Reason = {
	name: {type: String, trim: true},
	sort: {type: Number},
	active: {type: Boolean, default: true}
};

const StatusSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	sort: {
		type: Number,
	},
	type: {
		type: String,
		enum: ['Raffle', 'Product'],
		default: 'Raffle',
	},
	active: {
		type: Boolean,
		default: true,
	},
	reasons: [Reason],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});


module.exports = mongoose.model('Status', StatusSchema);
