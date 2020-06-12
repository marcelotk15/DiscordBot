/*jshint esversion: 10 */
const { Command } = require('../../base');

const TuneIn = require('node-tunein-radio');

const { MessageEmbed } = require('discord.js');


class PlayingNow extends Command {
  constructor(client) {
    super(client, {
      name: 'playing',
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

  async run(message, args) {
    const serverRadio = this.client.radio.get(message.guild.id);

    if (!serverRadio) return message.channel.send('O servidor não está sintonizado em nenhuma frequência no momento...');

    const tuneIn = new TuneIn();

    tuneIn.describe(serverRadio.radio, true).then(async data => {  
      
      const messageEmbed = await new MessageEmbed()
      .setTitle(data.body[0].text)
      .setDescription(data.body[2].text)
      .setThumbnail(`http://cdn-profiles.tunein.com/${serverRadio.radio}/images/logoq.png`)
      .addField('Tocando agora:', `${data.body[1].text}`)
      .setFooter(this.client.config.embed.footer(this.client.config), this.client.config.logo)
      .setColor(this.client.config.embed.color);

      await message.channel.send(messageEmbed);
    }).catch(error => console.log(error));
  }
}

module.exports = PlayingNow;