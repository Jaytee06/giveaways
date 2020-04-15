const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const CategoryCtrl = require('../controllers/category.controller');
const requireRole = require('../middleware/require-role');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }));
router.use(requireRole);

router.route('/').get(asyncHandler(preQuery), asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));

async function preQuery(req, res) {
    const aggData = {};
    if( req.query ) {

        if( req.query.getCount && req.query.getCount === 'true' ) {
            aggData.getPostCount = true;
            delete req.query.getCount;
        }

    }

    req.query = {
        query: req.query,
        aggData,
    };
}

async function insert(req, res) {
    const categoryCtrl = new CategoryCtrl();
    let category = await categoryCtrl.insert(req.body);
    res.json(category);
}

async function get(req, res) {
    const categoryCtrl = new CategoryCtrl();
    const categories = await categoryCtrl.get(req.query);
    res.json(categories);
}

async function getById(req, res) {
    const categoryCtrl = new CategoryCtrl();
    const category = await categoryCtrl.getById(req.params.id);
    res.json(category);
}

async function update(req, res) {
    const categoryCtrl = new CategoryCtrl();
    let category = await categoryCtrl.update(req.params.id, req.body);
    res.json(category);
}

async function remove(req, res) {
    const categoryCtrl = new CategoryCtrl();
    await categoryCtrl.remove(req.params.id);
    res.json(null);
}