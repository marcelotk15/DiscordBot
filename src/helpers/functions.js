/*jshint esversion: 10 */
const fs = require('fs');
const path = require('path');

module.exports = {
  getPrefix(message, data){
    if(message.channel.type !== 'dm'){
      const prefixes = [
        `<@${message.client.user.id}>`,
        data.config.botName,
        data.guild.prefix
      ];
      let prefix = null;
      prefixes.forEach((p) => {
        if(message.content.startsWith(p)){
          prefix = p;
        }
      });
      return prefix;
    } else {
      return true;
    }
  },

  readdirSyncRecursive(directory) {
    let files = [];
        
    fs.readdirSync(directory).forEach(file => {
      const location = path.join(directory, file);

      if(fs.lstatSync(location).isDirectory()) {
        files = files.concat(this.readdirSyncRecursive(location));
      } else {
        files.push(location);
      }
    });

    return files;
  }
};
