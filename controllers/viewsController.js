const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel')


exports.getLogInOutForm = (req, res) => {
  res
    .status(200)
    .render('index', {
      title: 'Sign In/Up'
    })
}

exports.displayDashboard = (req, res) => {
  res
    .status(200)
    .render('dashboard', {
      title: 'Calories, Fat $ Protein'
    })
}

exports.passwordReset = async (req, res) => {
  const token = req.params.token;
  
  res
    .status(200)
    .render('passwordReset', {
      title: 'Password Reset',
      token
    })
}