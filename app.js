'use strict';

// Bring in dependencies
require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('morgan');
const {PORT} = require('./config');
const projectsRoute = require('./routes/projects.routes');
const usersRoute = require('./routes/users.routes');
const authRoute = require('./routes/authentication.routes');
const commentRoute = require('./routes/comments.routes');
const {CLIENT_ORIGIN} = require('./config');
const cors = require('cors');
const jwtAuth = require('./jwtauth');
console.log(CLIENT_ORIGIN);


// Set up Cors middleware
app.use(cors({
  origin:CLIENT_ORIGIN
}));

// Set up Body parsing Middleware
app.use(express.json());


// Set up Logging Middleware
app.use(logger('common'));



// Bring in Routes for API resources
app.use('/api', authRoute);
app.use('/api', usersRoute);

app.use(jwtAuth);
app.use('/api', projectsRoute);
app.use('/api', commentRoute);



app.get('/', (req,res) => {
  res.send(`This is a backend server that serves an API. The server is currently listening on port ${PORT}. Please visit the frontend.`);
});



app.use((err,req,res,next) => {
  // if (process.env.ENVIRONMENT === 'dev') {
  //   console.log(err);
  // }
  err.status = err.status || 500;
  err.message = err.message || 'Internal Server Error';
  res.status(err.status).json({
    message: err.message,
    status:err.status
  });
});


// Set app to listen on config port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

