'use strict';

const express = require('express');
const controller = require('./donation.controller');

const router = express.Router();

router.get('/',  controller.index);
router.get('/:linkId', controller.show);
router.post('/',  controller.create);
router.put('/:linkId', controller.upsert);
router.delete('/:linkId', controller.destroy);

module.exports = router;
