'use strict';
module.exports = {
  PORT: process.env.PORT || 8080,
  DBOBJ: {
    url:`postgresql://${process.env.DBUSER}:${process.env.DBUSERPASS}@${process.env.DBHOST}:${process.env.DBPORT || 5432}/${process.env.DBNAME}`
  },
  JWT_SECRET: process.env.SECRET
};


console.log(module.exports.DBOBJ);


// host: process.env.DBHOST,
// user: process.env.DBUSER,
// password: process.env.DBUSERPASS,
// database: process.env.DBNAME