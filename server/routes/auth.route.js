const express = require('express');
const asyncHandler = require('express-async-handler');
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const LeadCtrl = require('../controllers/lead.controller');
const config = require('../config/config');
const Role = require('../models/role.model');

const router = express.Router();
module.exports = router;

router.get('/twitch', passport.authenticate("twitch"));
router.get('/twitch/callback', passport.authenticate("twitch", {failureRedirect:"/"}), twitchLogin);
router.post('/register', asyncHandler(register), login);
router.post('/login', passport.authenticate('local', { session: false }), login);
router.get('/me', passport.authenticate('jwt', { session: false }), login);
router.get('/user-counts', asyncHandler(getUserCounts));
router.post('/user-lead', asyncHandler(insertUserLead));
router.route('/recover-password').get(asyncHandler(recoverPassword));
router.route('/set-new-password').post(
	passport.authenticate('jwt', { session: false }),
	asyncHandler(setNewPassword),
);

async function register(req, res, next) {

	let role = await Role.findOne({slug: 'user'}); // default their role
	if( role )
		req.body.roles = [role._id];

    let user = await userCtrl.insert(req.body);
    user = user.toObject();
    delete user.hashedPassword;
    req.user = user;
    next()
}

function login(req, res) {
    let user = req.user;
    const token = authCtrl.generateToken(user);
    res.json({user:user._id, token});
}

function twitchLogin(req, res) {

	let baseUrl = 'http://localhost:4300';
	if( config.env === 'production' )
		baseUrl = config.serverURL;

	//console.log(baseUrl+'?user='+req.user._id+'&token='+authCtrl.generateToken(req.user), 'should redirect');
    res.redirect(baseUrl+'?user='+req.user._id+'&token='+authCtrl.generateToken(req.user));
    console.log('done redirect');
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

async function recoverPassword(req, res) {
	let result = await userCtrl.recoverPassword(req.get('referer'), req.query);
	res.status(result.status).json(result.payload);
}

async function setNewPassword(req, res) {
	if (req.user.recoveryPassword) {
		let result = await userCtrl.setNewPassword(req.user._id, req.body.password, req.user.email);
		res.status(result.status).json(result.payload);
	} else {
		res.status(401).json({ message: 'Unauthorized' });
	}
}
