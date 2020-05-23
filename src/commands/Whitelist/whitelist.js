/*jshint esversion: 10 */
const { Command } = require('../../base');

const { MessageEmbed } = require('discord.js');

class Whitelist extends Command {
    constructor (client) {
        super(client, {
            name: "whitelist",
            dirname: __dirname,
            guildOnly: true,
            aliases: [ "wl" ],
        });

        this.client = client;
    }

    async run (message) {
        const client = this.client;

        if (message.channel.id !== client.config.whitelist.channelId) {
            return message.channel.send("Wrong place to do this!")
                .then(m => {
                    m.delete({ timeout: 5000 });

                    return message.delete({ timeout: 2500 });
                });
        }

        const questions = require('./questions.json');

        let answers = [];

        let error = false;

        message.delete();

        await message.guild.channels.create(
            `wl-${message.author.discriminator}`, {
                type: 'text',
                topic: `Sala de Whitelista para ${message.author.username}`,
                parent: client.config.whitelist.parrentId,
                permissionOverwrites: [{
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL']
                }, {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL']
                }]
            }
        ).then(async (channel) => {

            const emojis = {
                loading: `${client.emojis.cache.find(emoji => emoji.name === "loading")}`
            };

            const messageEmbed = new MessageEmbed()
                .setTitle(client.strings.get("WHITELIST_TITLE"))
                .setDescription(client.strings.get("WHITELIST_WELLCOME"))
                .setThumbnail(client.config.whitelist.thumbnail)
                .addFields(
                    { name: '\u200B', value: client.strings.get("WHITELIST_START") },
                    { name: '\u200B', value: client.strings.get("WHITELIST_MSG1") },
                    { name: '\u200B', value: client.strings.get("WHITELIST_MSG2") }
                )
                .setFooter(client.config.embed.footer(client.config), client.config.logo)
                .setColor(client.config.embed.color);
          
            let channelMessage = await channel.send(messageEmbed);

            let filter = m => (m.author.id === message.author.id) && (m.content === client.config.whitelist.startCommand);
          
            await channel.awaitMessages(filter, { max: 1, time: client.config.whitelist.startTime, errors: ["time"] })
                .then(async collected => {

                    collected.first().delete(); // deleta resposta iniciar

                    let i = 1;
                    filter = m => m.author.id === message.author.id;
                    for (const question of questions) {
                        //limpa os fields do embed
                        messageEmbed.fields = [];

                        messageEmbed.setDescription(client.strings.get("WHITELIST_QUESTION_N", i++))
                            .addField('\u200B', client.strings.get("WHITELIST_QUESTION", question.question));
                        
                        let iQ = 1;
                        if (question.options) { // se for uma pergunta com escolha lista as alternativas
                            for (const op of question.options) {
                                messageEmbed.addField('\u200B', `${iQ++}: ${op}`);
                            }
                        }

                        messageEmbed.addField('\u200B', question.time ? client.strings.get("WHITELIST_QUESTION_TIME", question.time) : client.strings.get("WHITELIST_QUESTION_TIME", 60000));
                        messageEmbed.addField('\u200B', client.strings.get("WHITELIST_MSG2"));
                        
                        channelMessage.edit(messageEmbed); //altera sempre a mesma msg embed

                        await channel.awaitMessages(m => (m.author.id === message.author.id), { max:1, time: 10000, erros: ["time"] })
                        .then(collected => {
                            collected.first().delete();

                            //salva a resposta na variavel
                            answers.push(collected.first().content);
                        });

                    }

                }).catch((err) => {
                    message.channel.send(`${client.strings.get("WHITELIST_TIMES_UP", message.author.id)}`)
                        .then( m => {
                            m.delete({ timeout: 20000 });
                        });

                    client.logger.log(err, "error");

                    error = !error;

                    return setTimeout(() => {
                        channel.delete();
                    }, 10000);
                });
            
            //Se não teve erros acessa faz esses comandos para finalizar
            if (!error) {
                //TODO mudar isso e reaproveitar o embed
                channelMessage.delete(); 
                channel.send("```css\nWhitelist finalizada... a sala será apagada```");

                let whitelist = new this.client.whitelists({
                    author: { username: message.author.username, discriminator: message.author.discriminator, id: message.author.id },
                    questions: questions,
                    answers: answers
                });
                whitelist.save();

                let whitelistEmbed = new MessageEmbed()
                    .setAuthor(`Whitelist de ${message.author.username}`, client.config.logo)
                    .setThumbnail(message.author.avatarURL)
                    .setTimestamp()
                    .setColor("#05c46b");
                
                let i = 0;
                for (const question of questions) {
                    whitelistEmbed.addField(
                        question.question,
                        `${(question.options) ? (answers[i] === question.correct) ? ':green_circle:' : ':red_circle:' : `\`${answers[i]}\``}`,
                        true
                    );
                    
                    i++;
                }

                message.guild.channels.cache.get(client.config.whitelist.channelAdm).send(whitelistEmbed);

                return setTimeout(() => {
                    channel.delete();
                }, 15000);
            }
        });
    }
}

module.exports = Whitelist;