/*jshint esversion: 10 */
const { Event } = require('../base');

const gamedig = require('gamedig');


class KF2Server extends Event{
  constructor(client) {
    super(client, {
      on: 'ready',
      name: 'KF2Servers'
    });

    this.client = client;
  }

  async run(){
    //kf2server 1
    setInterval(() => {
      this.kf2status('Serv. #1', ['719767344221519903', '719756443024359486'], '35.198.47.172');
    }, 15000);

    //kf2server 2
    setInterval(() => {
      this.kf2status('Serv. #2', ['719767112473772092', '719767192874516503'], '35.198.47.172', '27016');
    }, 15000);
  }

  async kf2status(name, channels, host, port = 27015){
    await gamedig.query({
      type: 'killingfloor2',
      host: host,
      port: port
    }).then(async (data) => {
      this.client.channels.cache.get(channels[0]).setName(`🟢 ${name} - ${data.map}`);
      this.client.channels.cache.get(channels[1]).setName(`👤 ${data.players.length}/${data.maxplayers}`);

    }).catch(err => {
      this.client.channels.cache.get(channels[0]).setName(`🔴 ${name}`);
      this.client.channels.cache.get(channels[1]).setName('Servidor offline...');
    });
  }
}

module.exports = KF2Server;