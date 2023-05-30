const userRouter = require('./routers/userRouters')
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Development logging
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Body Parser, Reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));

// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.use('/api/v1/users', userRouter)


app.all('*', (req, res, next) => {
  next(`Can not be found ${req.originalUrl} on the server`)
})

module.exports = app;