'use strict';
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('./config');

const verifyToken = (req,res,next) => {
  // Throw an error if there is no Authorization Header present in the request
  
  if (!req.headers.authorization) {
    const err = new Error;
    err.message='Not authorized to access this endpoint, no JSON web token Present';
    err.status=403;
    return next(err);
  }

  let token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err,decoded) => {
    
    //json web token will throw an error if the user has provided an invalid token. We can use that error to send information back to the user
    if (err) {
      const err = new Error;
      err.message = 'Invalid Token, user is not authorized';
      err.status = 403;
      return next(err);
    }
    // If the token is valid: 
    req.user = decoded;
    next();
  });

};


module.exports = verifyToken;