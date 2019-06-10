const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const CompanyCtrl = require('../controllers/company.controller');
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
    const companyCtrl = new CompanyCtrl();
    let company = await companyCtrl.insert(req.body);
    res.json(company);
}

async function get(req, res) {
    const companyCtrl = new CompanyCtrl();
    const companies = await companyCtrl.get(req.query);
    res.json(companies);
}

async function getById(req, res) {
    const companyCtrl = new CompanyCtrl();
    const company = await companyCtrl.getById(req.params.id);
    res.json(company);
}

async function update(req, res) {
    const companyCtrl = new CompanyCtrl();
    let company = await companyCtrl.update(req.params.id, req.body);
    res.json(company);
}

async function remove(req, res) {
    const companyCtrl = new CompanyCtrl();
    await companyCtrl.remove(req.params.id);
    res.json(null);
}