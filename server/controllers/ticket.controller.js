'use strict';
const Model = require('../models/ticket.model');
const User = require('../models/user.model');
const OppModel = require('../models/ticket-opportunity.model');

const mongoose = require('mongoose');

const RaffleCtrl = require('../controllers/raffle.controller');

class TicketController {

    constructor() {}

    async insert(ticket) {
        let newTicket = await new Model(ticket).save();

        // add tickets for referrer
        if( newTicket.refType != 'referral' ) {
            // get the referrer of the person who earned these tickets
            const user = await User.findById(newTicket.user).populate('referrer');
            if( user.referrer ) {
                let amount = Math.floor(0.1*newTicket.amount);
                if( amount > 0 ) {
                    const obj = {
                        amount,
                        user: user.referrer._id,
                        reason: user.fullname+' earned some tickets',
                        ref: newTicket.user,
                        refType: 'referral'
                    };
                    this.insert(obj);
                }
            }
        }

        return newTicket;
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

    async getCount(query) {
        return await Model.countDocuments(query.query);
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

        if( query.groupBy ) {

            if( query.groupBy.indexOf('ref') > -1 ) {
                group._id.ref = '$ref';
                project.ref = {$toObjectId: '$_id.ref'};
            }

            if (query.groupBy.indexOf('day') > -1) {
                group._id.day = { $dayOfMonth: [{ $add: ['$createdAt', -420 * 60000] }] };
                group._id.year = { $year: [{ $add: ['$createdAt', -420 * 60000] }] };
                group._id.month = { $month: [{ $add: ['$createdAt', -420 * 60000] }] };
                project.day = '$_id.day';
                project.year = '$_id.year';
                project.month = '$_id.month';
            }
        }

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

        if( query.groupBy ) {
            if( query.groupBy.indexOf('ref') > -1 ) {
                agg.splice(5, 0, {$lookup: {from: 'users', localField: 'ref', foreignField: '_id', as: 'ref'}});
                agg.splice(6, 0, {$unwind: "$ref"});
            }
        }

        return await Model.aggregate(agg);
    }

    async myTicketCount(query) {

		const rCtrl = new RaffleCtrl();

		const tickets = await this.ticketCounts(query);

		let myTickets = {count:0};
		if( tickets && tickets.length ) myTickets = tickets[0];

		// subtract tickets submitted in future raffles
		const raffles = await rCtrl.get({query:{'$or':[{didEnd:{$exists:false}}, {didEnd:{$eq:null}}]}});

		if( raffles && raffles.length ) {
			const entries = await rCtrl.getRaffleEntry({user:mongoose.Types.ObjectId(query.user), raffle:{$in:raffles.map(x => mongoose.Types.ObjectId(x._id))}});
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