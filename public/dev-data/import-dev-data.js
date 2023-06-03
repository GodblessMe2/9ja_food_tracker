const fs = require('fs');
const mongoose = require('mongoose');
const Food = require('../../models/foodModel');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const db = process.env.DATABASE_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(db, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.log('DB Connected Successfully')
});

const foodTrack = JSON.parse(fs.readFileSync(`${__dirname}/foodnew.json`));

const importData = async () => {
  try {
    await Food.create(foodTrack, { validateBeforeSave: false});
    console.log('Data uploaded successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

if(process.argv[2] === '--import') {
  importData();
}
