const userRouter = require('./routes/userRouters');
const foodRouter = require('./routes/foodRouters');
const globalErrorHandler = require('./controllers/errorController');
const AppError= require('./utils/appError');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Development logging
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Body Parser, Reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));

// app.use((req, res, next) => {
//   req.requestTime = new Date().ToISOString();

//   next();
// })
// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.use('/api/v1/users', userRouter)
app.use('/api/v1/foods', foodRouter)


app.all('*', (req, res, next) => {
  next(new AppError(`Can not be found ${req.originalUrl} on the server`, 404))
});

app.use(globalErrorHandler);

module.exports = app;