'use strict';

// Bring in Dependencies
const express = require('express');
const router = express.Router();
const knex = require('../db/connect');

//====================================GET ALL PROJECTS============================================================>
router.get('/projects', (req, res, next) => {
  console.log('request headers: ', req.headers);
  knex('projects')
    .select('title', 'id', 'technologies', 'discussion', 'created', 'status', 'submittedby', 'volunteers', 'neededby', 'organization', 'description')
    .then(projects => {
      console.log('server response: ', projects);
      res.json(projects);
    })
    .catch(next);

});

//=======================================GET PROJECT BY ID=========================================================>
router.get('/projects/:id', (req, res, next) => {
  const {id} = req.params;
  knex('projects')
    .select('title', 'id', 'technologies', 'discussion', 'created', 'status', 'submittedby', 'volunteers', 'neededby', 'organization', 'description')
    .where({id})
    .then(projects => {
      res.json(projects);
    })
    .catch(next);
});



//=====================================================POST route=================================================>
router.post('/projects', (req, res, next) => {
  const fieldList = [
    'title',
    'technologies',
    'discussion',
    'status',
    'submittedby',
    'volunteers',
    'neededby',
    'description'
  ];
  const fields = {};
  fieldList.forEach(field => {
    if (field === 'title' && !req.body.field) {
      console.log('missing field');
    }
    fields[field] = req.body[field];
  });

  knex('projects')
    .returning([
      'title',
      'id',
      'technologies',
      'discussion',
      'created',
      'status',
      'submittedby',
      'volunteers',
      'neededby',
      'description'
    ])
    .insert(fields)
    .then(newProject => {
      res.status(201).json(newProject);
    })
    .catch(next);

});

//==========================================================PUT ROUTE=====================================>

router.put('/projects/:id', (req,res,next) => {
  const { id } = req.params;
  const updateFieldList = [
    'title',
    'technologies',
    'discussion',
    'status',
    'submittedby',
    'volunteers',
    'neededby',
    'description'
  ];

  const updateData= {};

  updateFieldList.forEach(field => {
    if (field in req.body) {
      updateData[field] = req.body[field];
    }
  });

  knex('projects')
    .where({
      'id':id
    })
    .returning([
      'title',
      'id',
      'technologies',
      'discussion',
      'created',
      'status',
      'submittedby',
      'volunteers',
      'neededby',
      'description'
    ])
    .update(updateData)
    .then(response => {
      if (response === []) {
        const err = new Error({
          message: 'Project with this ID was not found.',
          stats:404
        });
        return next(err);
      }
      res.status(200).json(response);
    })
    .catch(next);
});

//===================================DELETE ROUTE==================================================>
router.delete('/projects/:id', (req,res,next) => {
  const {id} = req.params;

  knex('projects')
    .where('id', id)
    .del()
    .then(response => {
      if (response) {
        return res.status(204).end();
      } 
      const err = new Error;
      err.message = 'A project with this ID could not be found, so nothing was deleted';
      err.status = 404;
      return next(err);
    })
    .catch(next);
});


module.exports = router;
