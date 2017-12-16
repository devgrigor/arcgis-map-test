'use strict';
import Donation from './donation.model';
import * as SimpleHelper from '../../helper/simple.helper';
import _ from 'lodash';

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.remove()
                .then(() => {
                    res.status(204).end();
                });
        }
    };
}

function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            throw null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        console.log(err);

        res.status(statusCode).send(err);
    };
}


export function index(req, res) {
    let filters = req.query;
    const donation = Donation.find().select('-linkId');
    if (filters.max && filters.min) {
        if (SimpleHelper.isJson(filters.max)) {
            filters.max = JSON.parse(filters.max);
        }
        if (SimpleHelper.isJson(filters.min)) {
            filters.min = JSON.parse(filters.min);
        }
        donation.where({
            geo: {
                $geoWithin: // <bottom left coordinates>  - <upper right coordinates>
                    {$box: [filters.min, filters.max]}
            }
        });
    }
    donation
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Donation from the DB
export function show(req, res) {
    return Donation.findOne({linkId: req.params.linkId})
        .exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}


// Creates a new Donation in the DB
export function create(req, res) {
    let donation = req.body;
    donation = new Donation(donation);
    return donation.save()
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
}


// Deletes a Donation from the DB
export function destroy(req, res) {
    return Donation.findOne({linkId: req.params.linkId})
        .exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

// Upserts the given Donation in the DB at the specified ID
export function upsert(req, res) {
    return Donation.findOne({linkId: req.params.linkId})
        .exec()
        .then(handleEntityNotFound(res))
        .then(donation => {
            donation = _.assign(donation, req.body);
            return donation.save();
        })
        .then(respondWithResult(res))
        .catch(handleError(res));
}
