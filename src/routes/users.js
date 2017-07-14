const { Router } = require('express');
const Joi = require('joi');
const { User } = require('../models');

const router = Router();

router.get('/me', (req, res) => {
  res.send('hello');
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
  return User.findOne({ username })
    .then((user) => {
      if (user) {
        return Promise.reject({ code: 400, message: 'This username already exits' });
      }
      return new User({ username, password }).save();
    })
    .then((user) => res.send(user))
    .catch((err) => res.status(err.code || 500).send({ error: err }));
});

module.exports = router;
