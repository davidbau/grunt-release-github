'use strict';

var childProcess = require('child_process');
var Promise = require('bluebird');
var logger = require('../logger/logger');
var ErrorModel = require('../domain/error-model');

module.exports = {
    gitAdd: _gitAdd,
    gitCommit: _gitCommit
};

function _gitAdd(options) {
    return _run('git', ['add'].concat(options));
}

function _gitCommit(commitMessage) {
    return _run('git', ['commit', '-m', commitMessage]);
}


function _run(cmd, options) {
    return new Promise(function (resolve, reject) {
        var process = childProcess.spawn(cmd, options);

        process.stdout.on('data', (data) => {
            logger.info(data.toString());
        });

        process.stderr.on('data', (data) => {
            logger.error(data.toString());
        });

        process.on('exit', (code) => {
            if (!code) {
                logger.info("Execution has been finished.");
                resolve();
            } else {
                logger.error("Error while cmd was being executed. Exited with %s", code);
                reject(new ErrorModel(500, 'An error occured while cmd was executing.'));
            }
        });
    });
}