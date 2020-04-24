const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const Ctrl = require('../controllers/ticket.controller');
const requireRole = require('../middleware/require-role');
const mongoose = require('mongoose');
const moment = require('moment');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))
router.use(requireRole);

router.route('/').get(asyncHandler(preQuery), asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/count').get(asyncHandler(preQuery), asyncHandler(getCount));
router.route('/counts').get(asyncHandler(preQuery), asyncHandler(getCounts));
router.route('/clean-up').get(asyncHandler(cleanUp)); // temp function
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));
router.route('/my-tickets/:userId').get(asyncHandler(preQuery), asyncHandler(myTickets));

async function preQuery(req, res, next) {

    if( req.query ) {

        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 1000;
        let sortParam = req.query.sort || '-createdAt';
        const groupBy = req.query.groupBy;
        delete req.query.skip;
        delete req.query.limit;
        delete req.query.sort;
        delete req.query.groupBy;

        const dateRange = { $gte: new Date(req.query.startDateTime), $lt: new Date(req.query.endDateTime) };

        if (req.query.startDateTime) {
            req.query.createdAt = dateRange;

            delete req.query.startDateTime;
            delete req.query.endDateTime;
        }

        if( req.query.getSpent !== 'true' ) {
            req.query.amount = { $gt: 0 };
        }
        delete req.query.getSpent;

        // ignore vintleytv
        if( !req.query.user )
            req.query.user = {$nin:[mongoose.Types.ObjectId('5d365cef8a881d40f16058b6')]};
        else
            req.query.user = mongoose.Types.ObjectId(req.query.user);

        // filter ticket opps redeemed ticket opps
        if( req.query.ticketOpps ) {
            if( !Array.isArray(req.query.ticketOpps) ) req.query.ticketOpps = [req.query.ticketOpps];

            req.query.refType = 'ticketOpp';
            req.query.ref = {$in:req.query.ticketOpps};

            delete req.query.ticketOpps;
        }

        let sortDir = 1;
        if( sortParam.substr(0, 1) === '-' ) {
            sortDir = -1;
            sortParam = sortParam.substr(1);
        }
        const sort = {};
        sort[sortParam] = sortDir;

        req.query = {
            query: req.query,
            skip,
            limit,
            sort,
            groupBy
        };
    }
    next();
}

async function insert(req, res) {
    const ctrl = new Ctrl();
    let ticket = await ctrl.insert(req.body);
    res.json(ticket);
}

async function get(req, res) {
    const ctrl = new Ctrl();
    const tickets = await ctrl.get(req.query);
    res.json(tickets);
}

async function getById(req, res) {
    const ctrl = new Ctrl();
    const ticket = await ctrl.getById(req.params.id);
    res.json(ticket);
}

async function update(req, res) {
    const ctrl = new Ctrl();
    let ticket = await ctrl.update(req.params.id, req.body);
    res.json(ticket);
}

async function remove(req, res) {
    const ctrl = new Ctrl();
    await ctrl.remove(req.params.id);
    res.json();
}

async function myTickets(req, res) {
    const crtl = new Ctrl();

    req.query.query.user = mongoose.Types.ObjectId(req.params.userId);
    const tickets = await crtl.myTicketCount(req.query);

    res.json(tickets);
}

async function getCount(req, res) {
    const crtl = new Ctrl();
    const count = await crtl.getCount(req.query);
    res.json(count);
}

async function getCounts(req, res) {
    const crtl = new Ctrl();
    const tickets = await crtl.ticketCounts(req.query);
    res.json(tickets);
}

async function cleanUp(req, res) {
    const crtl = new Ctrl();
    const tickets = await crtl.get({query:{ref:mongoose.Types.ObjectId('5e20ee6176255c15cc456eec')}});

    const usersTickets = [];
    tickets.forEach((ticket)=> {
        const date = moment(ticket.createdAt).format('MM/DD/YYYY');
        if( !usersTickets[ticket.user._id] ) usersTickets[ticket.user._id] = [];
        if( !usersTickets[ticket.user._id][date] ) usersTickets[ticket.user._id][date] = [];

        usersTickets[ticket.user._id][date].push(mongoose.Types.ObjectId(ticket._id));
    });

    // console.log(usersTickets);
    let ids = [];
    Object.keys(usersTickets).forEach((i) => {
        const user = usersTickets[i];
        Object.keys(user).forEach((j) => {
            Object.keys(user[j]).forEach((k) => {
                if( k  > 0 )
                    ids.push(mongoose.Types.ObjectId(user[j][k]));
            });
        });
    });

    await crtl.delete({_id:{$in:ids}});

    res.json("Done");
}