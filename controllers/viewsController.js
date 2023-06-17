const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


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

exports.passwordReset = (req, res) => {
  res
    .status(200)
    .render('passwordReset', {
      title: 'Password Reset'
    })
}