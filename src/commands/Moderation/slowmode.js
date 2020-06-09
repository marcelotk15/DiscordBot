/*jshint esversion: 10 */
const { Command } = require('../../base');

class SlowMode extends Command {
  constructor (client) {
    super(client, {
      name: 'slowmode',
      description: 'Define a cooldown in a channel',
      usage: 'slowmode [#channel] (time)',
      examples: '$slowmode #general 10m\n$slowmode #general',
      dirname: __dirname,
      enabled: false,
      guildOnly: true,
      aliases: [ 'slowmotion' ],
      memberPermissions: [ 'MANAGE_GUILD' ],
      botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS' ],
      nsfw: false,
      ownerOnly: false,
      cooldown: 3000
    });
  }

  async run (message, args) {
    let channel = message.mentions.channels.filter((ch) => ch.type === 'text' && ch.guild.id === message.guild.id).first();

    if(!channel) return message.channel.send('Please mention a valid channel!`');

    // let time = args[1];

    // if(!time) {
    //   message.
    // }
  }
}

module.exports = SlowMode;