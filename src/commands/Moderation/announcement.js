/*jshint esversion: 10 */
const { Command } = require('../../base');

const { MessageCollector, MessageEmbed } = require('discord.js');


class Announcement extends Command {
    constructor(client) {
        super(client, {
            name: "announcement",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "anuncio", "anc" ],
            memberPermissions: [ "MENTION_EVERYONE" ],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 3000
        });

        this.client = client;
    }

    async run(message, args) {
        const client = this.client;

        let text = args.join(" ");
        if (!text) {
            return message.channel.send('You must enter the text of the announcement!')
                .then((m) => {
                    m.delete({ timeout: 10000 });
                });
        }

        if (text.lenght > 1030) {
            return message.channel.send('Please enter a text of less than 1030 characters!')
                .then((m) => {
                    m.delete({ timeout: 10000 });
                });
        }

        let mention = "";

        let msg = await message.channel.send("Would you like to add a mention to your message? Answer `yes` or `no`!");

        const collector = new MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: 240000 });

        collector.on("collect", async (tmsg) => {
            if(tmsg.content.toLowerCase() === 'no') {
                tmsg.delete();
                msg.delete();
                collector.stop(true);
            }

            if(tmsg.content.toLowerCase() === 'yes') {
                tmsg.delete();
                msg.delete();

                let tmsg1 = await message.channel.send("Type one of the following answers: `every` (for a mention @ everyone) or `here` (for a mention @ here)!");

                let c = new MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: 60000 });

                c.on("collect", (m) => {
                    if(m.content.toLowerCase() === "here") {
                        mention = "@here";
                        tmsg1.delete();
                        m.delete();
                        collector.stop(true);
                        c.stop(true);
                    } else if(m.content.toLowerCase() === "every") {
                        mention = "@everyone";
                        tmsg1.delete();
                        m.delete();
                        collector.stop(true);
                        c.stop(true);
                    }
                });

                c.on("end", (collected, reason) => {
                    if(reason === "time") {
                        return message.channel.send("Time's up! Please retype the command!");
                    }
                });
            }
        });

        collector.on("end", (collected, reason) => {
            if(reason === "time") {
                return message.channel.send("Time's up! Please retype the command!");
            }

            let embed = new MessageEmbed()
                .setAuthor("📢 Announcement :")
                .setColor(client.config.embed.color)
                .setFooter(message.author.tag)
                .setTimestamp()
                .setDescription(text);
            
            message.channel.send(mention, embed);
        });
    }
}

module.exports = Announcement;