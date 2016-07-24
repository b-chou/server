const promise = require('bluebird');
const options = {
  promiseLib: promise,
};
const pgp = require('pg-promise')(options);
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/hack1';
const db = pgp(connectionString);

module.exports = db;
