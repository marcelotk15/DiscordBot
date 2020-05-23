/*jshint esversion: 10 */
const mongose = require('mongoose');

module.exports = mongose.model('Whitelist', new mongose.Schema({
    date: { type: Number, default: Date.now() },
    author: { type: Object, default: {
        username: 'Unknown',
        discrminator: '0000',
        id: null
    }},
    questions: { type: Object, default: null },
    answers: { type: Object, default: null },
    moderated: { type: Boolean, default: false},
    approved: { type: Boolean, default: false},
}));