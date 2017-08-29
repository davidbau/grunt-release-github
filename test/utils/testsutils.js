/*!
grunt-release-github 1.0.4, built on: 2017-08-01
Copyright (C) 2017 Daniel Arteaga
http://darteaga.com
https://github.com/dani8art/grunt-release-github*/


'use strict';

var grunt = require('grunt');


module.exports = {
    compareFiles: _compareFiles,
    compareFilesJSON: _compareFilesJSON,
    compareJSON: _compareJSON,
    loadCredentials: _loadCredentials
}

function _compareFiles(test, filename, description) {
    var actual = grunt.file.read('test/fixtures/_' + filename);
    var expected = grunt.file.read('test/expected/' + filename);
    test.strictEqual(actual, expected, description);
    test.done();
}

function _compareJSON(test, object, filename, description) {
    var actual = object;
    var expected = grunt.file.readJSON('test/expected/' + filename);
    test.deepEqual(actual, expected, description);
    test.done();
}

function _compareFilesJSON(test, filename, description) {
    var actual = grunt.file.readJSON('test/fixtures/_' + filename);
    var expected = grunt.file.readJSON('test/expected/' + filename);
    test.deepEqual(actual, expected, description);
    test.done();
}

function _loadCredentials() {
    var credentials = null;
    try {
        credentials = grunt.file.readJSON('test/fixtures/credentials.json');
    } catch (e) {
        credentials = {};
    }
    return credentials;
}
