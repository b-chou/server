'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var connectionString = {
  database: process.env.POSTGRES_DATABASE || 'hack1',
  username: process.env.POSTGRES_USER || 'root',
  password: process.env.POSTGRES_PASSWORD || ''
};
var options = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  dialect: 'postgres'
};
/* eslint-disable */
var sequelize = new _sequelize2.default(connectionString.database, connectionString.username, connectionString.password, options);

sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
}).catch(function (err) {
  console.log('Unable to connect to the database:', err);
});

// Fans
var User = sequelize.define('User', {
  displayName: _sequelize2.default.STRING,
  avatar: _sequelize2.default.INTEGER
});

// Artists and Acts
var Hypee = sequelize.define('Hypee', {
  name: _sequelize2.default.STRING,
  hypes: {
    type: _sequelize2.default.INTEGER,
    defaultValue: 0
  },
  description: _sequelize2.default.STRING(600),
  location: _sequelize2.default.STRING,
  start_time: _sequelize2.default.STRING,
  end_time: _sequelize2.default.STRING,
  day: _sequelize2.default.INTEGER,
  image: _sequelize2.default.STRING(300),
  genre: _sequelize2.default.STRING(100),
  upvotes: _sequelize2.default.INTEGER,
  events: _sequelize2.default.INTEGER,
  followers: _sequelize2.default.INTEGER,
  album: _sequelize2.default.STRING,
  time: _sequelize2.default.STRING
});
// Hype vote for Hypees
var Hype = sequelize.define('Hype', {
  date: {
    type: _sequelize2.default.DATE,
    default: _sequelize2.default.NOW
  }
});

var Similar = sequelize.define('Similar', {});

var Category = sequelize.define('Category', {
  name: _sequelize2.default.STRING
});

Category.belongsTo(Hypee);
Category.belongsTo(Hype);
Hype.belongsTo(User);
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

exports.default = { Similar: Similar, User: User, Hypee: Hypee, Category: Category, sequelize: sequelize };