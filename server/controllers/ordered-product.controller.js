'use strict';
const Model = require('../models/ordered-product.model');

class ProductController {

    constructor() {}

    async insert(orderedProduct) {
        return await new Model(orderedProduct).save();
    }

    async get(query) {
        return await Model.find(query.query).populate('product status').populate('user', 'fullname').sort(query.sort).skip(query.skip).limit(query.limit);
    }

    async getById(id) {
        return await Model.findById(id).populate('product').populate({
            path: 'user',
            select: 'fullname address email',
            populate: [
                { path: 'address.shipping' },
            ],
        });
    }

    async update(id, orderedProduct) {
        return await Model.findByIdAndUpdate(id, orderedProduct, {new: true});
    }


    async remove(id) {
        return await Model.findByIdAndRemove(id);
    }
}

module.exports = ProductController;