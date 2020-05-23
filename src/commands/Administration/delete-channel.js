/*jshint esversion: 10 */
const { Command } = require('../../base');

const { MessageCollector } = require("discord.js");


class ChannelDelete extends Command {
    constructor(client) {
        super(client, {
            name: "channel-delete",
            dirname: __dirname,
            enabled: true,
            guildOnly: true,
            aliases: [ "deletar-canal"],
            memberPermissions: [ "MANAGE_GUILD" ],
            botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            ownerOnly: false,
            cooldown: 1000
        });

        this.client = client;
    }

    async run(message, args) {
        const client = this.client;

        if (args.join(" ") === client.strings.get("UTILS").YES.toLowerCase()) {
            return message.channel.delete();
        }

        let msg = await message.channel.send(client.strings.get("DELETE_CHANEL_QUESTION"));

        const collector = new MessageCollector(message.channel, (m) => m.author.id === message.author.id, { time: 20000 });

        collector.on("collect", async (collected) => {
            if(collected.content.toLowerCase() === client.strings.get("UTILS").NO.toLowerCase()) {
                message.delete();
                collected.delete();
                msg.delete();
                collector.stop(true);
            }

            if(collected.content.toLowerCase() === client.strings.get("UTILS").YES.toLowerCase()) {
                message.channel.delete();
                collector.stop(true);
            }
        });

        collector.on("end", async (collected, reason) => {
            if (reason === "time") {
                //Deleta as mensagens
                msg.delete();
                message.delete();
                
                return message.channel.send(client.strings.get("TIMES_UP")).then(msg => {
                    msg.delete({ timeout: 15000 });
                });
            }
        });
    }
}
module.exports = ChannelDelete;