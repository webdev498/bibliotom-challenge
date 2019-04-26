const express = require('express');
const router = express.Router();

const userAuth = require('../controllers/user.controller');

module.exports = router;

// Authentication routes
router.post('/create', userAuth.register);
router.post('/signin', userAuth.login);