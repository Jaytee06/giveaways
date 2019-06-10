const mongoose = require('mongoose');

const CallCenterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    dealerNumber: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: mongoose.Schema.ObjectId,
        ref: 'Address'
    },
    location: [{
        type: String,
    }],
    siteUrl: {
        type: String
    },
    contacts: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    images:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Image'
    }],
    partner: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('CallCenter', CallCenterSchema);
