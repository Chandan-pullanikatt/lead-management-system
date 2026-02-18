const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth');

// @route   POST api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', login);

module.exports = router;
