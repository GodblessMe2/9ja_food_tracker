const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel');
exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create

})
