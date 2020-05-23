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
        this.functions = require("../helpers/functions"); // Load the functions file
        this.logs = require("../base/Log"); // Log mongoose model
        this.whitelists = require("../base/Whitelist"); // Whitelis mongoose model
        this.logger = require('../helpers/logger');
        this.strings = new(require('../strings'))();
    }

    load(dirCommands, dirEvents) {
        const nodes = this.functions.readdirSyncRecursive(dirCommands)
            .filter(file => file.endsWith('.js'))
            .map(require);

        this.functions.readdirSyncRecursive(dirEvents)
            .filter(file => file.endsWith('.js'))
            .map(require)
            .forEach(event => {
                nodes.push(event);
            });

        nodes.forEach(Node => {
            if (Node.prototype instanceof Command) {
                const loaded = Array.from(this.commands.values()).some(
                    command => command instanceof Node,
                );

                if (!loaded) {
                    this.loadCommand(new Node(this));
                }
            }

            if (Node.prototype instanceof Event) {
                const loaded = Array.from(this.events.values()).some(
                    command => command instanceof Node,
                );

                if (!loaded) {
                    this.loadEvent(new Node(this));
                }
            }
        });
    }

    loadCommand(command) {
        try {
            this.logger.log(`Loading Command: ${command.help.name} from module ${command.help.category}`, "log");

            if (this.commands.has(command.help.name) || this.aliases.has(command.help.name)) {
                this.logger.log(`Can't load command, the name '${command.help.name}' is already used as a command name or alias`, "warn");
                return;
            }

            this.commands.set(command.help.name, command);

            command.conf.aliases.forEach((alias) => {
                if(this.commands.has(alias) || this.aliases.has(alias)) {
                    this.logger.log(`Can't load command, the alias '${alias}' is already used as a command name or alias`, "warn");
                    return;
                }

                this.aliases.set(alias, command.help.name);
            });

        } catch (err) {
            return `Unable to load command ${command.help.name}`;
        }
    }

    loadEvent(event) {
        this.logger.log(`Loading Event: ${event.conf.name}.`, "log");

        this.events.set(event.conf.name, event);

        this.on(event.conf.name, (...args) => event.run(...args));
    }
}

module.exports = Moitas;