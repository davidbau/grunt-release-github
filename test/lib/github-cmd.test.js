'use strict';

var Github = require('../../tasks/lib/cmd-manager/github-cmd');
var grunt = require('grunt');
var githubCmd;

exports.github_cmd = {

    setUpGithubTests: function (test) {
        grunt.file.write('test/fixtures/_cmd-manager.txt', Math.random());
        githubCmd = new Github(grunt, {
            data: {
                name: '',
                version: '0.0.0-' + Math.random()
            }
        }, {
                remote: 'origin'
            });

        test.done();
    },

    git_add: function (test) {
        githubCmd.gitAdd(['.']).then(test.done, test.done);
    },

    git_commit: function (test) {
        githubCmd.gitCommit().then(test.done, test.done);
    },

    git_tag: function (test) {
        githubCmd.gitTag().then(test.done, test.done);
    },

    git_push: function (test) {
        githubCmd.gitPush().then(test.done, test.done);
    },

    git_push_tag: function (test) {
        githubCmd.gitPushTag().then(test.done, test.done);
    }
};