const mongoose = require('mongoose');

const TicketOpportunitySchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    requiredAction: {
        type: String,
        trim: true,
    },
    refLink: {
        type: String,
        trim: true,
    },
    refType: {
        enum: ['login', 'facebook', 'twitter', 'twitch', 'instagram'],
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    startsAt: {
        type: Date,
    },
    expiresAt: {
        type: Date,
    }
});


module.exports = mongoose.model('TicketOpportunity', TicketOpportunitySchema);
