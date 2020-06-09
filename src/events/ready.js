/*jshint esversion: 10 */
const { Event } = require('../base');

const logger = require('../logger');

class Ready extends Event {
  constructor(client) {
    super(client, {
      on: 'ready',
      name: 'ServerReady'
    });

    this.client = client;
  }

  async run () {
    let client = this.client;

    logger.log('debug', `Loaded total of ${client.commands.size} command(s).`);

    logger.log('debug', `Loaded a total of ${client.events.size} event(s).`);

    logger.log('debug', `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`);

    // Update the game every 20s
    const status = require('../config').status,
      version = require('../../package.json').version;

    let i = 0;
    setInterval(function(){
      let toDisplay = status[parseInt(i, 10)].name.replace('{serversCount}', client.guilds.cache.size)+' | v'+version;
      client.user.setActivity(toDisplay, { type: status[parseInt(i, 10)].type });
      if(status[parseInt(i+1, 10)]) i++;
      else i = 0;
    }, 20000); // Every 20 seconds
  }
}

module.exports = Ready;