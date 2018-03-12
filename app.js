'use strict';

// Bring in dependencies
require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('morgan');
const {PORT} = require('./config');
const projectsRoute = require('./routes/projects.routes');
const usersRoute = require('./routes/users.routes');




// Set up Body parsing Middleware
app.use(express.json());


// Set up Logging Middleware
app.use(logger('common'));



// Bring in Routes for API resources
app.use('/api', projectsRoute);
app.use('/api', usersRoute);



app.get('/', (req,res,next) => {
  res.send('Something is working!');
});



app.use((err,req,res,next) => {
  if (process.env.ENVIRONMENT === 'dev') {
    console.log(err);
  }
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

