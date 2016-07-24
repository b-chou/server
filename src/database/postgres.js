import promise from 'bluebird';
import pgPromise from 'pg-promise';

const options = { promiseLib: promise };
const pgp = pgPromise(options);

const connectionString = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DATABASE || 'hack1',
  user: process.env.POSTGRES_USER || 'root',
  password: process.env.POSTGRES_PASSWORD || '',
};

export default pgp(connectionString);
