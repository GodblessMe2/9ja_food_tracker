const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Food = require('../models/foodModel')

exports.getAllFoods = catchAsync( async (req, res, next) => {
  const foods = await Food.find();

  res
    .status(200)
    .json({
      status: 'Success',
      requestedAt: req.requestTime,
      count: foods.length,
      data: {
        foodItem: foods
      }
    })
});

exports.getSingleFood = catchAsync( async (req, res, next) => {
  const name = req.params.name;
  const food = await Food.findOne({ name });
  res
    .status(200)
    .json({
      status: 'Success',
      requestedAt: req.requestTime,
      data: {
        foodItem: food
      }
    })
})
