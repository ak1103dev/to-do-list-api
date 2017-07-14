const { Router } = require('express');
const Joi = require('joi');
const { Task } = require('../models');

const router = Router();

router.get('/', (req, res) => {
  if (req.user) {
    return Task.find()
      .then((tasks) => res.send(tasks));
  }
  return res.status(401).send({ message: 'Unauthorized User' });
});

router.post('/', (req, res) => {
  if (!req.user) {
    return res.status(401).send({ message: 'Unauthorized User' });
  }
  const bodySchema = {
    text: Joi.string().required(),
    status: Joi.string().required(),
  }
  const { error, value } = Joi.validate(req.body, bodySchema);
  if (error) {
    return res.status(400).send(error);
  }
  const { text, status } = value;
  return new Task({ text, status, userId: req.user._id }).save()
    .then((task) => res.send(task))
    .catch((err) => res.status(500).send({ error: err }));
});

module.exports = router;
