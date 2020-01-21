const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const Ctlr = require('../controllers/product.controller');
const requireRole = require('../middleware/require-role');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))
router.use(requireRole);

router.route('/').get(asyncHandler(preQuery), asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/counts').get(asyncHandler(getProductCounts));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));

async function preQuery(req, res, next) {

    if( req.query ) {

        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 1000;
        let sortParam = req.query.sort || '-createdAt';
        delete req.query.skip;
        delete req.query.limit;
        delete req.query.sort;

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
            sort
        };
    }
    next();
}

async function insert(req, res) {
    const ctlr = new Ctlr();

    req.body.user = req.user._id;

    let product = await ctlr.insert(req.body);
    res.json(product);
}

async function get(req, res) {
    const ctlr = new Ctlr();

    const products = await ctlr.get(req.query);
    res.json(products);
}

async function getById(req, res) {
    const ctlr = new Ctlr();
    const product = await ctlr.getById(req.params.id);
    res.json(product);
}

async function update(req, res) {
    const ctlr = new Ctlr();

    let product = await ctlr.update(req.params.id, req.body);
    res.json(product);
}

async function remove(req, res) {
    const ctlr = new Ctlr();
    await ctlr.remove(req.params.id);
    res.json();
}

async function getProductCounts(req, res) {
    const ctlr = new Ctlr();

    // const counts = await ctlr.getProductCounts({query: req.query});
    // res.json(counts);
    res.json([]);
}