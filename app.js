const env = process.env.NODE_ENV?.trim ? process.env.NODE_ENV?.trim() : 'development';
require('dotenv').config({path: `./.env.${env}`});

const express = require('express');
const sequelize = require('./libs/db');
const app = express();
const https = require('https');
const fs = require('fs');

require('./libs/middlewares')(app);
require('./libs/auth');
require('./routes')(app);

const checkDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
  } catch (e) {
    console.log('Unable to connect to the database:');
    console.log(e.message);
    process.exit(1);
  }
};

const init = async () => {
  await checkDatabaseConnection();
  const credentials = {
    key: fs.readFileSync("cleveroad.key", "utf8"),
    cert: fs.readFileSync("cleveroad.cert", "utf8")
  }
  const server = https.createServer(credentials, app);
  server.listen(process.env.APP_PORT, () => {
    console.log('Server is running...')
  });
};

init();

module.exports = app;
