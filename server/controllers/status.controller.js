'use strict';
const Status = require('../models/status.model');

class StatusController {

  constructor() {}

  async insert(status) {
    return await new Status(status).save();
  }

  async get(query) {
    if (!query.paginationQuery.sort) query.paginationQuery.sort = { 'type': 1, 'sort': 1 };
    return await Status.find(query.query, {}, query.paginationQuery).lean();
  }

  async getCount(query) {
    const agg = [
      {$match: query.query},
      {$group: {_id:null, count:{$sum:1}}},
    ];
    return await Status.aggregate(agg);
  }

  async getById(id) {
    return await Status.findById(id);
  }

  async update(id, status) {
    return await Status.findByIdAndUpdate(id, status, { new: true });
  }

  async remove(id) {
    return await Status.findByIdAndRemove(id);
  }
}

module.exports = StatusController;
