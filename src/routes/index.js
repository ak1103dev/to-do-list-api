const { Router } = require('express');
const users = require('./users');
const tasks = require('./tasks');

const router = Router();
router.use('/users', users);
router.use('/tasks', tasks);

module.exports = router;
