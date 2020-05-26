/*jshint esversion: 10 */
const { Command } = require('../../base');


class Stop extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      // description: 'No description provided',
      // usage = 'No usage provided',
      // examples = 'No example provided',
      dirname: __dirname,
      enabled: true,
      guildOnly: false,
      aliases: [],
      botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS' ],
      memberPermissions: [],
      nsfw: false,
      ownerOnly: false,
      cooldown: 3000,
    });

    this.client = client;
  }

  async run(message) {
    const serverQueue = this.client.queue.get(message.guild.id);

    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');

    serverQueue.songs = [];

    serverQueue.connection.dispatcher.end();
  }
}

module.exports = Stop;