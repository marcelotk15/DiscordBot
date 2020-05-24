/*jshint esversion: 10 */
const { Command } = require('../../base');

const { MessageEmbed } = require('discord.js');


class Pepe extends Command {
  constructor (client) {
    super(client, {
      name: 'pepe',
      dirname: __dirname,
      guildOnly: true,
    });
  }

  async run (message) {
    let pepes = [
      'https://cdn.discordapp.com/emojis/428556352915505165.png?v=1',
      'https://cdn.discordapp.com/emojis/428556326482739230.png?v=1',
      'https://cdn.discordapp.com/emojis/428556486235389973.png?v=1',
      'https://cdn.discordapp.com/emojis/428556308929576960.png?v=1',
      'https://cdn.discordapp.com/emojis/428556295218659329.png?v=1',
      'https://cdn.discordapp.com/emojis/428556467021545473.png?v=1',
      'https://cdn.discordapp.com/emojis/428556448507625474.png?v=1',
      'https://cdn.discordapp.com/emojis/428556377754042378.png?v=1',
      'https://cdn.discordapp.com/emojis/428556281767526405.png?v=1',
      'https://cdn.discordapp.com/emojis/428556266366042112.png?v=1',
    ];

    let pepe = Math.floor((Math.random() * pepes.length));

    let embed = new MessageEmbed()
      .setColor('#00ff00')
      .setImage(pepes[pepe]);

    message.channel.send(embed);
  }
}

module.exports = Pepe;