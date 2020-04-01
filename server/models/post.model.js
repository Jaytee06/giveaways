const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    categories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    }],
    content: {
        type:String,
    },
    imageUrl: {
        type: String,
    },
    comments: [{
       type: mongoose.Schema.ObjectId,
       ref: 'Comment',
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Post', PostSchema);
