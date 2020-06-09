/*jshint esversion: 10 */
const { Command } = require('../../base');

class Purge extends Command {
  constructor (client) {
    super(client, {
      name: 'purge',
      description: 'Delete the last messages in all chats (requires value between 2-100',
      // usage: '',
      // examples: '',
      dirname: __dirname,
      enabled: true,
      guildOnly: true,
      aliases: [ '' ],
      memberPermissions: [ 'MANAGE_GUILD' ],
      botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES' ],
      nsfw: false,
      ownerOnly: false,
      cooldown: 3000
    });
  }

  async run (message, args) {
    let deleteCount = 0;

    try {
      deleteCount = parseInt(args[0], 10);
    } catch {
      return message.reply('Please provide the number of messages to delete. (max 100)');
    }

    if(!deleteCount || deleteCount < 2 || deleteCount > 100) return message.reply('Please provide a number between 2 and 100 for the number of messages to delete');

    const fetched = await message.channel.messages.fetch({ limit: deleteCount });

    message.channel.bulkDelete(fetched)
      .catch(err => message.reply(`Couldn't delete messages because of: ${err}`));
  }
}

module.exports = Purge;
