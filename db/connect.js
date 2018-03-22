'use strict';

const {DBOBJ} = require('../config');

const knex = require('knex')({
  client: 'pg',
  connection: DBOBJ.url,
});

module.exports = knex;