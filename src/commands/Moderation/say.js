/*jshint esversion: 10 */
const { Command } = require('../../base');

class Say extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      dirname: __dirname,
      enabled: true,
      guildOnly: true,
      aliases: [],
      memberPermissions: [ 'MENTION_EVERYONE' ],
      botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS' ],
      nsfw: false,
      ownerOnly: false,
      cooldown: 3000
    });

    this.client = client;
  }

  async run(message, args) {
    message.channel.send(args.join(' '));
  }
}

module.exports = Say;