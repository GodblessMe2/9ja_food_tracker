const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator')
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    maxLength: [20, 'User name must be less or equal to 20 characters'],
    minLength: [10, 'User name must be greater or equal to 10 characters'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'Please provide a valid Email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    validate:[validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a Password'],
    minlength: [8, 'Password must be greater or equal to 8'],
    unique: false,
    select: false
  },
  passwordCreatedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Save Password into the date database
userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  // Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function (next) {
  // Check if password was actually modified then add the current date
  if(!this.isModified('password') || this.isNew) return next(); 

  this.passwordCreatedAt = Date.now() - 1000;

  next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
}

const User = mongoose.model('User', userSchema);
module.exports = User;
