const express = require('express');
const viewController = require('../controllers/viewsController')
const authController = require('../controllers/authControllers')

const router = express.Router();

router.get('/index', viewController.getLogInOutForm);
router.get('/', authController.protect, viewController.displayDashboard);
router.patch('/passwordRest', viewController.passwordReset);

module.exports = router