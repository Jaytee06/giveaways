'use strict';
const Model = require('../models/ticket.model');

class TicketController {

    constructor() {}

    async insert(ticket) {
        return await new Model(ticket).save();
    }

    async get(query) {
        return await Model.find().populate('user');
    }

    async getById(id) {
        return await Model.findById(id);
    }

    async update(id, ticket) {
        return await Model.findByIdAndUpdate(id, ticket, {new: true});
    }


    async remove(id) {
        return await Model.findByIdAndRemove(id);
    }
}

module.exports = TicketController;