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
      this.kf2status(['719763242209247283', '719756443024359486'], '35.198.47.172');
    }, 15000);

    //kf2server 2
    setInterval(() => {
      this.kf2status(['719767165447831592', '719767192874516503'], '35.198.47.172', '27016');
    }, 15000);
  }

  async kf2status(channels, host, port = null){
    await gamedig.query({
      type: 'killingfloor2',
      host: host,
      port: port || '27015'
    }).then(async (data) => {
      this.client.channels.cache.get(channels[0]).setName('Servidor Online! 🟢');
      this.client.channels.cache.get(channels[1]).setName(`👤 ${data.players.length}/${data.maxplayers}`);

    }).catch(err => {
      this.client.channels.cache.get(channels[0]).setName('Servidor Offline! 🔴');
      this.client.channels.cache.get(channels[1]).setName('👤 0/0');
    });
  }
}

module.exports = KF2Server;