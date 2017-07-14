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

module.exports = router;
