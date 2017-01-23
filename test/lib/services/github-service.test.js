'use strict';

var githubServiceModule = require('../../../tasks/lib/services/github-service.js'),
    utils = require('../../utils/testsutils.js');

var compareJSON = utils.compareJSON,
    loadCredentials = utils.loadCredentials;


exports.githubService = {
    getMilestones: function (test) {
        var credentials = loadCredentials();

        githubServiceModule.getMilestoneByVersion(credentials.user || process.env.USER,
            credentials.repository || process.env.REPOSITORY, '0.0.0').then(function (milestones) {
            compareJSON(test, milestones, "getMilestoneByVersion.json", "should be equal.");
        }, function (error) {
            test.expect(false);
            test.done(error);
        });
    },
    getIssuesByMilestone: function (test) {
        var credentials = loadCredentials();

        githubServiceModule.getIssuesByMilestone(credentials.user || process.env.USER,
            credentials.repository || process.env.REPOSITORY, 2).then(function (issues) {
            compareJSON(test, issues, "getIssuesByMilestone.json", "should be equal.");
        }, function (error) {
            test.expect(false);
            test.done(error);
        });
    }
};
