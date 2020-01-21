'use strict';
const Model = require('../models/ticket.model');
const OppModel = require('../models/ticket-opportunity.model');

const mongoose = require('mongoose');

const RaffleCtrl = require('../controllers/raffle.controller');

class TicketController {

    constructor() {}

    async insert(ticket) {
        return await new Model(ticket).save();
    }

    async get(query) {
        return await Model.find(query.query).populate('user').sort(query.sort).skip(query.skip).limit(query.limit);
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

    async ticketCounts(query) {
        const group = {
            _id: { user: '$user' },
            count: { $sum: '$amount' },
        };
        const project = {
            user: '$_id.user',
            count: '$count',
        };

        const agg = [
            { $match: query.query },
            { $group: group },
            { $project: project },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: "$user" },
            { $sort: {count: -1} }
        ];

        return await Model.aggregate(agg);
    }

    async myTicketCount(userId) {

		const rCtrl = new RaffleCtrl();

		const query = {user:mongoose.Types.ObjectId(userId)};
		const tickets = await this.ticketCounts({query});

		let myTickets = {count:0};
		if( tickets && tickets.length ) myTickets = tickets[0];

		// subtract tickets submitted in future raffles
		const raffles = await rCtrl.get({'$or':[{didEnd:{$exists:false}}, {didEnd:{$eq:null}}]});

		if( raffles && raffles.length ) {
			const entries = await rCtrl.getRaffleEntry({user:mongoose.Types.ObjectId(userId), raffle:{$in:raffles.map(x => mongoose.Types.ObjectId(x._id))}});
			entries.forEach((entry) => {
				myTickets.count -= entry.tickets;
			});
		}

		return myTickets;

	}

    async insertOpportunity(ticketOpportunity) {
        return await new OppModel(ticketOpportunity).save();
    }

    async getOpportunities(query) {
        return await OppModel.find(query.query).populate('user').sort(query.sort).skip(query.skip).limit(query.limit);
    }

    async getOpportunityById(id) {
        return await OppModel.findById(id);
    }

    async updateOpportunity(id, ticketOpportunity) {
        return await OppModel.findByIdAndUpdate(id, ticketOpportunity, {new: true});
    }

    async removeOpportunity(id) {
        return await OppModel.findByIdAndRemove(id);
    }
}

module.exports = TicketController;