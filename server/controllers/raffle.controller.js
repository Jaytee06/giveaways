'use strict';
const Model = require('../models/raffle.model');
const RaffleEntryModel = require('../models/raffle-entry.model');

class RaffleController {

    constructor() {}

    async insert(raffle) {
        return await new Model(raffle).save();
    }

    async get(query) {
        return await Model.find(query).populate('user');
    }

    async getById(id) {
        return await Model.findById(id).populate('winner');
    }

    async update(id, raffle) {
        return await Model.findByIdAndUpdate(id, raffle, {new: true});
    }


    async remove(id) {
        return await Model.findByIdAndRemove(id);
    }

    async insertRaffleEntry(raffleEntry) {
        return await new RaffleEntryModel(raffleEntry).save();
    }

    async getRaffleEntry(query) {
        return await RaffleEntryModel.find(query).populate('user');
    }

    async getRaffleEntryById(id) {
        return await RaffleEntryModel.findById(id);
    }

    async updateRaffleEntry(id, raffleEntry) {
        return await RaffleEntryModel.findByIdAndUpdate(id, raffleEntry, {new: true});
    }

    async removeRaffleEntry(id) {
        return await RaffleEntryModel.findByIdAndRemove(id);
    }

    async getRaffleCounts(query) {

        const group = {
            _id: { raffle: "$raffle" },
            ticketCounts: {$sum:"$tickets"},
            userCounts: {$sum: 1}
        };

        const project = {
            raffle:"$_id.raffle",
            ticketCounts:"$ticketCounts",
            userCounts:"$userCounts"
        };

        const agg = [
            { $match: query.query },
            { $group: group },
            { $project: project }
        ];

        return await RaffleEntryModel.aggregate(agg);
    }
}

module.exports = RaffleController;