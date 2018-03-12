'use strict';

const {DBOBJ} = require('../config');

// const knex = require('knex')({
//   client: 'pg',
//   connection: {
//     host : DBOBJ.host,
//     user : DBOBJ.user,
//     password : DBOBJ.password,
//     database : DBOBJ.database
//   }
// });

// module.exports=knex;


var knex = require('knex')({
  client: 'pg',
  connection: DBOBJ.url,
});

module.exports = knex;