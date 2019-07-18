const mongoose = require('mongoose');

const UserTriviaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    trivia: {
        type: mongoose.Schema.ObjectId,
        ref: 'Trivia',
        required: true
    },
    receiveNotifications: {
        type: Boolean,
        default: true,
        required: true
    },
    questions:[{
        question: {
            type: mongoose.Schema.ObjectId,
            ref: 'TriviaQuestion'
        },
        selectedOption: {
            type: String,
            trim: true,
            default:''
        },
        correct: {
            type: Boolean,
            default: false
        }
    }]
});

UserTriviaSchema.index({user: 1, trivia:1}, {unique: 1});
module.exports = mongoose.model('UserTrivia', UserTriviaSchema);
