'use strict';
const Permission = require('../models/permission.model');

class PermissionController {

    constructor() {}

    async insert(permission) {
        return await new Permission(permission).save();
    }

    async get(query) {
        return await Permission.find();
    }

    async getById(id) {
        return await Permission.findById(id);
    }

    async update(id, permission) {
        return await Permission.findByIdAndUpdate(id, permission, {new: true});
    }

    async remove(id) {
        return await Permission.findByIdAndRemove(id);
    }
}

module.exports = PermissionController;