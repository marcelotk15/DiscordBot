/*jshint esversion: 10 */
const { Command } = require('../../base');

const { MessageEmbed } = require('discord.js');

class Reprove extends Command {
  constructor(client) {
    super(client, {
      name: 'reprove',
      // description: 'No description provided',
      // usage = 'No usage provided',
      // examples = 'No example provided',
      dirname: __dirname,
      enabled: true,
      guildOnly: false,
      aliases: [ 'reprovar' ],
      botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS' ],
      memberPermissions: [], // TODO definir
      nsfw: false,
      ownerOnly: false,
      cooldown: 3000,
    });

    this.client = client;
  }

  async run(message, args) {
    const strings = this.client.strings;
    const config = this.client.config;

    if(!args[0]) return message.reply(strings.get('WHITELIST_APROVE_WITHOUT_USER')).then( m => { //verificar se tem o user no argumento
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    const motivo = args.slice(1).join(' ');
    if(!motivo) return message.reply(strings.get('WHITELIST_APROVE_MOTIVE')).then( m => { //verificar se tem motivo
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    let member = await this.client.resolveMember(args[0], message.guild); // procura o user dentro do sv

    if (!member) return message.reply(strings.get('WHITELIST_APROVE_USER_LEFT')).then( m => { // verificar se achou o user dentro do sv
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    if (member.roles.cache.has(config.whitelist.approvedRole)) return message.reply(strings.get('WHITELIST_APROVE_ALREADY_APPROVED', member.user.id)).then( m => { // verifica se já foi aprovado
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    const whitelist = await this.client.findWhitelist(member);// procura a whitelist
    if (!whitelist) return message.reply(strings.get('WHITELIST_APROVE_WITHOUT_WL', member.user.id)).then( async m => { // verificar se tem whitelist
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    console.log(whitelist.moderated);

    if (whitelist.moderated) return message.reply(strings.get('WHITELIST_APROVE_ALREADY_REPROVED', member.user.id)).then( async m => { // reprovado
      m.delete({ timeout: 10000 });
      message.delete({ timeout: 10000 });
    });

    message.delete({ timeout: 10000 });

    let pvEmbed = new MessageEmbed()
      .setColor('#c40b05')
      .setTitle(`Olá, ${member.user.username}`)
      .setDescription(`Você acaba de ser reprovado na nossa whitelist! \nMotivo da reprovação: \n\`\`\`${motivo}\`\`\``)
      .addField('\u200B', '*Você pode refazer a whitelist e boa sorte!*');
    member.send(pvEmbed);

    let messageEmbed = new MessageEmbed()
      .setColor('#c40b05')
      .setTitle('Membro reprovado!')
      .addFields(
        { name: '> Membro:', value: `<@${member.id}>`, inline: true },
        { name: '> Reprovado por:', value: `<@${message.author.id}>`, inline: true },
        { name: 'Motivo:', value: `\`\`\`${motivo}\`\`\`` }
      );
    message.channel.send(messageEmbed);
     
    whitelist.moderated = true;
    whitelist.approved = false;
    whitelist.save();

    this.client.logger.log('info', `${message.author.username} (${message.author.id}) reprovou ${member.user.username} (${member.user.id}) na whitelist`);
  }
}

module.exports = Reprove;