const bcrypt = require('bcrypt');
const Joi = require('joi');
const User = require('../models/user.model');

const userSchema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email(),
    mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
    password: Joi.string().required(),
    roles: Joi.array(),
    company: Joi.string().required(),
    repeatPassword: Joi.string().required().valid(Joi.ref('password'))
});


module.exports = {
    insert,
    get,
    getById,
}

async function insert(user) {
    console.log(user.company, typeof user.company);
  user = await Joi.validate(user, userSchema, { abortEarly: false });
  user.hashedPassword = bcrypt.hashSync(user.password, 10);
  delete user.password;
  return await new User(user).save();
}

async function get(query) {
    return await User.find().populate('roles');
}

async function getById(id) {
    return await User.findById(id);
}