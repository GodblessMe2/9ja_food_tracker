const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  calories: Number,
  fat: Number,
  carbohydrate: Number,
  protein: Number
});

const FoodTrack = mongoose.model('Food', foodSchema);
module.exports = FoodTrack;
