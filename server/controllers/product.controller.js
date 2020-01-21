'use strict';
const Model = require('../models/product.model');

class ProductController {

    constructor() {}

    async insert(product) {
        return await new Model(product).save();
    }

    async get(query) {
        return await Model.find(query.query).sort(query.sort).skip(query.skip).limit(query.limit);
    }

    async getById(id) {
        return await Model.findById(id);
    }

    async update(id, product) {
        return await Model.findByIdAndUpdate(id, product, {new: true});
    }


    async remove(id) {
        return await Model.findByIdAndRemove(id);
    }
}

module.exports = ProductController;