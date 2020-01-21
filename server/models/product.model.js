const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true
    },
    link: {
        type: String,
        trim: true
    },
    ticketAmount: {
        type: Number,
        required: true,
    },
    retailPrice: {
        type: Number,
        required: true,
    },
    discountAmount: {
        type: Number,
        required: true,
    },
    canDigitalDeliver: {type: Boolean, default: false},
    canShip: {type: Boolean, default: false},
    active: {type: Boolean, default: true},
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Product', ProductSchema);
