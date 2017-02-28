'use strict';

var cmdManager = require('../../tasks/lib/cmd-manager/cmd-manager');
var grunt = require('grunt');

var tagName = "";

exports.cmdManager = {

    setUpGitTests: function (test) {
        grunt.file.write('test/fixtures/_cmd-manager.txt', Math.random());
        test.done();
    },

    git_add: function (test) {
        cmdManager.gitAdd(['.']).then(test.done, test.done);
    },

    git_commit: function (test) {
        cmdManager.gitCommit("Tests").then(test.done, test.done);
    },

    git_tag: function (test) {
        tagName = 'tests_' + Math.random();
        cmdManager.gitTag(tagName, 'message text ' + Math.random())
            .then(test.done, test.done);
    },

    git_push: function (test) {
        cmdManager.gitPush('origin').then(test.done, test.done);
    },

    git_push_tag: function (test) {
        cmdManager.gitPushTag('origin', tagName).then(test.done, test.done);
    }
};