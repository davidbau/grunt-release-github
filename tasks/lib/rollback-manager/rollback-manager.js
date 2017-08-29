/*!
grunt-release-github 1.0.4, built on: 2017-08-01
Copyright (C) 2017 Daniel Arteaga
http://darteaga.com
https://github.com/dani8art/grunt-release-github*/


'use strict';

var Promise = require('bluebird'),
    githubClient = require('../services/github-service'),
    npmCMD = require('../cmd-manager/npm-cmd'),
    gitCMD = require('../cmd-manager/git-cmd');

var doneSteps = [];
var rollbackData = {};

module.exports = {
    addStepCalled: _addStepCalled,

    rollback: _rollback,

    rollback_release: _rollback_release,
    rollback_publish: _rollback_publish,
    rollback_pushTag: _rollback_pushTag,
    rollback_tag: _rollback_tag,

    rollback_commit: _rollback_commit,
    rollback_add: _rollback_add,
    clean: _clean
};

function _clean() {
    doneSteps = [];
    rollbackData = {};
}

function _rollback_add(grunt) {
    grunt.log.ok('RUN rollback add');
    return gitCMD.discardChanges();
}

function _rollback_tag(grunt, data) {
    grunt.log.ok('RUN rollback tag');
    return gitCMD.removeTagLocal(grunt, data.options);
}

function _rollback_commit(grunt, data) {
    grunt.log.ok('RUN rollback commit');
    return gitCMD.resetAndPush(grunt, data.options);
}

function _rollback_pushTag(grunt, data) {
    grunt.log.ok('RUN rollback npm publish');
    return gitCMD.removeTagRemote(grunt, data.options); //implement.
}

function _rollback_publish(grunt, data) {
    grunt.log.ok('RUN rollback npm publish');
    return npmCMD.unpublish(data.package, data.version);
}

function _rollback(grunt) {
    grunt.log.ok('Execute ROLLBACK actions');
    var actions = doneSteps.reverse();
    var rollbackManager = this;

    return new Promise(function (resolve, reject) {
        Promise.each(actions, function (action) {
            return rollbackManager['rollback_' + action](grunt, rollbackData[action]);
        }).then(function () {
            _clean();
            resolve();
        }, reject);
    });
}

function _rollback_release(grunt, data) {
    grunt.log.ok('RUN rollback release');
    if (!data || !data.releaseId) {
        grunt.fail.warn('Error: No ID for removing');
    } else {
        return githubClient.removeRelease(data.options, data.repo, data.releaseId);
    }
}

function _addStepCalled(step, data) {
    if (doneSteps.indexOf(step) == -1) {
        doneSteps.push(step);
        rollbackData[step] = data;
    }

}