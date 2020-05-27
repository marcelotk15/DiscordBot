/*jshint esversion: 10 */
const { Client, Collection } = require('discord.js');

const Command = require('./Command'), Event = require('./Event');


class Moitas extends Client {
  constructor(options) {
    super(options);

    this.config = require('../config.js');
    this.commands = new Collection();
    this.events = new Collection();
    this.aliases = new Collection();
    this.functions = require('../helpers/functions'); // Load the functions file
    this.logs = require('../base/Log'); // Log mongoose model
    this.whitelistsData = require('../base/Whitelist'); // Whitelis mongoose model
    this.logger = require('../logger');
    this.strings = new (require('../strings'))();
    this.queue = new Map();
  }

  load(dirCommands, dirEvents) {
    const nodes = this.functions
      .readdirSyncRecursive(dirCommands)
      .filter((file) => file.endsWith('.js'))
      .map(require);

    this.functions
      .readdirSyncRecursive(dirEvents)
      .filter((file) => file.endsWith('.js'))
      .map(require)
      .forEach((event) => {
        nodes.push(event);
      });

    nodes.forEach((Node) => {
      if (Node.prototype instanceof Command) {
        const loaded = Array.from(this.commands.values()).some(
          (command) => command instanceof Node
        );

        if (!loaded) {
          this.loadCommand(new Node(this));
        }
      }

      if (Node.prototype instanceof Event) {
        const loaded = Array.from(this.events.values()).some(
          (command) => command instanceof Node
        );

        if (!loaded) {
          this.loadEvent(new Node(this));
        }
      }
    });
  }

  loadCommand(command) {
    try {
      this.logger.log('silly', `Loading Command: ${command.help.name} from module ${command.help.category}`);

      if (
        this.commands.has(command.help.name) ||
        this.aliases.has(command.help.name)
      ) {
        this.logger.log('silly', `Can't load command, the name '${command.help.name}' is already used as a command name or alias`);
        return;
      }

      this.commands.set(command.help.name, command);

      command.conf.aliases.forEach((alias) => {
        if (this.commands.has(alias) || this.aliases.has(alias)) {
          this.logger.log('warn', `Can't load command, the alias '${alias}' is already used as a command name or alias`,);
          return;
        }

        this.aliases.set(alias, command.help.name);
      });
    } catch (err) {
      return `Unable to load command ${command.help.name}`;
    }
  }

  loadEvent(event) {
    this.logger.log('silly', `Loading Event: ${event.conf.name}.`);

    this.events.set(event.conf.name, event);

    this.on(event.conf.name, (...args) => event.run(...args));
  }

  async resolveMember(search, guild){
    let member = null;
    if(!search || typeof search !== 'string') return;
    // Try ID search
    if(search.match(/^<@!?(\d+)>$/)){
      let id = search.match(/^<@!?(\d+)>$/)[1];
      member = await guild.members.fetch(id).catch(() => {});
      if(member) return member;
    }
    // Try username search
    if(search.match(/^!?(\w+)#(\d+)$/)){
      guild = await guild.fetch();
      member = guild.members.find((m) => m.user.tag === search);
      if(member) return member;
    }
    member = await guild.members.fetch(search).catch(() => {});
    return member;
  }

  async findWhitelist({ id: userID }) {
    return new Promise((resolve) => {
      let whitelistData = this.whitelistsData.findOne({ 'author.id': userID }).sort({ _id: -1 });
      
      resolve(whitelistData || false);
    });
  }
}

module.exports = Moitas;
