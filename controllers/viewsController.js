const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


exports.getLogInOutForm = (req, res) => {
  res
    .status(200)
    .render('index', {
      title: 'Sign In/Up'
    })
}