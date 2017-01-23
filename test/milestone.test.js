'use strict';

var grunt = require('grunt');
var milestone = require('../tasks/github-milestone.js');

var credentialsMock = {
    repo: 'dani8art/grunt-release-github',
    usernameVar: 'GITHUB_USERNAME',
    accessTokenVar: 'GITHUB_ACCESS_TOKEN'
};

exports.milestone = {
    updateChangelog: function (test) {
        milestone.updateChangelog(credentialsMock, credentialsMock.repo, '0.0.0',
            function (changelogText) {
                var current = grunt.file.read('test/fixtures/_CHANGELOG_GITHUB.md');
                changelogText += current;
                grunt.file.write('test/fixtures/_CHANGELOG_GITHUB.md', changelogText);

                var filename = 'CHANGELOG_GITHUB.md';
                var description = 'should append github milestone issues';
                var now = new Date();
                var date = now.getUTCFullYear() + '-' + now.getUTCMonth() + 1 + '-' + now.getUTCDate();

                var actual = grunt.file.read('test/fixtures/_' + filename);
                var expected = grunt.file.read('test/expected/' + filename);

                test.strictEqual(actual, expected.replace("{{now}}", date), description);
                test.done();
            });
    }
};
