/*jshint esversion: 10 */
const c = require("./config");
const e = c.emojis;

module.exports = class {
    constructor() {
        this.strings = {

            //Utils
            PREFIX_INFO: (prefix) => `o prefixo do servidor é \`${prefix}\``,
            UTILS: {
                YES: "Sim",
                NO: "Não",
            },
            VOTE_THANKS: (user) => `:arrow_up: Olá ${user.toString()}, obrigador por ter votado!`,

            //General
            TIMES_UP: `${e.warning} | O tempo para responder acabou, tente novamente.`,

            //Delete Chanel command
            DELETE_CHANEL_QUESTION: "Você tem certeza que deseja deletar esta sala? Responda com `sim` ou `não`!",

            //Whitelist
            WHITELIST_TIMES_UP: (user) => `${this.get("TIMES_UP")} \n<@${user}>, você falhou na whiteslit porque demorou a responder e falhou. \n\n *Você pode tentar novamnete.*`
        };
    }

    get(term, ...args) {
		//if (!this.enabled && this !== this.store.default) return this.store.default.get(term, ...args);
		const value = this.strings[term];
		/* eslint-disable new-cap */
		switch (typeof value) {
			case 'function': return value(...args);
			default: return value;
		}
	}
};