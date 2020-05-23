/*jshint esversion: 10 */
const { Command } = require('../../base');

const { MessageEmbed, Util } = require('discord.js');

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

    async run (message, args, data) {
        const client = this.client;

        if (message.channel.id !== client.config.whitelist.channelId) {
            return message.channel.send("Wrong place to do this!")
                .then(m => {
                    m.delete({ timeout: 5000 });

                    return message.delete({ timeout: 2500 });
                });
        }

        let questions = require('./questions.json');

        let answers = [];

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

            const firstMessage = new MessageEmbed()
                .setTitle('Moitas DayZ RP')
                .setDescription('**Seja bem-vindo ao nosso sistema de Whitelist!**')
                .setThumbnail(client.config.whitelist.thumbnail)
                .addFields(
                    { name: '\u200B', value: 'Para iniciar as perguntas digite `iniciar`' },
                    { name: '\u200B', value: `Você possui 1 minuto para responder cada pergunta. ${emojis.loading} \nSomente você e o Bot tem acesso a este canal.` },
                    { name: '\u200B', value: '*Mesmo se falhar você poderá refazer a whitelist.*' }
                )
                .setFooter(client.config.embed.footer(client.config), client.config.logo)
                .setColor(client.config.embed.color);
          
            let channelMessage = await channel.send(firstMessage);
          
            await channel.awaitMessages((m) => (m.author.id === message.author.id) && (m.content === "iniciar"), { max: 1, time: 5000, errors: ["time"] })
                .then(async response => {
                    response.first().delete(); // deleta resposta iniciar

                    let i = 1;
                    for (const question of questions) {
                        const questionEmbed = new MessageEmbed()
                            .setTitle('Moitas DayZ RP')
                            .setDescription(`_Questão_ **${i++}**`)
                            .setThumbnail(client.config.whitelist.thumbnail)
                            .addFields(
                                { name: '\u200B', value: `> ***${question.question}***` }
                            )
                            .setFooter(client.config.embed.footer(client.config), client.config.logo)
                            .setColor(client.config.embed.color);
                        
                        let iQ = 1;
                        if (question.options) { // se for uma pergunta com escolha
                            for (const op of question.options) {
                                questionEmbed.addField('\u200B', `${iQ++}: ${op}`);
                            }
                        }

                        questionEmbed.addField('\u200B', 'Você possui 1 minuto para responder. <:loading:713102638509719592>');
                        questionEmbed.addField('\u200B', '*Mesmo se falhar você poderá refazer a whitelist.*');
                        
                        channelMessage.edit(questionEmbed); //altera sempre a mesma msg embed

                        await channel.awaitMessages((m) => (m.author.id === message.author.id), { max:1, time: 10000, erros: ["time"] }).then(response => {
                            response.first().delete();
                        });
                    }

                }).catch((err) => {
                    message.reply('O tepo acabou...').then( m => {
                        m.delete({ timeout: 20000 });
                    });

                    return setTimeout(() => {
                        channel.delete();
                    }, 10000);
                });
                
            // channel.send("```css\nWhitelist finalizada... a sala será apaagda```"); 

            // return setTimeout(() => {
            //     channel.delete();
            // }, 10000);
        });
    }
}

module.exports = Whitelist;