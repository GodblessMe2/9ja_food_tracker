const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('Uncaught Exception 💥 shutting down....');
  console.log(err.name, err.message);
  process.exit(1)

});

dotenv.config({ path: './config.env'});
const app = require('./app');

const db = process.env.DATABASE_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(db, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(() => {
  console.log('DB Connected Successfully')
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
})

// process.on('unhandledRejection', err => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });