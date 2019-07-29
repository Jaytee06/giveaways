const bcrypt = require('bcrypt');
const request = require('request');
const Joi = require('joi');
const Role = require('../models/role.model'); // needed for populate in crons
const Address = require('../models/address.model'); // needed for populate in crons
const User = require('../models/user.model');
const TicketCtlr = require('../controllers/ticket.controller');
const FireStoreCtrl = require('../controllers/fire-store.controller');
const BaseCtrl = require('../controllers/base.controller');
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
	address: Joi.object(),
	emailToken: Joi.string(),
	//repeatPassword: Joi.string().required().valid(Joi.ref('password'))
});


module.exports = {
	insert,
	get,
	getById,
	update,
	checkSubscription,
	getCounts,
};

async function insert(user) {
	const ticketCtrl = new TicketCtlr();
	const fsCtrl = new FireStoreCtrl();
	const baseCtrl = new BaseCtrl();

	user = await Joi.validate(user, userSchema, {abortEarly: false});

	// if address attribute is an object
	if (user.address) {
		if (user.address.billing && user.address.billing.address) {
			user.address.billing = await baseCtrl.castAddress(user.address.billing, false);
		}
		if (user.address.shipping && user.address.shipping.address) {
			user.address.shipping = await baseCtrl.castAddress(user.address.shipping, false);
		}
	}

	//user.hashedPassword = bcrypt.hashSync(user.password, 10);
	delete user.password;
	const newUser = await new User(user).save();

	// give the user a signup bonus of tickets
	const obj = {
		amount: 1000,
		user: newUser._id,
		reason: 'Vintley sign up with 10X bonus!',
		ref: newUser._id,
		refType: 'signUp'
	};
	await ticketCtrl.insert(obj);

	await fsCtrl.instertNotification( obj.user,{
		message:'You received '+obj.amount+' for a signing up. With a 10X bonus!',
		ref: obj.ref,
		refType: obj.refType,
		type: 'tickets',
	});

	return newUser;
}

async function get(query) {
	return await User.find(query).populate('roles address.shipping');
}

async function getById(id) {
	return await User.findById(id).populate('roles address.shipping');
}

async function update(id, user) {
	const baseCtrl = new BaseCtrl();

	// if address attribute is an object
	if (user.address) {
		if (user.address.billing && user.address.billing.address) {
			user.address.billing = await baseCtrl.castAddress(user.address.billing, false);
		}
		if (user.address.shipping && user.address.shipping.address) {
			user.address.shipping = await baseCtrl.castAddress(user.address.shipping, false);
		}
	}

	return await User.findByIdAndUpdate(id, user, {new: true}).populate('roles address.shipping');
}

async function checkSubscription(id) {
	const user = await User.findById(id);

	const token = await _getBroadcasterAuthToken();

	return new Promise((resolve, reject) => {

		const bypassTwitchIds = ['101440545'];
		if( bypassTwitchIds.indexOf(user.twitch.providerId) > -1 ) {
			resolve(true);
			return;
		}

		const url = `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${config.twitchBroadcasterId}&user_id=${user.twitch.providerId}`;
		const headers = {
			'Authorization': 'Bearer ' + token,
		};
		const req = request(url, {headers, json: true}, (err, res, body) => {
			//console.log(err, body);
			if (err) {
				console.log(err);
				return reject(new Error(err));
			}

			if (body && body.data && body.data.length)
				resolve(true);
			else
				resolve(false);
		});
		req.on('error', function (err) {
			reject(err);
		});
		req.end();
	});
}

async function getCounts() {

	const agg = [
		{ $group:{_id:null, count:{$sum:1}} }
	];

	return await User.aggregate(agg);
}

async function _getBroadcasterAuthToken() {

	let user = await User.find({'twitch.providerId': config.twitchBroadcasterId});

	return new Promise((resolve, reject) => {
		if (!user || !user.length)
			return reject(new Error("Couldn't find a Broadcaster"));

		user = user[0];

		// check if token is valid
		const url = `https://api.twitch.tv/kraken?api_version=5&oauth_token=${user.twitch.accessToken}`;
		const req = request(url, {json: true}, (err, res, body) => {
			//console.log(err, body);
			if (err) {
				console.log(err);
				return reject(new Error(err));
			}

			if (body && body.token && body.token.valid) {
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

					if (body2 && body2.access_token) {
						user.twitch.accessToken = body2.access_token;
						user.twitch.refreshToken = body2.refresh_token;
						update(user._id, user);

						resolve(body2.access_token);
					} else {
						return reject(new Error("Couldn't get new access token."));
					}

				});
				req2.on('error', function (err) {
					reject(err);
				});
				req2.end();
			}
		});
		req.on('error', function (err) {
			reject(err);
		});
		req.end();
	});

}