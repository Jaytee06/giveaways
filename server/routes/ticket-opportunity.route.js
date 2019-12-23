const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const Ctrl = require('../controllers/ticket.controller');
const requireRole = require('../middleware/require-role');
const mongoose = require('mongoose');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))
router.use(requireRole);

router.route('/').get(asyncHandler(preQuery), asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));

async function preQuery(req, res, next) {

    if( req.query ) {

        let orArray = [];
        let andArray = [];

        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 1000;
        let sortParam = req.query.sort || '-createdAt';
        delete req.query.skip;
        delete req.query.limit;
        delete req.query.sort;

        const dateRange = { $gte: new Date(req.query.startDateTime), $lt: new Date(req.query.endDateTime) };

        if (req.query.startDateTime) {
            req.query.createdAt = dateRange;

            delete req.query.startDateTime;
            delete req.query.endDateTime;
        }

        if( req.query.liveDuringTime ) {
            req.query.startsAt = {$lt: new Date(req.query.liveDuringTime)};
            orArray.push({expiresAt: {$gt: new Date(req.query.liveDuringTime)}});
            orArray.push({expiresAt: {$eq:null}});
            orArray.push({expiresAt: {$exists:false}});

            delete req.query.liveDuringTime;
        }

        let sortDir = 1;
        if( sortParam.substr(0, 1) === '-' ) {
            sortDir = -1;
            sortParam = sortParam.substr(1);
        }
        const sort = {};
        sort[sortParam] = sortDir;

        if( orArray.length ) {
            andArray.push({$or: orArray});
        }

        if( andArray.length ) {
            req.query['$and'] = andArray;
        }

        req.query = {
            query: req.query,
            skip,
            limit,
            sort
        };
    }
    next();
}

async function insert(req, res) {
    const ctrl = new Ctrl();

    req.body.user = req.user._id;

    let ticketOpp = await ctrl.insertOpportunity(req.body);
    res.json(ticketOpp);
}

async function get(req, res) {
    const ctrl = new Ctrl();
    const ticketOpps = await ctrl.getOpportunities(req.query);
    res.json(ticketOpps);
}

async function getById(req, res) {
    const ctrl = new Ctrl();
    const ticketOpp = await ctrl.getOpportunityById(req.params.id);
    res.json(ticketOpp);
}

async function update(req, res) {
    const ctrl = new Ctrl();

    delete req.body.user;

    let ticketOpp = await ctrl.updateOpportunity(req.params.id, req.body);
    res.json(ticketOpp);
}

async function remove(req, res) {
    const ctrl = new Ctrl();
    await ctrl.removeOpportunity(req.params.id);
    res.json();
}
