const bcrypt = require('bcrypt');
const request = require('request');
const Joi = require('joi');
const Role = require('../models/role.model'); // needed for populate in crons
const Address = require('../models/address.model'); // needed for populate in crons
const User = require('../models/user.model');
const TicketCtrl = require('../controllers/ticket.controller');
const FireStoreCtrl = require('../controllers/fire-store.controller');
const BaseCtrl = require('../controllers/base.controller');
const config = require('../config/config');
const { Email } = require('../services');

const crypto = require('crypto');
const moment = require('moment');
const { recoveryPassword, passwordRecovered } = require('../email-templates');

const userSchema = Joi.object({
	fullname: Joi.string().required(),
	email: Joi.string().email(),
	mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
	password: Joi.string(),
	requesting: Joi.string(),
	roles: Joi.array(),
	provider: Joi.string(),
	providerId: Joi.string(),
	accessToken: Joi.string(),
	refreshToken: Joi.string(),
	imageUrl: Joi.string(),
	twitch: Joi.object(),
	address: Joi.object(),
	emailToken: Joi.string(),
	repeatPassword: Joi.string().valid(Joi.ref('password'))
});


module.exports = {
	insert,
	get,
	getById,
	update,
	checkSubscription,
	addReferrer,
	getCounts,
	checksLogin,
};

async function insert(user) {
	const ticketCtrl = new TicketCtrl();
	const fsCtrl = new FireStoreCtrl();
	const baseCtrl = new BaseCtrl();

	user = await Joi.validate(user, userSchema, {abortEarly: false});

	// if address attribute is an object
	if (user.address) {
		if (user.address.billing && user.address.billing.address) {
			user.address.billing = await baseCtrl.castAddress(user.address.billing, false);
		} else {
			delete user.address.billing;
		}
		if (user.address.shipping && user.address.shipping.address) {
			user.address.shipping = await baseCtrl.castAddress(user.address.shipping, false);
		} else {
			delete user.address.shipping;
		}
	}

	if( user.password ) {
		user.hashedPassword = bcrypt.hashSync(user.password, 10);
		delete user.password;
	}

	user.emailToken = crypto.randomBytes(24).toString('hex');
	user.referralToken = crypto.randomBytes(8).toString('hex');

	const newUser = await new User(user).save();

	// give the user a signup bonus of tickets
	const obj = {
		amount: 100,
		user: newUser._id,
		reason: 'Vintley sign up!',
		ref: newUser._id,
		refType: 'signUp'
	};
	await ticketCtrl.insert(obj);

	await fsCtrl.instertNotification( obj.user,{
		message:'You received '+obj.amount+' for a signing up.',
		ref: obj.ref+'',
		refType: obj.refType,
		type: 'tickets',
	});

	return newUser;
}

async function get(query) {
	console.log(JSON.stringify(query));
	return await User.find(query).populate('address.shipping');
}

async function getById(id) {
	let u = await User.findById(id).populate('address.shipping referrer').populate({path: 'roles', populate: {path: 'permissions.permission'}});

	let user = JSON.parse(JSON.stringify(u)); // copy to modify
	user.isSubscribed = false;
	user.isSubscribed = await this.checkSubscription(id);

	return user;
}

async function update(id, user) {
	const baseCtrl = new BaseCtrl();

	if( user.phone )
		user.phone = user.phone.replace(/\D+/g, '');

	if( user.password ) {
		user.hashedPassword = bcrypt.hashSync(user.password, 10);
		delete user.password;
	}

	// if address attribute is an object
	if (user.address) {
		if (user.address.billing && user.address.billing.address) {
			user.address.billing = await baseCtrl.castAddress(user.address.billing, false);
		} else {
			delete user.address.billing;
		}
		if (user.address.shipping && user.address.shipping.address) {
			user.address.shipping = await baseCtrl.castAddress(user.address.shipping, false);
		} else {
			delete user.address.shipping;
		}
	}

	return await User.findByIdAndUpdate(id, user, {new: true}).populate('address.shipping').populate({path: 'roles', populate: {path: 'permissions.permission'}});
}

async function checkSubscription(id) {
	const user = await User.findById(id);

	const token = await _getBroadcasterAuthToken();

	return new Promise((resolve, reject) => {

		if( !user.twitch )
			resolve(false);

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

async function addReferrer(userId, referralToken) {

	let user = await User.findOne({referralToken:{$exists:true}, referralToken});

	if( user ) {
		await User.findByIdAndUpdate(userId, {$set:{referrer:user._id}});
	}

	return user;
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

async function recoverPassword(url, query) {
	const user = (await this.get({ query, paginationQuery:{} }))[0];
	const result = { status: 200, payload: { message: 'success' } };

	if (!user) {
		result.status = 404;
		result.payload = { message: 'User not found' };
	} else {
		const recoveryToken = auth.generateToken({ _id: user._id, recoveryPassword: true }, '3m');
		Email.send('noreply@vintley.com', query.email, 'Password recovery', recoveryPassword({
			url,
			recoveryToken,
		}));
	}
	return result;
}

async function setNewPassword(user, password, email) {
	const result = { status: 200, payload: { message: 'success' } };
	try {
		await this.updatePassword(user, password);
		Email.send('noreply@vintley.com', email, 'Password Changed', passwordRecovered());

	} catch (e) {
		result.status = 400;
		result.payload.message = e.error;
	}
	return result;
}

async function checksLogin(user) {
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
	let f = user.loginLogs.filter((x) => moment(x).isAfter(moment().subtract(8, 'hour')));
	if( !f || !f.length )
		user.loginLogs.push(new Date);

	if( user.loginLogs.length > 300 )
		user.loginLogs = user.loginLogs.slice(-200);

	if( user.spinWheel && user.spinWheel.length > 300 )
		user.spinWheel = user.spinWheel.slice(-200);

	if(  typeof user.emailToken === 'undefined' )
		user.emailToken = crypto.randomBytes(24).toString('hex');
	if( typeof user.receiveEmails === 'undefined' )
		user.receiveEmails = true;
	if(  typeof user.referralToken === 'undefined' )
		user.referralToken = crypto.randomBytes(8).toString('hex');

	// dont overwrite their email
	delete user.email;

	return await this.update(user._id, user);
}