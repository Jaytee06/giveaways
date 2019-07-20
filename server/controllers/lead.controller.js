'use strict';
const Lead = require('../models/lead.model');

class LeadController {

    constructor() {}

    async insert(lead) {
        return await new Lead(lead).save();
    }

    async get(query) {
        return await Lead.find();
    }

    async getById(id) {
        return await Lead.findById(id);
    }

    async update(id, lead) {
        return await Lead.findByIdAndUpdate(id, lead, {new: true});
    }
    async remove(id) {
        return await Lead.findByIdAndRemove(id);
    }
}

module.exports = LeadController;