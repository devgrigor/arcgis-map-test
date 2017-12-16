'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './donation.events';
import enums from '../enum/enum.controller';
import * as SimpleHelper from '../../helper/simple.helper';

const DonationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^((00|\+)([0-9]{12}))$/i.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(v);
            },
            message: '{VALUE} is not a valid email!'
        },
    },
    geo: {
        type: [Number],  // [<latitude>, <longitude>]
        index: '2d',
        default: [0, 0]
    },
    bloodGroup: {
        type: String,
        enums: enums.bloodGroup,
        required: true
    },
    antigen: {
        type: String,
        enums: enums.antigen,
        required: true
    },
    linkId: {
        type: String,
        default: () => SimpleHelper.getRandomArbitrary(1000000000, 1000000000000),
    }
});

registerEvents(DonationSchema);

export default mongoose.model('Donation', DonationSchema);
