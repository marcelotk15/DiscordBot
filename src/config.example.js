/*jshint esversion: 10 */
module.exports = {
  token: '', /* The token of your Discord Bot */
	
  mongoDB: 'mongodb://10.0.0.101:27017/MoitaDB', // The URl of the mongodb database

  prefix: '!', // The default prefix for the bot

  logo: 'https://i.imgur.com/TlSWaAA.png',
	
  autoDeleteModCommands: true,

  /* For the embeds (embeded messages) */
  embed: {
    color: '#ccad73', // The default color for the embeds
    footer: (config) => `${config.botname} | Sistema feito por ${config.owner.name}`
  },
	
    
  botname: 'MoitasDayz', // The name of the bot

  /* Bot's owner informations */
  owner: {
    id: '667543310079885343', // The ID of the bot's owner
    name: 'teka#3059' // And the name of the bot's owner
  },
    
  /* The others utils links */
  others: {
    github: '', // Founder's github account
    donate: '' // Donate link
  },
    
  /* The Bot status */
  status: [
    {
      name: '@MoitasDayZ help on {serversCount} servers',
      type: 'LISTENING'
    },
    {
      name: 'my website : moitas.com',
      type: 'PLAYING'
    }
  ],

  whitelist: {
    channelId: '713551121024811019',
    parrentId: '676438468775247872',
    thumbnail: 'https://image.flaticon.com/icons/png/512/1486/1486433.png'
  },
};