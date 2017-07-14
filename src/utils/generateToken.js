const randomstring = require('randomstring');
const { AccessToken } = require('../models/');

const generateToken = () => {
  const promise = (resolve) => {
    const token = randomstring.generate(48);
    AccessToken.findOne({ token }, (err, accessToken) => {
      if (err || accessToken) {
        promise(resolve);
      } else {
        resolve(token);
      }
    });
  };
  return new Promise(promise);
};

module.exports = generateToken;
