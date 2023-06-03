const express = require('express');
const foodController = require('../controllers/foodControllers');
const authController = require('../controllers/authControllers')


const router = express.Router();

router.get('/', authController.protect, foodController.getAllFoods);
router.get('/:name', foodController.getSingleFood);

module.exports = router;