/*!
grunt-release-github 2.0.0, built on: 2017-08-01
Copyright (C) 2017 Daniel Arteaga
http://darteaga.com
https://github.com/dani8art/grunt-release-github*/


'use strict';


var childProcess = require('child_process'),
    Promise = require('bluebird'),
    grunt = require('grunt');


module.exports = {
    run: _run
};

function _run(command, options) {

    grunt.log.ok('RUN ' + command + ' ' + options.join(' '));

    return new Promise(function (resolve, reject) {
        var process = childProcess.spawn(command, options, { shell: true });

        process.stdout.on('data', function () { });

        process.stderr.on('data', function () { });

        process.on('exit', function (code) {
            if (!code) {
                resolve();
            } else {
                grunt.log.error('An error occured while ' + command + ' was executing.');
                reject(new Error('An error occured while  ' + command + ' ' + options.join(' ') + ' was executing.'));
            }
        });
    });
}