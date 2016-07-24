import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 8000;


app
  // parse application/x-www-form-urlencoded 
  .use(bodyParser.urlencoded({limit: '50mb', extended: true }));
  // parse application/json 
  .use(bodyParser.json({limit: '50mb'}));
  .use('./routes');

// starting server
//============================================
app.listen(port, err => {
  if (err) console.log(err);
  console.log('Server is functional, pg-server is on port: ' + port);
});

export default app;
