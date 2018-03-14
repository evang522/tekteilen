'use strict';

const knex = require('../db/connect');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');
const jwtAuth = require('../jwtauth');

//==========================LOGIN ROUTE=============================>

router.post('/login', (req, res, next) => {
  const {email, password: incomingPassword} = req.body;

  // The user has submitted an email and password to the server. 
  // We are going to query the DB to get the user's information which is associated with the email address.
  // Then, we will use bcrypt to compre it with the hashed password in the database. 

  knex('users')
    .select('password', 'fullname', 'isadmin')
    .where('email', email)
    .then(results => {
      if (!results || results.length === 0) {
        const err = new Error;
        err.message = 'User does not exist';
        err.status = 400;
        return next(err);
      }
      const dbPassword = results[0].password;
      bcrypt.compare(incomingPassword, dbPassword, (err, result) => {
        if (err) {
          return next(err);
        }
        if (!result || result.length === 0) {
          const err = new Error;
          err.message = 'Incorrect password';
          err.status = 400;
          return next(err);
        }
        if (result) {
          // If the password is CORRECT, the user will be sent a JSON web token for future
          // authorization 
          
          //Create a user Info object to encode into jsob Web Token
          const jwtInfo = {
            email,
            fullname: results[0].fullname,
            isadmin: results[0].isadmin,
            iat: Math.floor(Date.now() / 1000) - 30
          };

          // Generate token based on user info
          const token = jwt.sign(jwtInfo, JWT_SECRET, {expiresIn: '5d'});
          res
            .status(200)
            .json({token});
        }
      });

    })
    .catch(err => {
      // If there is an error (such as a bad password), it will be passed to the error handler
      next(err);
    });

});



router.get('/refresh', jwtAuth, (req,res,next) => {
  const newTokenInfo = {
    email:req.user.email,
    fullname: req.user.fullname,
    isadmin: req.user.isadmin,
  };

  const token = jwt.sign(newTokenInfo, JWT_SECRET, {expiresIn: '5d'});
  res
    .status(200)
    .json({token});
});

module.exports = router;              