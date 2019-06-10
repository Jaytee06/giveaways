'use strict';
const Company = require('../models/company.model');

class CompanyController {

    constructor() {}

    async insert(company) {
        return await new Company(company).save();
    }

    async get(query) {
        return await Company.find();
    }

    async getById(id) {
        return await Company.findById(id);
    }

    async update(id, company) {
        return await Company.findByIdAndUpdate(id, company, {new: true});
    }
    async remove(id) {
        return await Company.findByIdAndRemove(id);
    }
}

module.exports = CompanyController;