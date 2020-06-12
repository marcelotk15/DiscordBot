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
      memberPermissions: [],
      botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS' ],
      nsfw: false,
      ownerOnly: false,
      cooldown: 3000,
    });

    this.client = client;
  }

  async run(message) {
    const serverRadio = this.client.radio.get(message.guild.id);

    if (!serverRadio) return message.channel.send('O servidor não está sintonizado em nenhuma frequência no momento...');

    serverRadio.connection.dispatcher.end();
    serverRadio.voiceChannel.leave();

    message.channel.send('Radio desligada!');

    this.client.radio.delete(message.guild.id);
  }
}

module.exports = Stop;