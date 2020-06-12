/*jshint esversion: 10 */
const { Command } = require('../../base');

const TuneIn = require('node-tunein-radio');


class Start extends Command {
  constructor(client) {
    super(client, {
      name: 'start',
      // description: 'No description provided',
      // usage = 'No usage provided',
      // examples = 'No example provided',
      dirname: __dirname,
      enabled: true,
      guildOnly: false,
      aliases: [],
      memberPermissions: [],
      botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS' ],
      nsfw: false,
      ownerOnly: false,
      cooldown: 3000,
    });

    this.client = client;
  }

  async run(message, args) {

    const radio = this.client.radio;

    const serverRadio = this.client.radio.get(message.guild.id);

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) 
      return message.channel.send('You need to be in a voice channel to play a radio!');

    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) 
      return message.channel.send('I need the permissions to join and speak in your voice channel!');  

    
    const tuneIn = new TuneIn();

    tuneIn.describe(args[0]).then(async data => {     
      message.channel.send(`${data.body[0].name}`);

      let connection = await message.member.voice.channel.join();

      if (!serverRadio) {
        const radioConstruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: connection,
          volume: 5,
          radio: args[0]
        }
  
        await radio.set(message.guild.id, radioConstruct);
  
      } else {
  
        serverRadio.radio = args[0];
        serverRadio.connection = connection;
      }

      tuneIn.tune_radio(args[0]).then(async data => {
        connection.play(data.body[0].url, { seek: 0, volume: 1 });
      }).catch(error => { return console.log(error); });

    }).catch(error => console.log(error));
  }
}

module.exports = Start;