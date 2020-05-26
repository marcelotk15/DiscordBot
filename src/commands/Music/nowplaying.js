/*jshint esversion: 10 */
const { Command } = require('../../base');


class NowPlaying extends Command {
  constructor(client) {
    super(client, {
      name: 'nowplaying',
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

    if (!serverQueue) return message.channel.send('There is nothing playing.');

    message.channel.send(`Now playing: ${serverQueue.songs[0].title}`);
  }
}

module.exports = NowPlaying;