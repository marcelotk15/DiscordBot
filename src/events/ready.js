/*jshint esversion: 10 */
const { Event } = require('../base');

class Ready extends Event {
    constructor(client) {
        super(client, {
            name: 'ready',
        });

        this.client = client;
    }

    async run () {
        let client = this.client;

        client.logger.log(`Loading a total of ${client.commands.size} command(s).`, "log");
        client.logger.log(`Loading a total of ${client.events.size} event(s).`, "log");
        client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");

        // Update the game every 20s
        const status = require('../config').status,
        version = require("../../package.json").version;

        let i = 0;
        setInterval(function(){
            let toDisplay = status[parseInt(i, 10)].name.replace("{serversCount}", client.guilds.cache.size)+" | v"+version;
            client.user.setActivity(toDisplay, {type: status[parseInt(i, 10)].type});
            if(status[parseInt(i+1, 10)]) i++;
            else i = 0;
        }, 20000); // Every 20 seconds
    }
}

module.exports = Ready;