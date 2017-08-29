/*!
grunt-release-github 1.0.4, built on: 2017-08-01
Copyright (C) 2017 Daniel Arteaga
http://darteaga.com
https://github.com/dani8art/grunt-release-github*/


'use strict';

var gitCMD = require('../../../tasks/lib/cmd-manager/git-cmd'),
    rollbackManager = require('../../../tasks/lib/rollback-manager/rollback-manager');

var grunt = require('grunt');
var version = '0.0.0-' + Math.random();
var gitData = {
    commitMessage: 'test version' + version,
    tagMessage: 'v' + version,
    tagName: version,
    remote: 'origin'
};

exports.github_cmd = {

    setUpGithubTests: function (test) {
        grunt.file.write('test/fixtures/_cmd-manager.txt', Math.random());
        test.done();
    },

    git_add: function (test) {
        gitCMD.add().then(function () {
            rollbackManager.addStepCalled('add', {});
            test.done();
        }, function () {
            rollbackManager.rollback(grunt).then(test.done, test.done);
        });
    },

    git_commit: function (test) {
        gitCMD.commit(grunt, gitData).then(function () {
            rollbackManager.addStepCalled('commit', { options: gitData });
            test.done();
        }, function () {
            rollbackManager.rollback(grunt).then(test.done, test.done);
        });
    },

    git_tag: function (test) {
        gitCMD.tag(grunt, gitData).then(function () {
            rollbackManager.addStepCalled('tag', { options: gitData });
            test.done();
        }, function () {
            rollbackManager.rollback(grunt).then(test.done, test.done);
        });
    },

    git_push: function (test) {
        gitCMD.push(gitData).then(test.done, test.done);
    },

    git_push_tag: function (test) {
        gitCMD.pushTag(grunt, gitData).then(function () {
            rollbackManager.addStepCalled('pushTag', { options: gitData });
            test.done();
        }, function () {
            rollbackManager.rollback(grunt).then(test.done, test.done);
        });
    },

    rollback: function (test) {
        rollbackManager.rollback(grunt).then(test.done, test.done);
    }
};