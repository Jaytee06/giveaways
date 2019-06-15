const mongoose = require('mongoose');

const TriviaQuestion = new mongoose.Schema({
    category: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    difficulty:{
        type: String,
        trim: true
    },
    question:{
        type: String,
        trim: true,
        required: true,
    },
    options:[{
        type: String,
        trim: true
    }]
});

const TriviaQuestionAnswer = new mongoose.Schema({
    question: {
        type: mongoose.Schema.ObjectId,
        ref: 'TriviaQuestion'
    },
    answer: {
        type: String,
        trim: true
    }
});

const TriviaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    numOfQuestions: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        trim:true,
        required: true
    },
    difficulty: {
        type: String,
        trim: true,
    },
    questionType: {
        type: String,
        trim: true,
    },
    questions: [TriviaQuestion],
    questionAnswers:[TriviaQuestionAnswer],
    start: {
        type:Date,
        required: true
    },
    questionDuration: {
        type: Number,
        required: true,
    },
    tickets: {
        type: Number,
        required: true
    },
    payoutType: {
        type: String,
        trim: true,
        required: true
    },
    ticketsPerQuestions:{
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Trivia', TriviaSchema);
