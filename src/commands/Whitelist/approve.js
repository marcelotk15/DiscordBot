/*jshint esversion: 10 */
const { Command } = require('../../base');

const { MessageEmbed } = require('discord.js');

class Approve extends Command {
  constructor(client) {
    super(client, {
      name: 'approve',
      // description: 'No description provided',
      // usage = 'No usage provided',
      // examples = 'No example provided',
      dirname: __dirname,
      enabled: true,
      guildOnly: false,
      aliases: [ 'aprovar' ],
      botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS' ],
      memberPermissions: [],
      nsfw: false,
      ownerOnly: false,
      cooldown: 3000,
    });

    this.client = client;
  }

  async run(message, args) {

    if(!args[0]) return message.channel.send('sem user').then( m => { //verificar se tem o user no argumento
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    let member = await this.client.resolveMember(args[0], message.guild); // procura o user dentro do sv

    if (!member) return message.channel.send('usuario não encotrado no discord').then( m => { // verificar se achou o user dentro do sv
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    const whiteliist = await this.client.findWhitelist(member);// procura a whitelist

    if (!whiteliist) return message.channel.send('este usuário não tem whitelsit').then( m => { // verificar se tem whitelist
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    message.delete({ timeout: 10000 });

    let pvEmbed = new MessageEmbed()
      .setColor('#05c46b')
      .setTitle('Parabéns :clap:')
      .setDescription('Você acaba de ser aprovado na nossa whitelist! \nParabéns e seja bem-vindo! \n:partying_face::partying_face::partying_face:')
      .setImage('https://media1.tenor.com/images/dd363fb155d6bf29e1988a63432d4b07/tenor.gif?itemid=15068756');
    member.send(pvEmbed);

    let messageEmbed = new MessageEmbed()
      .setColor('#05c46b')
      .setTitle('Membro aprovado!')
      .addFields(
        { name: '> Membro:', value: `<@${member.id}>`, inline: true },
        { name: '> Aprovaod por:', value: `<@${message.author.id}>`, inline: true }
      );
    message.channel.send(messageEmbed);
     
    member.roles.add(this.client.config.whitelist.approvedRole); // add role aprovado
  }
}

module.exports = Approve;