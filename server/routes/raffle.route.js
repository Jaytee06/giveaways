const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const Ctrl = require('../controllers/raffle.controller');
const TicketCtlr = require('../controllers/ticket.controller');
const requireRole = require('../middleware/require-role');
const mongoose = require('mongoose');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))
router.use(requireRole);

router.route('/').get(asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/current').get(asyncHandler(current));
router.route('/counts').get(asyncHandler(getRaffleCounts));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));
router.route('/:id/charge-tickets').get(asyncHandler(chargeTickets));
router.route('/:id/raffle-entry').get(asyncHandler(getRaffleEntries));
router.route('/:id/raffle-entry').post(asyncHandler(preSaveRaffleEntry), asyncHandler(insertRaffleEntry));
router.route('/:id/raffle-entry/:id').get(asyncHandler(getRaffleEntryById));
router.route('/:id/raffle-entry/:id').put(asyncHandler(preSaveRaffleEntry), asyncHandler(updateRaffleEntry));
router.route('/:id/raffle-entry/:id').delete(asyncHandler(removeRaffleEntry));

async function preSaveRaffleEntry(req, res, next) {

    if( req.body ) {

        // make sure the user is not spending more tickets than they have
        if( req.body.tickets ) {

            const ticketCtlr = new TicketCtlr();
            const maxTicketCounts = await ticketCtlr.ticketCounts({query:{user: req.user._id}});
            if( !maxTicketCounts || maxTicketCounts.length == 0 || req.body.tickets > maxTicketCounts[0].count ) {
                res.status(401).send("You do not have enough tickets for this.");
                return;
            }

        }

    }

    next()
}

async function insert(req, res) {
    const ctrl = new Ctrl();

    req.body.user = req.user._id;

    let raffle = await ctrl.insert(req.body);
    res.json(raffle);
}

async function get(req, res) {
    const ctrl = new Ctrl();
    const raffles = await ctrl.get(req.query);
    res.json(raffles);
}

async function getById(req, res) {
    const ctrl = new Ctrl();
    const raffle = await ctrl.getById(req.params.id);
    res.json(raffle);
}

async function update(req, res) {
    const ctrl = new Ctrl();

    // don't allow this to be updated
    delete req.body.user;

    let raffle = await ctrl.update(req.params.id, req.body);
    res.json(raffle);
}

async function remove(req, res) {
    const ctrl = new Ctrl();
    await ctrl.remove(req.params.id);
    res.json();
}

async function current(req, res) {
    const ctrl = new Ctrl();
    const pastRaffles = await ctrl.get({start:{$lt:new Date()}}, {limit:2}, "-start");
    pastRaffles.sort((a, b) => new Date(a.start) - new Date(b.start));
    const upcommingRaffles = await ctrl.get({start:{$gt:new Date()}}, {limit:5}, "start");

    res.json(pastRaffles.concat(upcommingRaffles));
}

async function getRaffleCounts(req, res) {
    const ctrl = new Ctrl();

    // fix object ids
    if( req.query.raffle )
        req.query.raffle = mongoose.Types.ObjectId(req.query.raffle);

    const counts = await ctrl.getRaffleCounts({query: req.query});
    res.json(counts);
}

async function insertRaffleEntry(req, res) {
    const ctrl = new Ctrl();

    req.body.user = req.user._id;

    let raffleEntry = await ctrl.insertRaffleEntry(req.body);
    res.json(raffleEntry);
}

async function getRaffleEntries(req, res) {
    const ctrl = new Ctrl();
    const raffleEntries = await ctrl.getRaffleEntry({raffle:req.params.id});
    res.json(raffleEntries);
}

async function getRaffleEntryById(req, res) {
    const ctrl = new Ctrl();
    const raffleEntry = await ctrl.getRaffleEntryById(req.params.id);
    res.json(raffleEntry);
}

async function updateRaffleEntry(req, res) {
    const ctrl = new Ctrl();

    // don't allow this to be updated
    delete req.body.user;

    let raffleEntry = await ctrl.updateRaffleEntry(req.params.id, req.body);
    res.json(raffleEntry);
}

async function removeRaffleEntry(req, res) {
    const ctrl = new Ctrl();
    await ctrl.removeRaffleEntry(req.params.id);
    res.json();
}

async function chargeTickets(req, res) {
    const ctrl = new Ctrl();
    const ticketCtrl = new TicketCtlr();

    const raffleEntries = await ctrl.getRaffleEntry({raffle:req.params.id});
    const promises = raffleEntries.map(async (entry) => {

        const chargeTicket = {
            amount: entry.tickets*-1,
            user: entry.user._id,
            reason: 'Raffle Entry',
            ref: entry._id,
            refType: 'raffle',
        };
        await ticketCtrl.insert(chargeTicket);
    });
    await Promise.all(promises);

    res.json();
}