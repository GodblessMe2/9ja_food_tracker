const userController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers')
const express = require('express');

const router = express.Router();
router
  .post('/signup', authController.signup)
  .post('/login', authController.login)
  .post('/forgotPassword', authController.forgotPassword)
  .patch('/resetPassword/:token', authController.resetPassword)
  .get('/logout', authController.logout)
  .get('/me', authController.protect, userController.getMe, userController.currentUser);

module.exports = router;