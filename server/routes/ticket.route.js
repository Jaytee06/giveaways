const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const Ctrl = require('../controllers/ticket.controller');
const requireRole = require('../middleware/require-role');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))
router.use(requireRole);

router.route('/').get(asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));

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