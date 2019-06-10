const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const CallCenterCtrl = require('../controllers/call-center.controller');
const requireRole = require('../middleware/require-role');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }));
router.use(requireRole);

router.route('/').get(asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));

async function insert(req, res) {
    const callCenterCtrl = new CallCenterCtrl();
    let callCenter = await callCenterCtrl.insert(req.body);
    res.json(callCenter);
}

async function get(req, res) {
    const callCenterCtrl = new CallCenterCtrl();
    const callCenters = await callCenterCtrl.get(req.query);
    res.json(callCenters);
}

async function getById(req, res) {
    const callCenterCtrl = new CallCenterCtrl();
    const callCenter = await callCenterCtrl.getById(req.params.id);
    res.json(callCenter);
}

async function update(req, res) {
    const callCenterCtrl = new CallCenterCtrl();
    let callCenter = await callCenterCtrl.update(req.params.id, req.body);
    res.json(callCenter);
}

async function remove(req, res) {
    const callCenterCtrl = new CallCenterCtrl();
    await callCenterCtrl.remove(req.params.id);
    res.json(null);
}