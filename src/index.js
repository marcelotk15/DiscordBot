/*jshint esversion: 10 */
const path = require('path');

const mongoose = require('mongoose');

const {Moitas, Command, Events} = require('./base');
client = new Moitas();


let dirCommands = path.join(__dirname, './commands');
let dirEvents = path.join(__dirname, './events');

//carrega commandos e eventos/events
client.load(dirCommands, dirEvents);
client.login(client.config.token);

// connect to mongoose database
mongoose.connect(client.config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    client.logger.log("Connected to the Mongodb database.", "log");
}).catch((err) => {
    client.logger.log(`Unable to connect to the Mongodb database. Error: ${err}`, "error");
});