const { Router } = require('express');
const Joi = require('joi');
const { Task } = require('../models');

Joi.objectId = require('joi-objectid')(Joi);
const router = Router();

router.get('/', (req, res) => {
  if (req.user) {
    return Task.find({ userId: req.user._id }).select('-userId -__v')
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

router.put('/:id', (req, res) => {
  if (!req.user) {
    return res.status(401).send({ message: 'Unauthorized User' });
  }
  const bodySchema = {
    text: Joi.string().required(),
    status: Joi.string().required(),
  }
  const paramsSchema = {
    id: Joi.objectId(),
  }
  const body = Joi.validate(req.body, bodySchema);
  const params = Joi.validate(req.params, paramsSchema);
  if (params.error) {
    return res.status(400).send(params.error);
  }
  if (body.error) {
    return res.status(400).send(body.error);
  }
  const { text, status } = body.value;
  const { id } = params.value;
  return Task.findOne({ _id: id })
    .then((task) => {
      if (task) {
        task._id = id;
        task.text = text;
        task.status = status;
        task.userId = req.user._id;
        return task.save();
      }
      return Promise.reject({ code: 400, message: 'Invalid task ID' });
    })
    .then((task) => res.send(task))
    .catch((err) => res.status(err.code || 500).send({ error: err }));
});

module.exports = router;
