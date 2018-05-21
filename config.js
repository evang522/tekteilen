'use strict';
module.exports = {
  PORT: process.env.PORT || 8080,
  DBOBJ: {
    url: process.env.DBURL,
    testurl: `postgresql://${process.env.DBUSER}:${process.env.DBUSERPASS}@${process.env.DBHOST}:${process.env.DBPORT || 5432}/tekteilentest`
  },
  JWT_SECRET: process.env.SECRET,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN
};


console.log('dburl:',module.exports.DBOBJ);

