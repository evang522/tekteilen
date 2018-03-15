'use strict';
const express = require('express');
const router = express.Router();
const knex = require('../db/connect');




//==================================GET ALL COMMENTS=========================>
router.get('/comments', (req,res,next) => {
  knex('comments')
    .select('id','author_id','project_id','message')
    .then(response => {
      res.status(200).json(response);
    });
});


module.exports = router;