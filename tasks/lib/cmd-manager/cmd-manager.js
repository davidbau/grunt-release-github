'use strict';

var childProcess = require('child_process');
var Promise = require('bluebird');
var logger = require('../logger/logger');
var ErrorModel = require('../domain/error-model');
var grunt = require('grunt');


module.exports = {
    gitAdd: _gitAdd,
    gitCommit: _gitCommit,
    gitTag: _gitTag,
    gitPush: _gitPush,
    gitPushTag: _gitPushTag,
    npmPublish: _npmPublish
};

function _gitTag(tagName, tagMessage) {
    return _run('git', ['tag', tagName, '-m', '"' + tagMessage + '"']);
}

function _gitAdd(options) {
    return _run('git', ['add'].concat(options));
}

function _gitCommit(commitMessage) {
    return _run('git', ['commit', '-m', commitMessage]);
}

function _gitPush(remote) {
    return _run('git', ['pus', remote, 'HEAD']);
}

function _gitPushTag(remote, tagName) {
    return _run('git', ['push', remote, tagName]);
}

function _npmPublish() {
    return _run('npm', ['publish']);
}

function _run(cmd, options) {
    return new Promise(function (resolve, reject) {
        var process = childProcess.spawn(cmd, options);

        // process.stdout.on('data', (data) => {
        //     logger.debug(data.toString());
        // });

        // process.stderr.on('data', (data) => {
        //     logger.debug(data.toString());
        // });

        process.on('exit', (code) => {
            if (!code) {
                grunt.log.ok(cmd + options + "executed successfully.");
                resolve();
            } else {
                grunt.fail.warn("Error while cmd was being executed. Exited with %s", code);
                reject(new ErrorModel(500, 'An error occured while cmd was executing.'));
            }
        });
    });
}