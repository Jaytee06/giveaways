'use strict';
const Model = require('../models/raffle.model');

class RaffleController {

    constructor() {}

    async insert(raffle) {
        return await new Model(raffle).save();
    }

    async get(query) {
        return await Model.find(query).populate('user');
    }

    async getById(id) {
        return await Model.findById(id);
    }

    async update(id, raffle) {
        return await Model.findByIdAndUpdate(id, raffle, {new: true});
    }


    async remove(id) {
        return await Model.findByIdAndRemove(id);
    }
}

module.exports = RaffleController;