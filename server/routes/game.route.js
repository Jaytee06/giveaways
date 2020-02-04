const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const GameCtrl = require('../controllers/game.controller');
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

async function remove(req, res) {
    const gameCtrl = new GameCtrl();
    await gameCtrl.remove(req.params.id);
    res.json(null);
}