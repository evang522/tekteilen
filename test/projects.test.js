'use strict';
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const {runServer, app} = require('../app');
const knex  = require('../db/connect');
const projects = require('../db/projects.json');


before(function () {
  runServer();
});

beforeEach(function () {
  return knex('projects')
    .del()
    .then(() => {
      return knex('projects')
        .insert(projects);
    })
    .catch(console.log);
});

chai.use(chaiHttp); 

describe('/api/projects', function () {
  it('Should return a status code of 200', function () {
    return chai
      .request(app)
      .get('/api/projects')
      .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV2YW5nNTIyQGdtYWlsLmNvbSIsImZ1bGxuYW1lIjoiRXZhbiBHYXJyZXR0IiwiaXNhZG1pbiI6dHJ1ZSwiaWF0IjoxNTIxNDkxMjc3LCJpZCI6MSwiZXhwIjoxNTIxOTIzMjc3fQ.rrYptGxTvo7grSrjhL6fXcaIxskVholCiqzrTj4Xx6E')
      .then(response => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf(2);
      });
  });

  it('Should add an item when posting', function () {
    return chai
      .request(app)
      .post('/api/projects')
      .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV2YW5nNTIyQGdtYWlsLmNvbSIsImZ1bGxuYW1lIjoiRXZhbiBHYXJyZXR0IiwiaXNhZG1pbiI6dHJ1ZSwiaWF0IjoxNTIxNDkxMjc3LCJpZCI6MSwiZXhwIjoxNTIxOTIzMjc3fQ.rrYptGxTvo7grSrjhL6fXcaIxskVholCiqzrTj4Xx6E')
      .send({'title':'Yahoo', 'description':'Our Ministry needs help!','technologies':'{Node, Mongo}','volunteers':'{1,2,3}', 'organization':'Red Cross'})
      .then(response => {
        expect(response).to.have.status(201);
      })
      .then(() => {
        return chai
          .request(app)
          .get('/api/projects')
          .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV2YW5nNTIyQGdtYWlsLmNvbSIsImZ1bGxuYW1lIjoiRXZhbiBHYXJyZXR0IiwiaXNhZG1pbiI6dHJ1ZSwiaWF0IjoxNTIxNDkxMjc3LCJpZCI6MSwiZXhwIjoxNTIxOTIzMjc3fQ.rrYptGxTvo7grSrjhL6fXcaIxskVholCiqzrTj4Xx6E')
          .then(response => {
            expect(response.body.length).to.equal(3);
          });
      });
  });

  it('Should delete an item', function () {
    return knex('projects')
      .where('title','Yahoo')
      .del()
      .then(response => {
        return chai
          .request(app)
          .get('/api/projects')
          .set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV2YW5nNTIyQGdtYWlsLmNvbSIsImZ1bGxuYW1lIjoiRXZhbiBHYXJyZXR0IiwiaXNhZG1pbiI6dHJ1ZSwiaWF0IjoxNTIxNDkxMjc3LCJpZCI6MSwiZXhwIjoxNTIxOTIzMjc3fQ.rrYptGxTvo7grSrjhL6fXcaIxskVholCiqzrTj4Xx6E')
          .then(response => {
            expect(response.body.length).to.equal(2);
          });
      });
  });

});