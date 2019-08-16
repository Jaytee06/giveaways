const mongoose = require('mongoose');

const wheel = {
    wonTickets: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
};

const userProvider = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    },
    provider: {
        type: String,
        trim: true
    },
    providerId: {
        type: String,
        trim: true,
    },
    accessToken: {
        type: String,
        trim: true
    },
    refreshToken: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
});

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
    },
    hashedPassword: {
        type: String,
        //required: true
    },
    roles: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Role',
        required: true
    }],
    loginLogs: [{
        type: Date,
        default: Date.now,
    }],
    twitch: userProvider,
    spinWheel: [wheel],
    receiveEmails: {
        type: Boolean,
        default: true
    },
    emailToken: {
        type: String,
        trim: true,
    },
    address: {
        shipping: {
            type: mongoose.Schema.ObjectId,
            ref: 'Address'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
