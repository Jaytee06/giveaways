const passport = require('passport');
const TwitchStrategy = require('passport-twitch-new').Strategy;
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const TicketCtrl = require('../controllers/ticket.controller');
const FireStoreCtrl = require('../controllers/fire-store.controller');
const moment = require('moment');

const userCtrl = require('../controllers/user.controller');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const config = require('./config');

const twitchLogin = new TwitchStrategy({
        clientID: config.twitchClientId,
        clientSecret: config.twitchClientSecret,
        callbackURL: config.serverURL+"/api/auth/twitch/callback",
        scope:['user_read', 'user:read:email']
    },
    async function(accessToken, refreshToken, profile, done) {
        const newUser = {twitch:{accessToken, refreshToken, provider: profile.provider, providerId: profile.id, imageUrl:profile.profile_image_url, username: profile.display_name, email:profile.email}, fullname: profile.display_name, email:profile.email};
        const users = await userCtrl.get({"twitch.providerId": profile.id});
        let user = null;
        if( users && users.length ) {
            user = users[0];
            user.twitch.accessToken = accessToken;
            user.twitch.refreshToken = refreshToken;
            user.twitch.imageUrl = newUser.twitch.imageUrl;

            if( !user.loginLogs ) user.loginLogs = [];
            // check for daily bonus
            // ignore vintley
            if( user.loginLogs.find(x => moment().startOf('day').isBefore(moment(x)) && moment().add(1, 'day').startOf('day').isAfter(moment(x))) === undefined ) { // first time login in today
                const ticketCtrl = new TicketCtrl();
                const fsCtrl = new FireStoreCtrl();

                const obj = {
                    amount:5,
                    user: user._id,
                    reason: 'Daily login bonus for '+moment().format('MM/DD/YYYY'),
                    ref: '5e20ee6176255c15cc456eec',
                    refType: 'ticketOpp'
                };
                ticketCtrl.insert(obj);

                fsCtrl.instertNotification( obj.user,{
                    message:'You received '+obj.amount+' for daily login!',
                    ref: obj.ref+'',
                    refType: obj.refType,
                    type: 'tickets',
                });
            }
            user.loginLogs.push(new Date);

            if(  typeof user.emailToken === 'undefined' )
                user.emailToken = crypto.randomBytes(24).toString('hex');
            if( typeof user.receiveEmails === 'undefined' )
                user.receiveEmails = true;
            if(  typeof user.referralToken === 'undefined' )
                user.referralToken = crypto.randomBytes(8).toString('hex');

            // dont overwrite their email
            delete user.email;

            user = await userCtrl.update(user._id, user);
        } else {
            let role = await Role.findOne({slug: 'user'}); // default their role
            if( role )
                newUser.roles = [role._id];

            newUser.emailToken = crypto.randomBytes(24).toString('hex');
            newUser.referralToken = crypto.randomBytes(8).toString('hex');

            user = await userCtrl.insert(newUser);
        }
        console.log('Done with passport');
        return done(null, user.toObject());
    }
);

const localLogin = new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
    let user = await User.findOne({ email }).populate({path:'roles', populate:{path:'permissions.permission'}});
    if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
        return done(null, false, {error: 'Your login details could not be verified. Please try again.'});
    }
    user = user.toObject();
    delete user.hashedPassword;
    done(null, user);
});

const jwtLogin = new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
}, async (payload, done) => {
    let user = await User.findById(payload._id).populate({path: 'roles', populate: {path: 'permissions.permission'}});
    if (!user) {
        return done(null, false);
    }
    user = user.toObject();
    delete user.hashedPassword;
    done(null, user);
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(twitchLogin);
passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
