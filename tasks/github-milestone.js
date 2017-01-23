'use strict';

var request = require('request'),
    promise = require('bluebird'),
    logger = require('winston');

var githubService = require('./lib/services/github-service.js');

module.exports.updateChangelog = function (user, repository, version, callback) {

    logger.debug('Updating changelog.');

    githubService.getMilestoneByVersion(user, repository, version).then(function (milestone) {
        githubService.getIssuesByMilestone(user, repository, milestone.number).then(function (issues) {
            milestone.issues = issues;

            var now = new Date();
            var stringChangelog = "### " + milestone.title + ' - ' + now.getUTCFullYear() + '-' + now.getUTCMonth() + 1 + '-' + now.getUTCDate() + '\n\n';

            milestone.issues.forEach(function (element) {
                stringChangelog += '- [#' + element.number + '](' + element.html_url + ') - ' + element.title + '\n\n';
            });
            //logger.debug(stringChangelog);
            logger.debug(stringChangelog);
            logger.debug('Resolving promise');
            callback(stringChangelog);

        }, function (error) {
            logger.debug('Some error has ocurred ' + error.toString());
            callback(error);
        });
    }, function (error) {
        logger.debug(error.toString());
        callback(error);
    });

};
