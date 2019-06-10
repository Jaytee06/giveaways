const mongoose = require('mongoose');

const RolePermission = new mongoose.Schema({
    permission: {
        type: mongoose.Schema.ObjectId,
        ref: 'Permission'
    },
    canCreate:{
        type: Boolean,
        required: true,
        default: false
    },
    canRead:{
        type: Boolean,
        required: true,
        default: false
    },
    canUpdate:{
        type: Boolean,
        required: true,
        default: false
    },
    canDelete:{
        type: Boolean,
        required: true,
        default: false
    }
});

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    saleStatuses: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Status'
    }],
    reports: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Report'
    }],
    imports: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Import'
    }],
    permissions: [RolePermission],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Role', RoleSchema);
