/*jshint esversion: 10 */
const { Command } = require('../../base');

const ytdl = require('ytdl-core');


class Play extends Command {
  constructor(client) {
    super(client, {
      name: 'rastaplay',
      // description: 'No description provided',
      // usage = 'No usage provided',
      // examples = 'No example provided',
      dirname: __dirname,
      enabled: true,
      guildOnly: false,
      aliases: [],
      botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS' ],
      memberPermissions: [],
      nsfw: false,
      ownerOnly: false,
      cooldown: 3000,
    });

    this.client = client;
  }

  async run(message, args) {
    try {
      const queue = this.client.queue;

      const serverQueue = this.client.queue.get(message.guild.id);

      const voiceChannel = message.member.voice.channel;

      if (!voiceChannel) 
        return message.channel.send('You need to be in a voice channel to play music!');

      const permissions = voiceChannel.permissionsFor(message.client.user);

      if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) 
        return message.channel.send('I need the permissions to join and speak in your voice channel!');

      const songInfo = await ytdl.getInfo(args.join(' '));

      const song = {
        title: songInfo.title,
        url: songInfo.video_url
      };

      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
          let connection = await voiceChannel.join();

          queueContruct.connection = connection;

          this.play(message, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);

          queue.delete(message.guild.id);

          return message.channel.send(err);
        }
      } else {
        serverQueue.songs.push(song);

        return message.channel.send(`${song.title} has been added to the queue!`);
      }
    } catch (err) {
      console.log(err);

      message.channel.send(err.message);
    }
  }

  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(guild.id);
  
    if (!song) {
      serverQueue.voiceChannel.leave();

      queue.delete(guild.id);

      return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on('finish', () => {
        console.log('Music ended!');

        serverQueue.songs.shift();

        this.play(message, serverQueue.songs[0]);
      })
      .on('error', error => { console.error(error); });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  }
}

module.exports = Play;