const cryto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { log } = require('console');

// Create a function for Token Send 
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }
  if(process.env.NODE_ENV === 'production') cookieOption.secure = true;

  res.cookie('jwt', token, cookieOption)

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}

const signToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create(req.body);
  
  createSendToken(newUser, 201, res)

  console.log(newUser);
}) 