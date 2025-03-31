'use strict';

export default class Score {
    #date;
    #hits;
    #percentage;

    constructor (hits, percentage) {
        this.#date = Date.now();
        this.#hits = hits;
        this.#percentage = percentage; 
    }

    get date() {
        const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }
    
        return new Date(this.#date).toLocaleDateString('en-ca', options);
    }

    get hits() {
        return this.#hits;
    }

    get percentage() {
        return this.#percentage;
    }
}