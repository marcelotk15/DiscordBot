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
    const strings = this.client.strings;
    const config = this.client.config;

    if(!args[0]) return message.reply(strings.get('WHITELITS_APROVE_WITHOUT_USER')).then( m => { //verificar se tem o user no argumento
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    let member = await this.client.resolveMember(args[0], message.guild); // procura o user dentro do sv

    if (!member) return message.reply(strings.get('WHITELITS_APROVE_USER_LEFT')).then( m => { // verificar se achou o user dentro do sv
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    if (member.roles.cache.has(config.whitelist.approvedRole)) return message.reply(strings.get('WHITELITS_APROVE_ALREADY_APPROVED', member.user.id)).then( m => { // verifica se já foi aprovado
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    const whitelist = await this.client.findWhitelist(member);// procura a whitelist

    if (!whitelist) return message.reply(strings.get('WHITELITS_APROVE_WITHOUT_WL', member.user.id)).then( async m => { // verificar se tem whitelist
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    let response = true;
    if (whitelist.moderated && !whitelist.approved) 
      await message.reply(strings.get('WHITELITS_APROVE_REPROVED', member.user.id)).then( async m => { // verifica se está reprovaod na última whitelist e pergunta se deseja aprovar ainda assim
        const options = ['sim', 'não'];

        const filter = response => {
          return options.some(option => option.toLowerCase() === response.content.toLowerCase()) && response.author.id === message.author.id;
        };
        
        response = await message.channel.awaitMessages(filter, { max:1, time: 20000, errors: ['time'] })
          .then(collected => {
            if(collected.first().content.toLowerCase() === 'não') {
              m.delete();
              message.delete();
              collected.map(message => message.delete());

              return false;
            }
            
            m.delete();
            collected.map(message => message.delete());

            return true;
          })
          .catch(collected => {
            m.delete();
            message.delete();
            collected.map(message => message.delete());

            return false;
          });
      });

    if (!response) return;

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

    whitelist.moderated = true;
    whitelist.approved = true;
    whitelist.save();

    this.client.logger.log('info', `${message.author.username} (${message.author.id}) aprovou ${member.user.username} (${member.user.id}) na whitelist`);
  }
}

module.exports = Approve;