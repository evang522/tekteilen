'use strict';

const knex = require('../db/connect');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

//==========================LOGIN ROUTE=============================>

router.post('/login', (req, res, next) => {
  const {email, password: incomingPassword} = req.body;

  knex('users')
    .select('password', 'fullname', 'isadmin')
    .where('email', email)
    .then(results => {
      const dbPassword = results[0].password;
      bcrypt.compare(incomingPassword, dbPassword, (err, result) => {
        if (err) {
          return next(err);
        }
        if (!result) {
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
      next(err);
    });

});

module.exports = router;