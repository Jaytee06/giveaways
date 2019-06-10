'use strict';
const CallCenter = require('../models/call-center.model');

class CallCenterController {

    constructor() {}

    async insert(callCenter) {
        return await new CallCenter(callCenter).save();
    }

    async get(query) {
        return await CallCenter.find();
    }

    async getById(id) {
        return await CallCenter.findById(id);
    }

    async update(id, callCenter) {
        return await CallCenter.findByIdAndUpdate(id, callCenter, {new: true});
    }
    async remove(id) {
        return await CallCenter.findByIdAndRemove(id);
    }
}

module.exports = CallCenterController;