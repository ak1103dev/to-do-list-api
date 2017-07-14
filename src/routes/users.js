const { Router } = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User, AccessToken } = require('../models');
const generateToken = require('../utils/generateToken');

const router = Router();

router.get('/me', (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.status(401).send({ message: 'Unauthorized User' });
  }
});


router.post('/', (req, res) => {
  const bodySchema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
  }
  const { error, value } = Joi.validate(req.body, bodySchema);
  if (error) {
    return res.status(400).send(error);
  }
  const { username, password } = value;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return User.findOne({ username })
    .then((user) => {
      if (user) {
        return Promise.reject({ code: 400, message: 'This username already exits' });
      }
      return new User({ username, password: passwordHash }).save();
    })
    .then((user) => {
      user.password = undefined;
      return res.send(user)
    })
    .catch((err) => res.status(err.code || 500).send({ error: err }));
});

router.post('/login', (req, res) => {
  const bodySchema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
  }
  const { error, value } = Joi.validate(req.body, bodySchema);
  if (error) {
    return res.status(400).send(error);
  }
  const { username, password } = value;
  User.findOne({ username })
    .then((user) => {
       if (!user) {
        return Promise.reject({ code: 400, message: 'Email or password is wrong.' });
      }
      const hasPassword = bcrypt.compareSync(password, user.password);
      if (!hasPassword) {
        return Promise.reject({ code: 400, message: 'Email or password is wrong.' });
      }
      return generateToken()
        .then((token) => {
          new AccessToken({ token, userId: user._id }).save();
          user.password = undefined;
          return res.send({
            user,
            accessToken: token,
          });
        });
    })
    .catch((err) => {
      return res.status(err.code || 500).send({ error: err })
    });
});


module.exports = router;
