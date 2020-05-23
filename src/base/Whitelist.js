/*jshint esversion: 10 */
const mongose = require('mongoose');

module.exports = mongose.model('Whitelist', new mongose.Schema({
    author: { type: Object, default: {
        username: 'Unknown',
        discrminator: '0000',
        id: null
    }}
}));