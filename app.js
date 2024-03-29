const userRouter = require('./routes/userRouters');
const foodRouter = require('./routes/foodRouters');
const viewRouter = require('./routes/viewRouters');
const globalErrorHandler = require('./controllers/errorController');
const path = require('path');
const AppError = require('./utils/appError');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');

const cookieParser = require('cookie-parser');

const app = express();

// Setting View Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser, Reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));

// Cookies Parser, Reading the token from the cookies
app.use(cookieParser());

// app.use((req, res, next) => {
//   req.requestTime = new Date().ToISOString();

//   next();
// })
// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Compress files
app.use(compression());

// Routing
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/foods', foodRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can not be found ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
