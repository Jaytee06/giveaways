const mongoose = require('mongoose');

const RaffleSchema = new mongoose.Schema({
    start: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    giveAwayName: {
        type: String,
        trim: true,
        required: true
    },
    giveAwayLink: {
        type: String,
        trim: true,
        required: true
    },
    giveAwayImage: {
        type: String,
        trim: true
    },
    raffleType: {
        type: String,
        enum:['noLimit', 'limitTickets'],
        default: 'noLimit'
    },
    limitTickets: {
        type: Number
    },
    winner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    didStart: {
        type: Date,
    },
    didEnd: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Raffle', RaffleSchema);
