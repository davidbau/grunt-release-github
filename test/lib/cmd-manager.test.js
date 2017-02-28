'use strict';

var cmdManager = require('../../tasks/lib/cmd-manager/cmd-manager');
var grunt = require('grunt');


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
    }
};