const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.currentUser = catchAsync( async(req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if(!user) {
    next(new AppError('User not found', 404));
  }

  res
    .status(200)
    .json({
      status: 'Success',
      data: {
        result: user
      }
    })
});
