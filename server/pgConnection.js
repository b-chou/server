const promise = require('bluebird');
const options = {
  promiseLib: promise
};
const pgp = require('pg-promise')(options);

const connectionString = {
  host: 'hack1.c67fs1cxhe7n.us-west-2.rds.amazonaws.com',
  port: 5432,
  database: 'hack1',
  user: 'ajgrande',
  password: 'hackreactor'
};

const db = pgp(connectionString);

module.exports = db;

// start postgres
// postgres -D /usr/local/var/postgres

// run this in pg-server root to add schema tables to rds db instance
// psql --host=hack1.c67fs1cxhe7n.us-west-2.rds.amazonaws.com --port=5432 --username=ajgrande --password --dbname=hack1 < schema.sql

// run this in pg-server root to log into amazon rds db instance
// psql --host=hack1.c67fs1cxhe7n.us-west-2.rds.amazonaws.com --port=5432 --username=ajgrande --password --dbname=hack1
