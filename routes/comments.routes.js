'use strict';
const express = require('express');
const router = express.Router();
const knex = require('../db/connect');




//==================================GET ALL COMMENTS=========================>
router.get('/comments', (req,res,next) => {
  knex
    .select('comments.id','user_id','project_id','message', 'users.fullname as author', 'comments.date')
    .from('comments')
    .leftJoin('users','users.id','comments.user_id')
    .then(response => {
      res.status(200).json(response);
    })
    .catch(next);
});


// Create comment in comment table
router.post('/comments', (req,res,next) => {
  const {userId, projectId, commentBody} = req.body;
  return knex('comments')
    .insert({
      'user_id':userId,
      'project_id':projectId,
      'message': commentBody
    })
    .returning(['user_id','project_id','message','date','id'])
    .then(response => {
      res.status(201).json(response[0]);
    });
});


router.delete('/comments/:id', (req,res,next) => {
  const {id:commentId} = req.params;

  return knex('comments')
    .where('id',commentId)
    .select('user_id')
    .then(response => {
      if (response[0].user_id !== req.user.id) {
        const err = new Error();
        err.message = 'Comments made by other users may not be deleted';
        err.status = 400;
        return next(err);
      }
      return knex('comments')
        .where('id', commentId)
        .del()
        .then(response => {
          if (response === 0) {
            const err = new Error();
            err.status = 404;
            err.message = 'A Comment with this ID was not found.';
            return next(err);
          }
          res.status(204).end();
        })
        .catch(next);
    });
});


module.exports = router;