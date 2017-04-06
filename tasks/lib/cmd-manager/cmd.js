'use strict';


var childProcess = require('child_process'),
    Promise = require('bluebird'),
    ErrorModel = require('../domain/error-model').ErrorModel,
    grunt = require('grunt');


module.exports = {
    run: _run
};

function _run(command, options) {

    grunt.log.ok('running: ' + command + ' ' + options);

    return new Promise(function (resolve, reject) {
        var process = childProcess.spawn(command, options, { shell: true });

        process.stdout.on('data', function () {
            //console.log(data.toString());
            //grunt.log.ok(data.toString());
        });

        process.stderr.on('data', function () {
            //console.log(data.toString());
            // grunt.log.warn(data.toString());
        });

        process.on('exit', function (code) {
            if (!code) {
                grunt.log.ok(command + " has been executed successfully");
                resolve();
            } else {
                grunt.log.error('An error occured while ' + command + ' was executing.');
                reject(new Error('An error occured while command was executing.'));
            }
        });
    });
}