const express = require('express');
const asyncHandler = require('express-async-handler');
const Ctlr = require('../../controllers/raffle.controller');

const router = express.Router();
module.exports = router;

router.route('/current').get(asyncHandler(current));

async function current(req, res) {
    const ctlr = new Ctlr();
    const pastRaffles = await ctlr.get({query: {start:{$lt:new Date()}}, limit:2, sort:"-start"});
    pastRaffles.sort((a, b) => new Date(a.start) - new Date(b.start));
    const upcommingRaffles = await ctlr.get({query:{start:{$gt:new Date()}}, limit:5, sort:"start"});

    res.json(pastRaffles.concat(upcommingRaffles));
}