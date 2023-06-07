const express = require('express');
const viewController = require('../controllers/viewsController')

const router = express.Router();

router.get('/index', viewController.getLogInOutForm);

module.exports = router