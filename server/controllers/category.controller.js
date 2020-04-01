'use strict';
const Category = require('../models/category.model');

class CategoryController {

    constructor() {}

    async insert(category) {
        return await new Category(category).save();
    }

    async get(query) {
        return await Category.find(query);
    }

    async getById(id) {
        return await Category.findById(id);
    }

    async update(id, category) {
        return await Category.findByIdAndUpdate(id, category, {new: true});
    }
    async remove(id) {
        return await Category.findByIdAndRemove(id);
    }
}

module.exports = CategoryController;