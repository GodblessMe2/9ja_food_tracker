const express = require('express');
const viewController = require('../controllers/viewsController')
const authController = require('../controllers/authControllers')

const router = express.Router();

router.get('/', viewController.getLogInOutForm);
router.get('/dashboard', authController.protect, viewController.displayDashboard);
router.get('/passwordReset/:token', viewController.passwordReset);

module.exports = router