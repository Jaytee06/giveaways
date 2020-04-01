const express = require('express');
const asyncHandler = require('express-async-handler');
const Ctlr = require('../../controllers/category.controller');

const router = express.Router();
module.exports = router;

router.route('/').get(asyncHandler(get));

async function get(req, res) {
    const categoryCtrl = new Ctlr();
    const categories = await categoryCtrl.get(req.query);
    res.json(categories);
}