'use strict';
const Partner = require('../models/partner.model');

class PartnerController {

    constructor() {}

    async insert(partner) {
        return await new Partner(partner).save();
    }

    async get(query) {
        return await Partner.find();
    }

    async getById(id) {
        return await Partner.findById(id);
    }

    async update(id, partner) {
        return await Partner.findByIdAndUpdate(id, partner, {new: true});
    }
    async remove(id) {
        return await Partner.findByIdAndRemove(id);
    }
}

module.exports = PartnerController;