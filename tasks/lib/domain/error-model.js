/*!
grunt-release-github 2.0.0, built on: 2017-08-01
Copyright (C) 2017 Daniel Arteaga
http://darteaga.com
https://github.com/dani8art/grunt-release-github*/


'use strict';

module.exports = {
    ErrorModel: _ErrorModel
};

function _ErrorModel(code, message) {
    this.code = code;
    this.message = message;
}

