const mongoose = require('mongoose');

const image = {
    type: String,
    trim: true
};

const GameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    externalGameTag: {
        type: String,
        required: true,
        trim: true
    },
    externalSite: {
        type: String,
        required: true,
        trim: true
    },
    thumb: image,
    thumbBig: image,
    screenShots: [image],
    rewardAmount: {
        type: Number,
        default: 0
    },
    tags:[{
        type: String,
        trim: true
    }],
    aspectRatio: {
        type: Number,
        default: 1,
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Game', GameSchema);
