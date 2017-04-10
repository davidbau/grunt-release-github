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

        process.stderr.on('data', function (data) {
            // grunt.log.error(data.toString());
        });

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