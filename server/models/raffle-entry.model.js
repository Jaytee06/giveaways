const mongoose = require('mongoose');

const RaffleEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    tickets: {
        type: Number
    },
    raffle: {
        type: mongoose.Schema.ObjectId,
        ref: 'Raffle'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

RaffleEntrySchema.index({user: 1, raffle:1}, {unique: 1});
module.exports = mongoose.model('RaffleEntry', RaffleEntrySchema);
