const passport = require('passport');
const TwitchStrategy = require('passport-twitch').Strategy;
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');

const userCtrl = require('../controllers/user.controller');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const config = require('./config');

const twitchLogin = new TwitchStrategy({
        clientID: config.twitchClientId,
        clientSecret: config.twitchClientSecret,
        callbackURL: config.serverURL+"/api/auth/twitch/callback",
        scope:['user_read', 'channel:read:subscriptions']
    },
    async function(accessToken, refreshToken, profile, done) {
        console.log('XXXXX', config.serverURL);
        const newUser = {twitch:{accessToken, refreshToken, provider: profile.provider, providerId: profile.id, imageUrl:profile._json.logo, username: profile.username, email:profile.email}, fullname: profile.username, email:profile.email};
        const users = await userCtrl.get({"twitch.providerId": profile.id});
        let user = null;
        if( users && users.length ) {
            user = users[0];
            user.twitch.accessToken = accessToken;
            user.twitch.refreshToken = refreshToken;
            user.twitch.imageUrl = newUser.twitch.imageUrl;
            user = await userCtrl.update(user._id, user);
        } else {
            let role = await Role.findOne({slug: 'user'}); // default their role
            if( role )
                newUser.roles = [role._id];

            user = await userCtrl.insert(newUser);
        }
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
