const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
    },
    address: {
        type: mongoose.Schema.ObjectId,
        ref: 'Address'
    },
    siteUrl: {
        type: String,
    },
    contacts: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    images:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Image'
    }],
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Partner', PartnerSchema);
