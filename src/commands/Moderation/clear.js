/*jshint esversion: 10 */
//TODO: REVER
const { Command } = require('../../base');

class Clear extends Command {
  constructor (client) {
    super(client, {
      name: 'clear',
      description: 'Deletes messages very quickly!',
      usage: 'clear [number-of-messages] (@member)',
      examples: '$clear 10\n$clear 10 @Androz#2091',
      dirname: __dirname,
      enabled: true,
      guildOnly: true,
      aliases: [ 'bulkdelete' ],
      memberPermissions: [ 'MANAGE_MESSAGES' ],
      botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES' ],
      nsfw: false,
      ownerOnly: false,
      cooldown: 3000
    });
  }

  async run (message, args) {
    if (args[0] === 'all') {
      message.channel.send('All messages of the channel will be deleted! To confirm type `-confirm`');

      await message.channel.awaitMessages((m) => (m.author.id === message.author.id) && (m.content === '-confirm'), {
        max: 1,
        time: 20000,
        errors: ['time']
      }).catch(() => {
        // if the author of the commands does not confirm the backup loading
        return message.channel.send('Time\'s up! Please retype the command!');
      });

      let position = message.channel.position;

      let newChannel = await message.channel.clone();

      await message.channel.delete();

      newChannel.setPosition(position);
      return newChannel.send('Salon reinitialized!');
    }

    let amount = args[0];
    if(!amount || isNaN(amount) || parseInt(amount) < 1){
      return message.channel.send('You must specify a number of messages to delete!');
    }

    await message.delete();

    let user = message.mentions.users.first();

    let messages = await message.channel.messages.fetch({ limit:100 });

    messages = messages.array();

    if(user){
      messages = messages.filter((m) => m.author.id === user.id);
    }

    if(messages.length > amount){
      messages.length = parseInt(amount, 10);
    }

    messages = messages.filter((m) => !m.pinned);
    amount++;

    message.channel.bulkDelete(messages, true);

    let toDelete = null;

    if(user){
      toDelete = await message.channel.send(`**${--amount}** messages of **${user.tag}** deleted !`);
    } else {
      toDelete = await message.channel.send(`**${--amount}** messages deleted!`);
    }

    setTimeout(function(){
      toDelete.delete();
    }, 2000);
  }
}

module.exports = Clear;