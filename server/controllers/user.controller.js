const bcrypt = require('bcrypt');
const request = require('request');
const Joi = require('joi');
const User = require('../models/user.model');
const config = require('../config/config');

const userSchema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email(),
    mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
    // password: Joi.string().required(),
    roles: Joi.array(),
    provider: Joi.string(),
    providerId: Joi.string(),
    accessToken: Joi.string(),
    refreshToken: Joi.string(),
    imageUrl: Joi.string(),
    twitch: Joi.object(),
    //repeatPassword: Joi.string().required().valid(Joi.ref('password'))
});


module.exports = {
    insert,
    get,
    getById,
    update,
    checkSubscription
};

async function insert(user) {
  user = await Joi.validate(user, userSchema, { abortEarly: false });
  //user.hashedPassword = bcrypt.hashSync(user.password, 10);
  delete user.password;
  return await new User(user).save();
}

async function get(query) {
    return await User.find(query).populate('roles');
}

async function getById(id) {
    return await User.findById(id).populate('roles');
}

async function update(id, user) {
    return await User.findByIdAndUpdate(id, user, {new: true});
}

async function checkSubscription(id) {
    const user = await User.findById(id);

    const token = await _getBroadcasterAuthToken();

    return new Promise((resolve, reject) => {

        const url = `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${config.twitchBroadcasterId}&user_id=${user.twitch.providerId}`;
        const headers = {
            'Authorization': 'Bearer '+token,
        };
        const req = request(url, { headers, json: true }, (err, res, body) => {
            //console.log(err, body);
            if (err) {
                console.log(err);
                return reject(new Error(err));
            }

            if( body && body.data && body.data.length )
                resolve(true);
            else
                resolve(false);
        });
        req.on('error', function(err) {
            reject(err);
        });
        req.end();
    });
}

async function _getBroadcasterAuthToken() {

    let user = await User.find({'twitch.providerId':config.twitchBroadcasterId});

    return new Promise((resolve, reject) => {
        if( !user || !user.length )
            return reject(new Error("Couldn't find a Broadcaster"));

        user = user[0];

        // check if token is valid
        const url = `https://api.twitch.tv/kraken?api_version=5&oauth_token=${user.twitch.accessToken}`;
        const req = request(url, {json: true},(err, res, body) => {
            //console.log(err, body);
            if (err) {
                console.log(err);
                return reject(new Error(err));
            }

            if( body && body.token && body.token.valid ) {
                resolve(user.twitch.accessToken);
            } else {
                // if not refresh the token
                const url2 = `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${user.twitch.refreshToken}&client_id=${config.twitchClientId}&client_secret=${config.twitchClientSecret}`;
                const req2 = request.post(url2, {json: true}, (err2, res2, body2) => {
                    //console.log('2222', err2, body2);
                    if (err2) {
                        console.log(err2);
                        return reject(new Error(err2));
                    }

                    if( body2 && body2.access_token ) {
                        user.twitch.accessToken = body2.access_token;
                        user.twitch.refreshToken = body2.refresh_token;
                        update(user._id, user);

                        resolve(body2.access_token);
                    } else {
                        return reject(new Error("Couldn't get new access token."));
                    }

                });
                req2.on('error', function(err) {
                    reject(err);
                });
                req2.end();
            }
        });
        req.on('error', function(err) {
            reject(err);
        });
        req.end();
    });

}