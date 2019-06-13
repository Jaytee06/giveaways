const express = require('express');
const asyncHandler = require('express-async-handler')
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/config');

const router = express.Router();
module.exports = router;

router.get('/twitch', test, passport.authenticate("twitch"));
router.get('/twitch/callback', test, passport.authenticate("twitch", {failureRedirect:"/"}), twitchLogin);
//router.post('/register', asyncHandler(register), login);
//router.post('/login', passport.authenticate('local', { session: false }), login);
//router.get('/me', passport.authenticate('jwt', { session: false }), login);

async function test(req, res, next) {
    console.log('Here', req.headers.origin, config.serverURL+"/api/auth/twitch/callback");
    next();
}

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
    //res.redirect("/");
    let baseUrl = 'http://localhost:4300';
    if( config.NODE_ENV == 'production' )
        baseUrl = config.serverURL;

    res.redirect(baseUrl+'?user='+req.user._id+'&token='+authCtrl.generateToken(req.user));
}
