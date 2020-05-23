/*jshint esversion: 10 */
const mongose = require('mongoose');

module.exports = mongose.model('Log', new mongose.Schema({
    commandName: { type: String, default: 'unknown' },
    date: { type: Number, default: Date.now() },
    author: { type: Object, default: {
        username: 'Unknown',
        discrminator: '0000',
        id: null
    }},
    guild: { type: Object, default: {
        name: 'Unknown',
        id: null
    }}
}));