/*jshint esversion: 10 */
const { Event } = require('../base');

let cmdCooldown = {};

class Message extends Event {
  constructor(client) {
    super(client, {
      name: 'message',
    });

    this.client = client;
  }

  async run (message) {
    let client = this.client;
    const data = {};

    //canais protegidos
    if(
      client.config.protectfChannels.includes(message.channel.id) && //canais
      !message.content.includes(`${client.config.prefix}whitelist`) && !message.content.includes(`${client.config.prefix}wl`) && //whitelist command
      !message.author.bot && //não é bot
      !message.member.hasPermission('ADMINISTRATOR') /* admin */ ){

      let alert;
      
      switch (message.channel.id) {
      case client.config.whitelist.channelId:
        alert = await message.channel.send('***Este canal não foi feito para bate papo, apenas para a whitelist!*** \nUse `!whitelits` para realizar a sua whitelist!');
        break;
      default:
        alert = await message.channel.send('***Este canal não foi feito para bate papo!***');
      }

      message.delete({ timeout: 5000 });
      alert.delete({ timeout: 15000 });

      return false;
    }

    // If the messagr author is a bot
    if (message.author.bot || !message.content.startsWith(client.config.prefix)) {
      return;
    }

    // If the member on a guild is invisible or not cached, fetch them.
    if(message.guild && !message.member){
      await message.guild.members.fetch(message.author.id);
    }

    // if(this.client.config.proMode && message.guild){
    //     if((!this.client.config.proUsers.includes(message.guild.ownerID) || this.guilds.filter((g) => g.ownerID === message.guild.ownerID) > 1) && message.guild.ownerID !== this.client.config.owner.id){
    //         return message.guild.leave();
    //     }
    // }

    data.config = client.config;

    // if(message.guild){
    //     // Gets guild data
    //     let guild = await client.findOrCreateGuild({ id: message.guild.id });
    //     data.guild = guild;
    // }

    // Check if the bot was mentionned
    if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
      return message.reply(`the prefix of this server is \`${client.config.prefix}\``);
    }

    const [command, ...args] = message.content
      .slice(client.config.prefix.length)
      .split(' ');   
            
    let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if(!cmd){
      return;
    }

    if(cmd.conf.guildOnly && !message.guild){
      return message.channel.send('This command is only available on a server!');
    }

    if(message.guild) {
      let needPermision = [];

      //bot permisions
      if(!cmd.conf.botPermissions.includes('EMBED_LINKS')){
        cmd.conf.botPermissions.push('EMBED_LINKS');
      }

      cmd.conf.botPermissions.forEach((perm) => {
        if (!message.channel.permissionsFor(message.guild.me).has(perm)) {
          needPermision.push(perm);
        }
      });

      if (needPermision.length > 0) {
        return message.channel.send((`I need the following permissions to perform this command: \`${needPermision.map((p) => `${p}`).join(', ')}\``));
      }

      needPermision.length = 0;

      //member permisions
      cmd.conf.memberPermissions.forEach((perm) => {
        if(!message.channel.permissionsFor(message.member).has(perm)) {
          needPermision.push(perm);
        }
      });

      if (needPermision.length > 0) {
        return message.channel.send((`You do not have the necessary permissions to perform this command: \`${needPermision.map((p) => `${p}`).join(', ')}\``));
      }

      // if(data.guild.ignoredChannels.includes(message.channel.id) && !message.member.hasPermission("MANAGE_MESSAGES")){
      //     return (message.delete()) && (message.author.send(`Commands are forbidden in ${message.channel} !`));
      // }

      if(!message.channel.permissionsFor(message.member).has('MENTION_EVERYONE') && (message.content.includes('@everyone') || message.content.includes('@here'))){
        return message.channel.send('You are not allowed to mention everyone or here in the commands.');
      }

      if(!message.channel.nsfw && cmd.conf.nsfw){
        return message.channel.send('You must go to in a channel that allows the NSFW to type this command!');
      }
    } //end if is guild

    if(!cmd.conf.enabled){
      return message.channel.send('This command is currently disabled!');
    }

    if(cmd.conf.ownerOnly && message.author.id !== client.config.owner.id){
      return message.channel.send(`Only @${client.config.owner.name} can do these commands!`);
    }

    let uCooldown = cmdCooldown[message.author.id];

    if(!uCooldown){
      cmdCooldown[message.author.id] = {};
      uCooldown = cmdCooldown[message.author.id];
    }

    let time = uCooldown[cmd.help.name] || 0;
    if(time && (time > Date.now())){
      return message.channel.send(`You must wait **${Math.ceil((time-Date.now())/1000)}** second(s) to be able to run this command again!`);
    }

    cmdCooldown[message.author.id][cmd.help.name] = Date.now() + cmd.conf.cooldown;

    client.logger.log('silly', `${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);

    let log = new this.client.logs({
      commandName: cmd.help.name,
      author: { username: message.author.username, discriminator: message.author.discriminator, id: message.author.id },
      guild: { name: message.guild ? message.guild.name : 'dm', id: message.guild ? message.guild.id : 'dm' }
    });
    log.save();

    try {
      cmd.run(message, args, data);
      if (cmd.help.category === 'Moderation' && client.config.autoDeleteModCommands) {
        message.delete();
      }
    } catch (err) {
      console.error(err);
      return message.channel.send('An error has occurred, please try again in a few minutes.');
    }
  }
}

module.exports = Message;