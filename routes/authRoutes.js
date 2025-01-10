const express = require('express');
const { register, login, logout } = require('../controller/AuthController');
const router = express.Router();

// Register Route
router.post('/register', register);
// Login Route
router.post('/login', login);
//logout route
router.post('/logout', logout);

module.exports = router;
