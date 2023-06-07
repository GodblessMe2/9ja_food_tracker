const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { log } = require('console');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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
  } else if(req.cookies.jwt) {
    token = req.cookies.jwt;
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
  req.user = currentUser;
  // res.locals.user = currentUser;

  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if(req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
    
      // 3. Check if user still exits
      const currentUser = await User.findById(decoded.id);
    
      if(!currentUser) {
        return next();
      }

      // There is a logged in user
      res.locals.user = currentUser;
      return next()
    } catch (err) {
      return next()
    }
  }
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const inputEmail = req.body.email;
  const user = await User.findOne({ email: req.body.email });

  if(!user) {
    return next(new AppError(`There is no user with this email: ${inputEmail}`, 404));
  }

  // Generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it to the user's email address
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a new password: ${resetURL}.\nIf you didn't forget your password, Please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token expires in 10 min from now',
      message
    });

    res
      .status(200)
      .json({
        status: 'Success',
        message: 'Token has been sent to your email'
      })
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email, Try again later'), 500);
  }
});

exports.resetPassword = catchAsync( async(req, res, next) => {
  // 1. Get user based on the token been sent and check if it this the right token
  const hashedToken = crypto
  .createHash('sha256')
  .update(req.params.token)
  .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  console.log(user);
  // 2. if token has expired or not valid, and the user is not valid, set new password
  if(!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // if token is good set the new password
  user.password = req.body.password,
  user.passwordChangeAt = req.body.passwordChangeAt
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res)
})

exports.logout = catchAsync( async(req, res, next) => {
  
  res.cookie('jwt', 'LoggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res
    .status(200)
    .json({
      status: 'Success'
    })
})