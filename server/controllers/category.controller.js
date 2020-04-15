'use strict';
const Category = require('../models/category.model');
const _ = require('lodash');

class CategoryController {

    constructor() {}

    async insert(category) {
        return await new Category(category).save();
    }

    async get(query) {
        if( !_.isEmpty(query.aggData) ) {
            let agg = [
                { $match: { ...query.query } },
                // { $sort: query.sort },
                // { $skip: query.paginationQuery.skip },
                // { $limit: query.paginationQuery.limit },
                // { $lookup: { from: 'patients', localField: 'patient', foreignField: '_id', as: 'patient' } },
                // { $unwind: '$patient' },
                // { $lookup: { from: 'addresses', localField: 'patient.address.shipping', foreignField: '_id', as: 'patient.address.shipping' } },
                // { $unwind: { path: '$patient.address.shipping', preserveNullAndEmptyArrays: true} },
                // { $lookup: { from: 'insurances', localField: 'patient.insurances', foreignField: '_id', as: 'patient.insurances'} },
                // { $project: {
                //         user: 1,
                //         status: 1,
                //         insuranceType: 1,
                //         patient: 1,
                //         insurance: {
                //             $filter: {
                //                 input: '$patient.insurances',
                //                 as: 'insurance',
                //                 cond: {
                //                     $or:[
                //                         {$eq:['$insuranceType', null]},
                //                         {$eq:['$$insurance.type', '$insuranceType']},
                //                     ]
                //                 }
                //             }
                //         }
                //     }
                // },
                // { $addFields:{ 'patient.insurance': '$insurance' } },
                // { $unwind: { path: '$patient.insurance', preserveNullAndEmptyArrays: true} },
            ];

            const categories = await Category.aggregate(agg);

            return categories;
        } else {
            return await Category.find(query.query);
        }
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