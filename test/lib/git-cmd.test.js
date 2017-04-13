'use strict';

var gitCMD = require('../../tasks/lib/cmd-manager/git-cmd'),
    rollbackManager = require('../../tasks/lib/rollback-manager/rollback-manager');

var grunt = require('grunt');
var version = '0.0.0-' + Math.random();
var gitData = {
    commitMessage: 'test version' + version,
    tagMessage: version,
    tagName: 'v' + version,
    remote: 'origin'
};

exports.github_cmd = {

    setUpGithubTests: function (test) {
        grunt.file.write('test/fixtures/_cmd-manager.txt', Math.random());
        test.done();
    },

    git_add: function (test) {
        gitCMD.gitAdd().then(function () {
            rollbackManager.addStepCalled('add', {});
            test.done();
        }, function () {
            rollbackManager.rollback(grunt).then(test.done, test.done);
        });
    },

    git_commit: function (test) {
        gitCMD.gitCommit(grunt, gitData).then(function () {
            rollbackManager.addStepCalled('commit', { options: gitData });
            test.done();
        }, function () {
            rollbackManager.rollback(grunt).then(test.done, test.done);
        });
    },

    git_tag: function (test) {
        gitCMD.gitTag(grunt, gitData).then(function () {
            rollbackManager.addStepCalled('tag', { options: gitData });
            test.done();
        }, function () {
            rollbackManager.rollback(grunt).then(test.done, test.done);
        });
    },

    git_push: function (test) {
        gitCMD.gitPush(gitData).then(test.done, test.done);
    },

    git_push_tag: function (test) {
        gitCMD.gitPushTag(grunt, gitData).then(function () {
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