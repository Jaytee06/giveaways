const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/user.model');

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