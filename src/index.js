/*jshint esversion:10 */
const path = require('path');

const mongoose = require('mongoose');

const { Moitas } = require('./base');
const client = new Moitas();

let dirCommands = path.join(__dirname, './commands');
let dirEvents = path.join(__dirname, './events');

//carrega commandos e eventos/events
client.load(dirCommands, dirEvents);
client.login(client.config.token);

// connect to mongoose database
mongoose
  .connect(client.config.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    client.logger.log('silly', 'Connected to the Mongodb database.');
  }).catch((err) => {
    client.logger.log('warn', `Unable to connect to the Mongodb database. Error: ${err}`
    );
  });
