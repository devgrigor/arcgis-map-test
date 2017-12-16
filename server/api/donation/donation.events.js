/**
 * Donation model events
 */

'use strict';

import {EventEmitter} from 'events';

let DonationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DonationEvents.setMaxListeners(0);

// Model events
let events = {
    save: 'save',
    remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Donation) {
    for (let e in events) {
        let event = events[e];
        Donation.post(e, emitEvent(event));
    }
}

function emitEvent(event) {
    return function (doc) {
        DonationEvents.emit(event + ':' + doc._id, doc);
        DonationEvents.emit(event, doc);
    };
}

export {registerEvents};
export default DonationEvents;
