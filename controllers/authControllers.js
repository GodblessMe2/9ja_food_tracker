const cryto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { log } = require('console');
const AppError = require('../utils/appError');

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
})

exports.login = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;

  // 1. Check if the email and password is not empty
  if(!email || !password) {
    return next(new AppError('Please provide email and password', 404));
  }

  // Check if the user exist && password is correct
  const user = await User.findOne({ email }).select('+password');

  if(!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 404));
  }

  // If the email and password is correct, send token to the client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1. Getting token and check if it is there
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  // If the token is not on the header or cookies return to login
  if(!token) {
    return next(new AppError('Please you have not logged in! Log in to get access', 401));
  }

  // 2. Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exits
  const currentUser = await User.findById(decoded.id);

  if(!currentUser) {
    return next(new AppError('The token does not longer exist', 401));
  } 

  // Grant access to protected route
  res.user = currentUser;
  res.locals.user = currentUser;

  next();
});