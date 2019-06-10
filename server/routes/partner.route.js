const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const PartnerCtrl = require('../controllers/partner.controller');
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
    const partnerCtrl = new PartnerCtrl();
    let partner = await partnerCtrl.insert(req.body);
    res.json(partner);
}

async function get(req, res) {
    const partnerCtrl = new PartnerCtrl();
    const partners = await partnerCtrl.get(req.query);
    res.json(partners);
}

async function getById(req, res) {
    const partnerCtrl = new PartnerCtrl();
    const partner = await partnerCtrl.getById(req.params.id);
    res.json(partner);
}

async function update(req, res) {
    const partnerCtrl = new PartnerCtrl();
    let partner = await partnerCtrl.update(req.params.id, req.body);
    res.json(partner);
}

async function remove(req, res) {
    const partnerCtrl = new PartnerCtrl();
    await partnerCtrl.remove(req.params.id);
    res.json(null);
}