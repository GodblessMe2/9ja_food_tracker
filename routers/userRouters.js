const userController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers')
const express = require('express');

const router = express.Router();
router
  .post('/signup', authController.signup);

module.exports = router;