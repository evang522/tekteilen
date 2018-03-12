'use strict';

// Bring in dependencies
require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('morgan');
const {PORT} = require('./config');
const projectsRoute = require('./routes/projects.routes');




// Set up Body parsing Middleware
app.use(express.json());


// Set up Logging Middleware
app.use(logger('common'));



// Bring in Routes for API resources
app.use('/api', projectsRoute);



app.get('/', (req,res,next) => {
  res.send('Something is working!');
});



app.use((err,req,res,next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Internal Server Error';
  console.log(err);
  res.status(err.status).json({
    message: err.message,
    stats:err.status
  });
});


// Set app to listen on config port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

