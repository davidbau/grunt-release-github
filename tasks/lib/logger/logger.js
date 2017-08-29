/*!
grunt-release-github 1.0.4, built on: 2017-08-01
Copyright (C) 2017 Daniel Arteaga
http://darteaga.com
https://github.com/dani8art/grunt-release-github*/


'use strict';

var logger = require('winston');

//Customising logger
logger.transports.Console.timestamp = true;
logger.level = 'info';

module.exports = logger;
