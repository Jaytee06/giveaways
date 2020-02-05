const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const GameCtrl = require('../controllers/game.controller');
const requireRole = require('../middleware/require-role');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }));
router.use(requireRole);

router.route('/').get(asyncHandler(preQuery), asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/import/:provider').get(asyncHandler(importGames));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));

async function preQuery(req, res, next) {

    if( req.query ) {

        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 1000;
        let sortParam = req.query.sort || '-createdAt';
        const groupBy = req.query.groupBy;
        delete req.query.skip;
        delete req.query.limit;
        delete req.query.sort;
        delete req.query.groupBy;

        const dateRange = { $gte: new Date(req.query.startDateTime), $lt: new Date(req.query.endDateTime) };

        if (req.query.startDateTime) {
            req.query.createdAt = dateRange;

            delete req.query.startDateTime;
            delete req.query.endDateTime;
        }

        if( req.query.active && req.query.active === 'true' )
            req.query.active = true;

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
            sort,
            groupBy
        };
    }
    next();
}

async function insert(req, res) {
    const gameCtrl = new GameCtrl();
    let game = await gameCtrl.insert(req.body);
    res.json(game);
}

async function get(req, res) {
    const gameCtrl = new GameCtrl();
    const games = await gameCtrl.get(req.query);
    res.json(games);
}

async function getById(req, res) {
    const gameCtrl = new GameCtrl();
    const game = await gameCtrl.getById(req.params.id);
    res.json(game);
}

async function update(req, res) {
    const gameCtrl = new GameCtrl();
    let game = await gameCtrl.update(req.params.id, req.body);
    res.json(game);
}

async function importGames(req, res) {
    const gameCtrl = new GameCtrl();
    await gameCtrl.importGames(req.params.provider);
    res.json();
}

async function remove(req, res) {
    const gameCtrl = new GameCtrl();
    await gameCtrl.remove(req.params.id);
    res.json(null);
}