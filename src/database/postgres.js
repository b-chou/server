// import promise from 'bluebird';
// import pgPromise from 'pg-promise';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// const options = { promiseLib: promise };
// // const pgp = pgPromise(options);

const connectionString = {
  database: process.env.POSTGRES_DATABASE || 'hack1',
  username: process.env.POSTGRES_USER || 'ajgrande',
  password: process.env.POSTGRES_PASSWORD || '',
};
const options = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  dialect: 'postgres',
};
/* eslint-disable */
const sequelize = new Sequelize(connectionString.database, connectionString.username, connectionString.password, options);

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
  avatar: {
    type: Sequelize.INTEGER,
  },
});

const Hypee = sequelize.define('Hypee', {
  name: {
    type: Sequelize.STRING,
  },
  hypes: {
    type: Sequelize.INTEGER,
  },
  description: {
    type: Sequelize.STRING,
  },
});

const Category = sequelize.define('Category', {
  name: {
    type: Sequelize.STRING,
  },
});

const SimilarActs = sequelize.define('SimilarActs');

Category.belongsTo(Hypee);

// sequelize
// .sync({ force: true });

// start postgres
// postgres -D /usr/local/var/postgres

// run this in pg-server root to add schema tables to rds db instance
// psql --host=hack1.c67fs1cxhe7n.us-west-2.rds.amazonaws.com --port=5432 --username=ajgrande --password --dbname=hack1 < schema.sql

// run this in pg-server root to log into amazon rds db instance
// psql --host=hack1.c67fs1cxhe7n.us-west-2.rds.amazonaws.com --port=5432 --username=ajgrande --password --dbname=hack1

export default { Users, Hypee, Category };
