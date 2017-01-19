'use strict';

var grunt = require('grunt');

function compareFiles(test, filename, description) {
    var actual = grunt.file.read('test/fixtures/_' + filename);
    var expected = grunt.file.read('test/expected/' + filename);
    test.strictEqual(actual, expected, description);
    test.done();
}

function compareFilesJSON(test, filename, description) {
    var actual = grunt.file.readJSON('test/fixtures/_' + filename);
    var expected = grunt.file.readJSON('test/expected/' + filename);
    test.deepEqual(actual, expected, description);
    test.done();
}

exports.release = {
    bump: function (test) {
        compareFilesJSON(test, 'component.json', 'should set version 0.0.13');
    },
    bumpMultiple: function (test) {
        compareFilesJSON(test, 'bower.json', 'bower.json should also have version 0.0.13');
    },
    bumpChangelog: function (test) {
        compareFiles(test, 'CHANGELOG.md', 'CHANGELOG.md should be updated');
    },
    bumpAbsolute: function (test) {
        compareFilesJSON(test, 'bower-absolute.json', 'should set absolute version');
    },
    bumpPatch: function (test) {
        compareFilesJSON(test, 'component-patch.json', 'should bump patch version');
    },
    bumpMinor: function (test) {
        compareFilesJSON(test, 'component-minor.json', 'should bump minor version');
    },
    bumpMajor: function (test) {
        compareFilesJSON(test, 'component-major.json', 'should bump major version');
    },
    preserveFlags: function (test) {
        var beforeTask = grunt.file.readJSON('test/fixtures/_dummyBefore.json');

        test.equal(beforeTask.timesCalled, 2);
        test.equal(beforeTask.flags.length, 1);
        test.equal(beforeTask.flags[0], '--flag=test');
        test.done();
    }
};
