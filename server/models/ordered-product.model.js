const mongoose = require('mongoose');

const OrderedProductSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    ticketAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: mongoose.Schema.ObjectId,
        ref: 'Status'
    },
    chosenDeliveryMethod: {
        type: String,
        enum: ['Digital', 'Shipped'],
        default: 'Digital'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('OrderedProduct', OrderedProductSchema);
