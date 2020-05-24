/*jshint esversion: 10 */
const c = require('./config');
const e = c.emojis;

module.exports = class {
  constructor() {
    this.strings = {

      //Utils
      PREFIX_INFO: (prefix) => `o prefixo do servidor é \`${prefix}\``,
      UTILS: {
        YES: 'Sim',
        NO: 'Não',
      },
      VOTE_THANKS: (user) => `:arrow_up: Olá ${user.toString()}, obrigador por ter votado!`,

      //General
      TIMES_UP: `${e.warning} | O tempo para responder acabou, tente novamente.`,

      //Delete Chanel command
      DELETE_CHANEL_QUESTION: 'Você tem certeza que deseja deletar esta sala? Responda com `sim` ou `não`!',

      //Whitelist
      WHITELIST_TITLE: 'Moitas DayZ RP',
      WHITELIST_WELLCOME: '**Seja bem-vindo ao nosso sistema de Whitelist!**',
      WHITELIST_START: `Para iniciar as perguntas digite: \`${c.whitelist.startCommand}\``,
      WHITELIST_MSG1: `:bangbang: Você possui ${this.ms(c.whitelist.startTime)} para começar. \n\n:bangbang: Cada pergunta terá um tempo para resposta dependendo de sua complexidade. \n\n:bangbang: Somente você e o Bot tem acesso a este canal.`,
      WHITELIST_MSG2: '*Mesmo se falhar você poderá refazer a whitelist.*',
      WHITELIST_QUESTION_N: (number) => `_Questão_ **${number}**`,
      WHITELIST_QUESTION: (question) => `> ***${question}***`,
      WHITELIST_QUESTION_TIME: (time) => `Você possui ${this.ms(time)} para responder.`,
      WHITELIST_TIMES_UP: (user) => `${this.get('TIMES_UP')} \n<@${user}>, você falhou na whiteslit porque demorou a responder e falhou. \n\n *Você pode tentar novamnete.*`,
			
      //Announcement
      ANNOUNCEMENT_ERROR_WT: 'Você precisa digitar um texto que será anunciado!',
      ANNOUNCEMENT_ERROR_1030: 'Por favor digite um texto com até ou menos que 1030 caracteres!',
      ANNOUNCEMENT_MENTION: () => `Você deseja adicionar uma menção na mensagem? Responda com: \`${this.get('UTILS').YES.toLowerCase()}\` ou \`${this.get('UTILS').NO.toLowerCase()}\`!`,
      ANNOUNCEMENT_WHAT_MENTION: 'DIgite uma das seguintes respostas: `every` (para uma menção @ everyone) or `here` (para uma menção @ here)!',
      ANNOUNCEMENT_HEAD: '📢 ANÚNCIO :',
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
    
  ms(milliseconds){
    let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
    let days = roundTowardsZero(milliseconds / 86400000),
      hours = roundTowardsZero(milliseconds / 3600000) % 24,
      minutes = roundTowardsZero(milliseconds / 60000) % 60,
      seconds = roundTowardsZero(milliseconds / 1000) % 60;
    if(seconds === 0){
      seconds++;
    }
    let isDays = days > 0,
      isHours = hours > 0,
      isMinutes = minutes > 0;
    let pattern = 
		(!isDays ? '' : (isMinutes || isHours) ? '{days} dias, ' : '{days} dias e ')+
		(!isHours ? '' : (isMinutes) ? '{hours} horas, ' : '{hours} horas e ')+
		(!isMinutes ? '' : '{minutes} minutos e ')+
		('{seconds} segundos');
    let sentence = pattern
      .replace('{duration}', pattern)
      .replace('{days}', days)
      .replace('{hours}', hours)
      .replace('{minutes}', minutes)
      .replace('{seconds}', seconds);
    return sentence;
  }
};