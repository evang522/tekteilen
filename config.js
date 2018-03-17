'use strict';
module.exports = {
  PORT: process.env.PORT || 8080,
  DBOBJ: {
    url: process.env.DBUSER ? `postgresql://${process.env.DBUSER}:${process.env.DBUSERPASS}@${process.env.DBHOST}:${process.env.DBPORT || 5432}/${process.env.DBNAME}`:  'postgres://jnqlwygy:pYdrcHZoA5ACTQ-lHwjDN5BrNpZuYNMc@stampy.db.elephantsql.com:5432/jnqlwygy'
  },
  JWT_SECRET: process.env.SECRET,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN
};


console.log(module.exports.DBOBJ);

