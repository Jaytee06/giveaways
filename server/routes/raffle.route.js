const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const Ctrl = require('../controllers/raffle.controller');
const requireRole = require('../middleware/require-role');
const mongoose = require('mongoose');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))
router.use(requireRole);

router.route('/').get(asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/current').get(asyncHandler(current));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));

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