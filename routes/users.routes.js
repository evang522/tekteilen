// .select('id', 'fullname', 'email', 'created', 'merit', 'isadmin', 'phone'


'use strict';

// Bring in Dependencies
const express = require('express');
const router = express.Router();
const knex = require('../db/connect');
const bcrypt = require('bcryptjs');
// const salt = bcrypt.genSalt(10);

//====================================GET ALL USERS============================================================>
router.get('/users', (req, res, next) => {
  knex('users')
    .select('id', 'fullname', 'email', 'created', 'merit', 'isadmin', 'phone')
    .then(users => {
      res.json(users);
    })
    .catch(next);

});

//=======================================GET USER BY ID=========================================================>
router.get('/users/:id', (req, res, next) => {
  const {id} = req.params;
  knex('users')
    .select('id', 'fullname', 'email', 'created', 'merit', 'isadmin', 'phone')
    .where({id})
    .then(user => {
      res.json(user);
    });
});



//=====================================================CREATE NEW USER=================================================>
router.post('/users', (req, res, next) => {

  const requiredFields = ['fullname','email','password'];
  const newUser = {};


  // VALIDATION

  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const err = new Error;
      err.message = `Missing ${field} field`;
      err.status = 400;
      return next(err);
    }
    newUser[field] = req.body[field];

  });


  if (newUser.password.length < 8) {
    const err = new Error;
    err.status = 400;
    err.message = 'Password should be at least 8 characters long';
    return next(err);
  }

  if (newUser.password.trim().length !== newUser.password.length) {
    const err = new Error;
    err.status = 400;
    err.message = 'Password should not contain white space';
    return next(err);
  }

  if (!newUser.email.includes('@')) {
    const err = new Error;
    err.status = 400;
    err.message = 'Email format is not correct';
    return next(err);
  }


  bcrypt.genSalt(10, (err,salt) => {
    bcrypt.hash(newUser.password, salt, (err,hash) => {
      newUser.password= hash;
      return knex('users')
        .returning(['id', 'fullname', 'email', 'created', 'merit', 'isadmin', 'phone'])
        .insert(newUser)
        .then(newProject => {
          res.status(201).json(newProject);
        })
        .catch(next);
  
    });
  });
});

//==========================================================PUT/ UPDATE USER ROUTE=====================================>

// A Put route for users is important for being able to change a name, password, or otherwise. But I'll make this later as it's not essential
// to what I'm currently doing.


// router.put('/users/:id', (req,res,next) => {
//   const { id } = req.params;
//   const updateFieldList = [
//     'title',
//     'technologies',
//     'discussion',
//     'status',
//     'submittedby',
//     'volunteers',
//     'neededby',
//     'description'
//   ];

//   const updateData= {};

//   updateFieldList.forEach(field => {
//     if (field in req.body) {
//       updateData[field] = req.body[field];
//     }
//   });

//   knex('users')
//     .where({
//       'id':id
//     })
//     .returning([
//       'title',
//       'id',
//       'technologies',
//       'discussion',
//       'created',
//       'status',
//       'submittedby',
//       'volunteers',
//       'neededby',
//       'description'
//     ])
//     .update(updateData)
//     .then(response => {
//       if (response === []) {
//         const err = new Error({
//           message: 'Project with this ID was not found.',
//           status:404
//         });
//         return next(err);
//       }
//       res.status(200).json(response);
//     })
//     .catch(next);
// });

//===================================DELETE USER ROUTE==================================================>
router.delete('/users/:id', (req,res,next) => {
  const {id} = req.params;

  knex('users')
    .where('id', id)
    .del()
    .then(response => {
      if (response) {
        return res.status(204).end();
      } 
      const err = new Error;
      err.message = 'A user with this ID could not be found, so nothing was deleted';
      err.status = 404;
      return next(err);
    })
    .catch(next);
});


module.exports = router;
