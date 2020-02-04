const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const Ctlr = require('../controllers/raffle.controller');
const TicketCtlr = require('../controllers/ticket.controller');
const FSCtlr = require('../controllers/fire-store.controller');
const requireRole = require('../middleware/require-role');
const mongoose = require('mongoose');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))
router.use(requireRole);

router.route('/').get(asyncHandler(preQuery), asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/current').get(asyncHandler(current));
router.route('/counts').get(asyncHandler(getRaffleCounts));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));
router.route('/:id/charge-tickets').get(asyncHandler(chargeTickets));
router.route('/:id/raffle-entry').get(asyncHandler(getRaffleEntries));
router.route('/:id/raffle-entry').post(asyncHandler(preSaveRaffleEntry), asyncHandler(insertRaffleEntry));
router.route('/:id/raffle-entry/:entryId').get(asyncHandler(getRaffleEntryById));
router.route('/:id/raffle-entry/:entryId').put(asyncHandler(preSaveRaffleEntry), asyncHandler(updateRaffleEntry));
router.route('/:id/raffle-entry/:entryId').delete(asyncHandler(removeRaffleEntry));

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

async function preQuery(req, res, next) {

    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 1000;
    let sort = req.query.sort || '-start';
    const groupBy = req.query.groupBy;
    delete req.query.skip;
    delete req.query.limit;
    delete req.query.sort;
    delete req.query.groupBy;

    if( req.body.winner )
        req.body.winner = mongoose.Types.ObjectId(req.body.winner);

    req.query = {
        query: req.query,
        skip,
        limit,
        sort,
        groupBy
    };

    next();
}

async function insert(req, res) {
    const ctlr = new Ctlr();

    req.body.user = req.user._id;

    let raffle = await ctlr.insert(req.body);
    res.json(raffle);
}

async function get(req, res) {
    const ctlr = new Ctlr();
    const raffles = await ctlr.get(req.query);
    res.json(raffles);
}

async function getById(req, res) {
    const ctlr = new Ctlr();
    const raffle = await ctlr.getById(req.params.id);
    res.json(raffle);
}

async function update(req, res) {
    const ctlr = new Ctlr();

    // don't allow this to be updated
    delete req.body.user;

    let raffle = await ctlr.update(req.params.id, req.body);
    res.json(raffle);
}

async function remove(req, res) {
    const ctlr = new Ctlr();
    await ctlr.remove(req.params.id);
    res.json();
}

async function current(req, res) {
    const ctlr = new Ctlr();
    const pastRaffles = await ctlr.get({query: {start:{$lt:new Date()}}, limit:2, sort:"-start"});
    pastRaffles.sort((a, b) => new Date(a.start) - new Date(b.start));
    const upcommingRaffles = await ctlr.get({query:{start:{$gt:new Date()}}, limit:5, sort:"start"});

    res.json(pastRaffles.concat(upcommingRaffles));
}

async function getRaffleCounts(req, res) {
    const ctlr = new Ctlr();

    // fix object ids
    if( req.query.raffle )
        req.query.raffle = mongoose.Types.ObjectId(req.query.raffle);

    const counts = await ctlr.getRaffleCounts({query: req.query});
    res.json(counts);
}

async function insertRaffleEntry(req, res) {
    const ctlr = new Ctlr();
    const fsCtlr = new FSCtlr();

    req.body.user = req.user._id;

    let raffleEntry = await ctlr.insertRaffleEntry(req.body);
    
    let raffleCounts = await ctlr.getRaffleCounts({query:{raffle:raffleEntry.raffle}});

    if( raffleCounts && raffleCounts.length )
        await fsCtlr.updateRaffle({_id:raffleEntry.raffle}, {totalTicketCount:raffleCounts[0].ticketCounts});

    res.json(raffleEntry);
}

async function getRaffleEntries(req, res) {
    const ctlr = new Ctlr();

    req.query.raffle = req.params.id;

    const raffleEntries = await ctlr.getRaffleEntry(req.query);
    res.json(raffleEntries);
}

async function getRaffleEntryById(req, res) {
    const ctlr = new Ctlr();

    const raffleEntry = await ctlr.getRaffleEntryById(req.params.entryId);
    res.json(raffleEntry);
}

async function updateRaffleEntry(req, res) {
    const ctlr = new Ctlr();
    const fsCtlr = new FSCtlr();

    // don't allow this to be updated
    delete req.body.user;

    let raffleEntry = await ctlr.updateRaffleEntry(req.params.entryId, req.body);

    let raffleCounts = await ctlr.getRaffleCounts({query:{raffle:raffleEntry.raffle}});

    if( raffleCounts && raffleCounts.length )
        await fsCtlr.updateRaffle({_id:raffleEntry.raffle}, {totalTicketCount:raffleCounts[0].ticketCounts});

    res.json(raffleEntry);
}

async function removeRaffleEntry(req, res) {
    const ctlr = new Ctlr();
    await ctlr.removeRaffleEntry(req.params.id);
    res.json();
}

async function chargeTickets(req, res) {
    const ctlr = new Ctlr();
    const ticketCtlr = new TicketCtlr();
    const fsCtlr = new FSCtlr();

    const raffle = await ctlr.getById(req.params.id);
    const raffleEntries = await ctlr.getRaffleEntry({raffle:req.params.id});
    const promises = raffleEntries.map(async (entry) => {

        const chargeTicket = {
            amount: entry.tickets*-1,
            user: entry.user._id,
            reason: 'Raffle Entry',
            ref: entry._id,
            refType: 'raffle',
        };
        await ticketCtlr.insert(chargeTicket);

        if( entry.user._id.toString() === raffle.winner._id.toString() ) {
            await fsCtlr.instertNotification(raffle.winner._id, {
                message:'You have won the raffle: '+raffle.giveAwayName+'!',
                ref: raffle._id+'',
                refType: 'raffle',
                type: 'raffle',
            });
        }
    });
    await Promise.all(promises);

    res.json();
}