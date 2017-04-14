'use strict';

var githubServiceModule = require('../../../tasks/lib/services/github-service.js'),
    grunt = require('grunt'),
    utils = require('../../utils/testsutils.js');

var compareJSON = utils.compareJSON;

var credentialsMock = {
    repo: 'dani8art/grunt-release-github',
    usernameVar: 'GITHUB_USERNAME',
    accessTokenVar: 'GITHUB_ACCESS_TOKEN'
};

exports.githubService = {
    getMilestones: function (test) {
        githubServiceModule.getMilestoneByVersion(credentialsMock, credentialsMock.repo, '0.0.0').then(function (milestones) {
            grunt.file.write('test/expected/' + "getMilestoneByVersion.json", JSON.stringify(milestones, null, 2));
            compareJSON(test, milestones, "getMilestoneByVersion.json", "should be equal.");
        }, function (error) {
            test.expect(false);
            test.done(error);
        });
    },
    getIssuesByMilestone: function (test) {
        githubServiceModule.getIssuesByMilestone(credentialsMock, credentialsMock.repo, 2).then(function (issues) {
            grunt.file.write('test/expected/' + "getIssuesByMilestone.json", JSON.stringify(issues, null, 2));
            compareJSON(test, issues, "getIssuesByMilestone.json", "should be equal.");
        }, function (error) {
            test.expect(false);
            test.done(error);
        });
    }
};
