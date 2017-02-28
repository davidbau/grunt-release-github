'use strict';

var cmdManager = require('../../tasks/lib/cmd-manager/cmd-manager');
var grunt = require('grunt');


exports.milestone = {
    setUpGitTests: function (test) {
        grunt.file.write(Math.random());
    },
    git_add: function (test) {
        cmdManager.gitAdd(['.']).then(test.done, test.done);
    },
    git_commit: function (test) {
        cmdManager.gitCommit("Tests").then(test.done, test.done);
    }
};