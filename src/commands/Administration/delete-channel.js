/*jshint esversion: 10 */
const { Command } = require('../../base');

const { MessageCollector } = require("discord.js");


class ChannelDelete extends Command {
    constructor(client) {
        super(client, {
            name: "channelDelete",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [],
            memberPermissions: [ "MANAGE_GUILD" ],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 1000
        });
    }

    async run(message, args, data) {

        if (args.join(" ") === "yes" || args.join(" ") === "y") {
            return message.channel.delete();
        }

        let del = false;

        let msg = await message.channel.send("Would you like to delete this channel? Answer `yes` or `no`!");

        const collector = new MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: 20000 });

        collector.on("collect", async (collected) => {
            if(collected.content.toLowerCase() === 'no') {
                message.delete();
                collected.delete();
                msg.delete();
                collector.stop(true);
            }

            if(collected.content.toLowerCase() === 'yes') {
                message.channel.delete();
                collector.stop(true);
            }
        });

        collector.on("end", async (collected, reason) => {
            if (reason === "time") {
                return message.channel.send("Time's up! Please retype the command!");
            }
        });
    }
}
module.exports = ChannelDelete;