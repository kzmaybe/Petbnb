const express = require('express');               // Import Express router
const { signup, login } = require('../controllers/authController'); // Import auth logic
const router = express.Router();                  // Create router instance

// Signup route: create new user
router.post('/signup', signup);

// Login route: authenticate user and return JWT
router.post('/login', login);

module.exports = router;                          // Export router to use in index.js
