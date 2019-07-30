const express = require('express');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const LeadCtrl = require('../controllers/lead.controller');
const config = require('../config/config');

const router = express.Router();
module.exports = router;

router.get('/twitch', passport.authenticate("twitch"));
router.get('/twitch/callback', passport.authenticate("twitch", {failureRedirect:"/"}), twitchLogin);
//router.post('/register', asyncHandler(register), login);
//router.post('/login', passport.authenticate('local', { session: false }), login);
//router.get('/me', passport.authenticate('jwt', { session: false }), login);
router.get('/user-counts', asyncHandler(getUserCounts));
router.post('/user-lead', asyncHandler(insertUserLead));

async function register(req, res, next) {
    let user = await userCtrl.insert(req.body);
    user = user.toObject();
    delete user.hashedPassword;
    req.user = user;
    next()
}

function login(req, res) {
    let user = req.user;
    const token = authCtrl.generateToken(user);
    res.json({user, token});
}

function twitchLogin(req, res) {

	let baseUrl = 'http://localhost:4300';
	if( config.env === 'production' )
		baseUrl = config.serverURL;

	console.log(baseUrl, 'should redirect');
    res.redirect(baseUrl+'?user='+req.user._id+'&token='+authCtrl.generateToken(req.user));
}

async function getUserCounts(req, res) {
	const counts = await userCtrl.getCounts();
	res.json(counts);
}

async function insertUserLead(req, res) {
	const leadCtrl = new LeadCtrl();
	const lead = await leadCtrl.insert(req.body);
	res.json(lead);
}
