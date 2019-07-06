const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))

router.route('/').get(asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id/check-subscription').get(asyncHandler(checkSubscription));


async function insert(req, res) {
    const newUser = req.body;
    // TODO:: super admins need to be able to specify which company
    newUser.company = req.user.company.toString(); // make the new user on the same company as the user creating it.

    let user = await userCtrl.insert(newUser);
    res.json(user);
}

async function get(req, res) {
    const users = await userCtrl.get(req.query);
    res.json(users);
}

async function getById(req, res) {
    const user = await  userCtrl.getById(req.params.id);
    res.json(user);
}

async function checkSubscription(req, res) {
    const subscribed = await userCtrl.checkSubscriptoin(req.params.id);
    res.json(subscribed);
}
