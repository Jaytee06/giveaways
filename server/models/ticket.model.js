const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        trim: true,
    },
    ref: {
        type: String,
        trim: true,
    },
    refType: {
        enum: ['triviaQuiz', 'ticketOpp', 'raffle', 'signUp', 'loginBonus', 'wheelSpin', 'orderedProduct'],
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Ticket', TicketSchema);
