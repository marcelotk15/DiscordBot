/*jshint esversion: 10 */
const { Command } = require('../../base');

const { MessageEmbed } = require('discord.js');

class Whitelist extends Command {
  constructor (client) {
    super(client, {
      name: 'whitelist',
      // description: 'No description provided',
      // usage = 'No usage provided',
      // examples = 'No example provided',
      dirname: __dirname,
      enabled: true,
      guildOnly: true,
      aliases: [ 'wl' ],
      botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS' ],
      memberPermissions: [], // TODO definir
      nsfw: false,
      ownerOnly: false,
      cooldown: 3000,     
    });

    this.client = client;
  }

  async run (message) {
    const config = this.client.config;
    const strings = this.client.strings;

    if (message.channel.id !== config.whitelist.channelId) return message.reply(strings.get('WHITELIST_WRONG_CHANNEL'))
      .then(m => {
        m.delete({ timeout: 5000 });

        message.delete({ timeout: 2500 });
      });

    if (message.member.roles.cache.has(config.whitelist.approvedRole))
      return message.reply(strings.get('WHITELIST_ALREADY_APPROVED')).then( m => {
        m.delete({ timeout: 10000 });
        message.delete({ timeout: 5000 });
      });

    const whiteliist = await this.client.findWhitelist(message.author);// procura a whitelist
    if (whiteliist)
      if (!whiteliist.moderated)
        return message.reply(strings.get('WHITELIST_WATING_STAFF')).then( m => {
          m.delete({ timeout: 10000 });
          message.delete({ timeout: 5000 });
        });

    const questions = require('./questions.json');

    let answers = [];

    let error = false;

    message.delete();

    await message.guild.channels.create(
      `wl-${message.author.discriminator}`, {
        type: 'text',
        topic: `Sala de Whitelista para ${message.author.username}`,
        parent: config.whitelist.parrentId,
        permissionOverwrites: [{
          id: message.guild.id,
          deny: ['VIEW_CHANNEL']
        }, {
          id: message.author.id,
          allow: ['VIEW_CHANNEL']
        }]
      }
    ).then(async (channel) => {

      const messageEmbed = new MessageEmbed()
        .setTitle(strings.get('WHITELIST_TITLE'))
        .setDescription(strings.get('WHITELIST_WELLCOME'))
        .setThumbnail(config.whitelist.thumbnail)
        .addFields(
          { name: '\u200B', value: strings.get('WHITELIST_START') },
          { name: '\u200B', value: strings.get('WHITELIST_MSG1') },
          { name: '\u200B', value: strings.get('WHITELIST_MSG2') }
        )
        .setFooter(config.embed.footer(config), this.client.config.logo)
        .setColor(this.client.config.embed.color);
          
      let channelMessage = await channel.send(messageEmbed);

      let filter = m => (m.author.id === message.author.id) && (m.content === config.whitelist.startCommand);
          
      await channel.awaitMessages(filter, { max: 1, time: config.whitelist.startTime, errors: ['time'] })
        .then(async collected => {

          collected.first().delete(); // deleta resposta iniciar

          let i = 1;
          filter = m => m.author.id === message.author.id;
          for (const question of questions) {
            //limpa os fields do embed
            messageEmbed.fields = [];

            messageEmbed.setDescription(strings.get('WHITELIST_QUESTION_N', i++))
              .addField('\u200B', strings.get('WHITELIST_QUESTION', question.question));
                        
            let iQ = 1;
            if (question.options) { // se for uma pergunta com escolha lista as alternativas
              for (const op of question.options) {
                messageEmbed.addField('\u200B', `${iQ++}: ${op}`);
              }
            }

            messageEmbed.addField('\u200B', question.time ? strings.get('WHITELIST_QUESTION_TIME', question.time) : strings.get('WHITELIST_QUESTION_TIME', 60000));
            messageEmbed.addField('\u200B', strings.get('WHITELIST_MSG2'));
                        
            channelMessage.edit(messageEmbed); // altera sempre a mesma msg embed

            await channel.awaitMessages(m => (m.author.id === message.author.id), { max:1, time: question.time || 10000, erros: ['time'] }) // TODO mudar tempo
              .then(collected => {
                collected.first().delete();

                answers.push(collected.first().content); // salva a resposta na variavel
              }).catch(err => {
                message.channel.send(`${strings.get('WHITELIST_TIMES_UP', message.author.id)}`)
                  .then( m => {
                    m.delete({ timeout: 20000 });
                  });

                this.client.logger.log(err, 'error');

                error = !error;

                setTimeout(() => { channel.delete(); }, 10000);
              });
            
            if (error) { // se falhou no tempo de qq questão a whitelist para
              channelMessage.delete();

              break;
            }
          }

        }).catch(err => {
          message.channel.send(`${strings.get('WHITELIST_TIMES_UP_START', message.author.id)}`)
            .then( m => {
              m.delete({ timeout: 20000 });
            });

          this.client.logger.log(err, 'error');

          error = !error;

          setTimeout(() => { channel.delete(); }, 10000);
        });
            
      
      if (!error) { // Se não teve erros acessa faz esses comandos para finalizar
        messageEmbed.fields = [];

        messageEmbed.setDescription(strings.get('WHITELIST_SUCCESS', message.author.id));

        channelMessage.edit(messageEmbed); // 

        saveWhitelsit(message.author, questions, answers, this.client); // salva a whitelist na db

        const whitelistEmbed = enviarWhitelist(message.author, questions, answers, this.client); // montar embed

        message.guild.channels.cache.get(config.whitelist.channelAdm).send(whitelistEmbed);

        setTimeout(() => { channel.delete(); }, 15000);
      }
    });
  }
}

module.exports = Whitelist;

const saveWhitelsit = (author, questions, answers, client) => {
  let whitelist = new client.whitelistsData({
    author: { username: author.username, discriminator: author.discriminator, id: author.id },
    questions: questions,
    answers: answers
  });

  whitelist.save();

  return;
};

const enviarWhitelist = (author, questions, answers, client) => {
  console.log(author.avatarURL);
  let whitelistEmbed = new MessageEmbed()
    .setAuthor(`Whitelist de ${author.username}`, client.config.logo)
    .setThumbnail(author.avatarURL())
    .setTimestamp()
    .setColor('#05c46b')
    .addFields( 
      { name: 'Usuário:',  value: `<@${author.id}>` },
      { name: '\u200B', value: '> Resposats do Usuário' }
    );
                
  let i = 0;
  for (const question of questions) {
    whitelistEmbed.addField(
      question.question,
      `${(question.options) ? (answers[i] === question.correct) ? ':green_circle:' : ':red_circle:' : `\`\`\`${answers[i++]}\`\`\``}`,
      true
    );
  }

  whitelistEmbed
    .addFields(
      { name: '\u200B', value: '\u200B' },
      { name: '\u200B', value: '> Para aprovar ou reprovar:' },
      { name: 'Confirme que o mesmo já está na whitelist antes de aprovar!', value: `\`\`\`php\n!aprovar <@${author.id}> \n!reprovar <@${author.id}> [motivo] //sem []\`\`\`` }
    );

  return whitelistEmbed;
};
