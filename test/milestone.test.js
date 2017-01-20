'use strict';

var grunt = require('grunt');
var milestone = require('../tasks/github-milestone.js');

function compareFiles(test, filename, description) {
    var actual = grunt.file.read('test/fixtures/_' + filename);
    var expected = grunt.file.read('test/expected/' + filename);
    test.equal(actual, expected, description);
    test.done();
}

exports.release = {
    updateChangelog: function (test) {
        var credentials = grunt.file.readJSON('test/fixtures/credentials.json');

        milestone.updateChangelog(credentials.user, credentials.repository, credentials.version, function (changelogText) {
            var actual = grunt.file.read('test/fixtures/_CHANGELOG_GITHUB.md');
            changelogText += actual;
            grunt.file.write('test/fixtures/_CHANGELOG_GITHUB.md', changelogText);

            compareFiles(test, 'CHANGELOG_GITHUB.md', 'should append github milestone issues');
        });
    }
};
