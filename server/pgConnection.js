/* eslint-disable */
const Sequelize = require('sequelize');
const sequelize = new Sequelize('hack1', 'ajgrande', 'hackreactor', {
  host: 'hack1.c67fs1cxhe7n.us-west-2.rds.amazonaws.com',
  dialect: 'postgres',
});

sequelize
  .authenticate()
  .then(() => {
    //eslint-disable-next-line
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    //eslint-disable-next-line
    console.log('Unable to connect to the database:', err);
  });

const Users = sequelize.define('Users', {
  displayName: {
    type: Sequelize.STRING,
  },
  
});
// Users.sequelize
// .sync({ force: true });
module.exports = Users;

// start postgres
// postgres -D /usr/local/var/postgres

// run this in pg-server root to add schema tables to rds db instance
// psql --host=hack1.c67fs1cxhe7n.us-west-2.rds.amazonaws.com --port=5432 --username=ajgrande --password --dbname=hack1 < schema.sql

// run this in pg-server root to log into amazon rds db instance
// psql --host=hack1.c67fs1cxhe7n.us-west-2.rds.amazonaws.com --port=5432 --username=ajgrande --password --dbname=hack1
