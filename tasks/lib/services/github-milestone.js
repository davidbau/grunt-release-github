/*!
grunt-release-github 2.0.0, built on: 2017-08-01
Copyright (C) 2017 Daniel Arteaga
http://darteaga.com
https://github.com/dani8art/grunt-release-github*/


'use strict';

var logger = require('winston'),
    Promise = require('bluebird');

var githubService = require('./github-service.js');

module.exports.getMilestoneText = function (options, version) {

    return new Promise(function (resolve, reject) {
        var github = options.github;
        var repository = github.repo;

        logger.debug('Updating changelog.');
        if (!github) {
            reject('Github configuration is required to get changelog from milestone');
        }

        githubService.getMilestoneByVersion(github, repository, version).then(function (milestone) {
            githubService.getIssuesByMilestone(github, repository, milestone.number).then(function (issues) {
                milestone.issues = issues;

                var now = new Date();
                var year = now.getUTCFullYear();
                var month = parseInt(now.getUTCMonth()) + 1;
                var day = now.getUTCDate();

                var stringChangelog = "### " + milestone.title + ' - ' + year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + '\n\n';

                milestone.issues.forEach(function (element) {
                    stringChangelog += '- [#' + element.number + '](' + element.html_url + ') - ' + element.title + '\n\n';
                });

                logger.debug(stringChangelog);
                logger.debug('Resolving promise');
                resolve(stringChangelog);

            }, function (error) {
                logger.debug('Some error has ocurred ' + error.toString());
                reject(error);
            });
        }, function (error) {
            logger.debug(error.toString());
            reject(error);
        });
    });

};
