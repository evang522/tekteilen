'use strict';

// Bring in Dependencies
const express = require('express');
const router = express.Router();
const knex = require('../db/connect');

//====================================GET ALL PROJECTS============================================================>
router.get('/projects', (req, res, next) => {
  const {q} = req.query; 
  knex('projects')
    .select('title', 'id', 'technologies', 'discussion', 'created', 'status', 'submittedby', 'volunteers', 'neededby', 'organization', 'description')
    .where(function () {
      if (q) {
        this.whereRaw(`LOWER(title) LIKE '%${q.toLowerCase()}%'`);
      }
    })
    .then(projects => {
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
    'description',
    'organization'
  ];
  const fields = {};

  fieldList.forEach(field => {
    if (field === 'title' && !req.body[field]) {
      const err =  new Error();
      err.message =  `Missing ${field} field`; 
      return next(err);
    }
    fields[field] = req.body[field];
  });

  fields.technologies = fields.technologies ? fields.technologies.split(',') : 'No technologies provided';

  if (fields.title.length > 60) {

    const err = new Error();
    err.message = 'Project title cannot be longer than 60 Characters';
    err.status = 400;
    return next(err);
  }

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
      'description',
      'organization'
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
  const {userId} = req.body;


  if (req.body.requestType === 'addVolunteer') {
    if (!userId) {
      const err = new Error();
      err.status = 400;
      err.message = 'Missing Volunteer Id!';
      return next(err);
    }

    // Checking to see if the user is already listed as a volunteer on the project
    return knex('projects')
      .where('id',id)
      .then(response => {
        try {
          if (response[0].volunteers.length > 0) {
            if (response[0].volunteers.includes(userId)) {
              const err = new Error();
              err.status = 400;
              err.message = 'You are already joined to this project!';
              return Promise.reject(err);
            }
          }
        } catch (e) {
          console.log('Error occured because volunteers was not defined');
        }
        
      })
      .then(() => {

        return knex('projects')
          .where('id',id)
          .update({
            volunteers: knex.raw('array_append("volunteers", ? )', [`${userId}`])
          })
          .then(response => {
            if (response === 0) {
              const err = new Error();
              err.status = 404;
              err.message = 'A project with this ID could not be found.';
              Promise.reject(err);
            }
            res.status(200).end();
          });

      })
      .catch(err => {
        next(err);
      });

  }

  // Deal with REMOVE volunteer Request

  
  if (req.body.requestType === 'removeVolunteer') {
    if (!userId) {
      const err = new Error();
      err.status = 400;
      err.message = 'Missing Volunteer Id!';
      return next(err);
    }


    return knex('projects')
      .where('id',id)
      .update({
        volunteers: knex.raw('array_remove("volunteers", ? )', [`${userId}`])
      })
      .then(response => {
        res.status(200).end();
      })
      .catch(err => {
        return next(err);
      });

  }


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
  
  if (req.user.isadmin) {

    return knex('projects')
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

  } 
  const err = new Error();
  err.message = 'Not Authorized. Only Administrators can delete Projects';
  err.status = 403;
  next(err);
});




module.exports = router;
