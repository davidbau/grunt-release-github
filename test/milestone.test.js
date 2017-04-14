'use strict';

var grunt = require('grunt');
var milestone = require('../tasks/lib/services/github-milestone.js');

var options = {
    github: {
        repo: 'dani8art/grunt-release-github',
        usernameVar: 'GITHUB_USERNAME',
        accessTokenVar: 'GITHUB_ACCESS_TOKEN'
    }
};

var expectedText = '### v0.0.0 - {{now}}\n\n- [#10](https://github.com/dani8art/grunt-release-github/issues/10) - Issue for testing module 03\n\n- [#9](https://github.com/dani8art/grunt-release-github/issues/9) - Issue for testing module 02\n\n- [#8](https://github.com/dani8art/grunt-release-github/issues/8) - Issue for testing module 01\n\n* Test Entry\r\n';

exports.milestone = {
    getMilestoneText: function (test) {
        milestone.getMilestoneText(options, '0.0.0').then(function (changelogText) {
            var current = grunt.file.read('test/fixtures/_CHANGELOG_GITHUB.md');
            changelogText += current;
            grunt.file.write('test/fixtures/_CHANGELOG_GITHUB.md', changelogText);

            var filename = 'CHANGELOG_GITHUB.md';
            var description = 'should append github milestone issues';
            var now = new Date();
            var year = now.getUTCFullYear();
            var month = parseInt(now.getUTCMonth()) + 1;
            var day = now.getUTCDate();
            var date = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);

            var actual = grunt.file.read('test/fixtures/_' + filename);
            var expected = expectedText;

            test.strictEqual(actual, expected.replace("{{now}}", date), description);
            test.done();
        }, test.done);
    }
};
