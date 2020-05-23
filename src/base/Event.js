/*jshint esversion: 10 */
class Event {
    constructor(client, {
        name = null,
    }) {
        this.client = client;
        this.conf = { name }; 
    }

    run() {
        throw new Error(`Event ${this.conf.name} is missing run method`);
    }
}

module.exports = Event;