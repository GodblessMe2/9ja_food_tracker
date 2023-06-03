const userController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers')
const express = require('express');

const router = express.Router();
router
  .post('/signup', authController.signup)
  .post('/login', authController.login)

module.exports = router;