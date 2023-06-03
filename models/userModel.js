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
    minlength: 8,
    unique: false,
    select: false
  },
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

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);
module.exports = User;
