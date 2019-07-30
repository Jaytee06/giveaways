const jwt = require('jsonwebtoken');
const config = require('../config/config');


module.exports = {
  generateToken
};


function generateToken(user, expiresIn='10h') {
  //const payload = JSON.stringify(user);
  return jwt.sign({
    _id: user._id,
    email: user.email,
    fullname: user.fullname,
    hashedPassword: user.hashedPassword,
    recoveryPassword: user.recoveryPassword, // for recovery password authentication
  }, config.jwtSecret, { expiresIn });
  //return jwt.sign(user, config.jwtSecret, { expiresIn: '10h' });
}
