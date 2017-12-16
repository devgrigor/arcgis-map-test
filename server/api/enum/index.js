'use strict';

const  express = require('express');
const  controller = require('./enum.controller.js');

const  router = express.Router();

router.get('/', controller.index);

module.exports = router;
