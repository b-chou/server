import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = {
  database: process.env.POSTGRES_DATABASE || 'hack1',
  username: process.env.POSTGRES_USER || 'root',
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
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });

const User = sequelize.define('User', {
  displayName: Sequelize.STRING,
  avatar: Sequelize.INTEGER,
});

// Artists and Acts
const Hypee = sequelize.define('Hypee', {
  name: Sequelize.STRING,
  hypes: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  description: Sequelize.STRING,
  location: Sequelize.STRING,
  start_time: Sequelize.STRING,
  end_time: Sequelize.STRING,
  day: Sequelize.INTEGER,
});

// Fans
const Hyper = sequelize.define('Hyper', {
  name: Sequelize.STRING,
  avatar: Sequelize.INTEGER,
});

// Hype vote for Hypees
const Hype = sequelize.define('Hype', {
  date: {
    type: Sequelize.DATE,
    default: Sequelize.NOW,
  }
});

const Similar = sequelize.define('Similar', {})

const Category = sequelize.define('Category', {
  name: Sequelize.STRING,
});

Category.belongsTo(Hypee);
Category.belongsTo(Hype);
Hype.belongsTo(Hyper);
Hype.belongsTo(Hypee);
Similar.belongsTo(Hypee, { as: 'originalHypee' });
Similar.belongsTo(Hypee, { as: 'similarHypee' });

sequelize.sync();

// sequelize
// .sync({ force: true });


// start postgres
// postgres -D /usr/local/var/postgres

// run this in pg-server root to add schema tables to rds db instance
// psql --host=hack1.c67fs1cxhe7n.us-west-2.rds.amazonaws.com --port=5432 --username=ajgrande --password --dbname=hack1 < schema.sql

// run this in pg-server root to log into amazon rds db instance
// psql --host=hack1.c67fs1cxhe7n.us-west-2.rds.amazonaws.com --port=5432 --username=ajgrande --password --dbname=hack1

export default { Similar, Hyper, User, Hypee, Category, sequelize };
