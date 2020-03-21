const passport = require('passport');
const TwitchStrategy = require('passport-twitch-new').Strategy;
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const TicketCtrl = require('../controllers/ticket.controller');
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
        const ticketCtrl = new TicketCtrl();
        const newUser = {twitch:{accessToken, refreshToken, provider: profile.provider, providerId: profile.id, imageUrl:profile.profile_image_url, username: profile.display_name, email:profile.email}};
        let users = await userCtrl.get({"twitch.providerId": profile.id});
        let user = null;
        if( !users || !users.length ) {
            users = await userCtrl.get({requesting:"twitch"});
        }
        if( users && users.length ) {
            user = users[0];

            if( !user.twitch ) {
                user.twitch = {};

                // give the user a bonus of tickets for linking twitch
                const obj = {
                    amount: 1000,
                    user: user._id,
                    reason: 'Linked Twitch',
                    ref: "5e76815c1dac0e4739c37062",
                    refType: 'ticketOpp'
                };
                await ticketCtrl.insert(obj);
            }

            user.twitch.accessToken = accessToken;
            user.twitch.refreshToken = refreshToken;
            user.twitch.imageUrl = newUser.twitch.imageUrl;

            if( !user.profileImage || user.profileImage === 'assets/img/no_image_user.png' )
                user.profileImage = profile.profile_image_url;

            if( user.requesting ) {
                user.requesting = '';
                // dont over write
                delete user.fullname;
                delete user.email;
            }

            user = await userCtrl.checksLogin(user);
        } else {
            let role = await Role.findOne({slug: 'user'}); // default their role
            if( role )
                newUser.roles = [role._id];

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
    console.log('bb');
    if (!user || !bcrypt.compareSync(password, user.hashedPassword)) {
        return done(null, false, {error: 'Your login details could not be verified. Please try again.'});
    }
    user = await userCtrl.checksLogin(user);
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

    user = await userCtrl.checksLogin(user);
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
