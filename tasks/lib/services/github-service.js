'use strict';

//Global vars
const githubBaseUri = "https://api.github.com/";

//Dependencies modules
var logger = require('../logger/logger.js'),
    Promise = require('bluebird'),
    request = require('request');

//module interface
module.exports = {
    getMilestones: _getMilestones,
    getMilestoneByVersion: _getMilestoneByVersion,
    getIssuesByMilestone: _getIssuesByMilestone,
    createRelease: _createRelease
};

function _createRelease(options, grunt, type) {

    return new Promise(function (resolve, reject) {
        var tagName = grunt.template.process(options.tagName);
        var username = process.env[options.github.usernameVar];
        var password = process.env[options.github.accessTokenVar];

        var data = {
            'tag_name': tagName,
            name: grunt.template.process(options.tagMessage),
            body: options.changelogContent + '\n' + options.githubReleaseBody,
            prerelease: type === 'prerelease'
        };
        console.log(data);
        try {
            request.post((options.github.apiRoot || 'https://api.github.com') + '/repos/' + options.github.repo + '/releases', {
                auth: {
                    username: username,
                    pass: password
                },
                headers: {
                    'Content-Type': 'application/vnd.github.v3+json',
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'grunt-release-github'
                },
                json: true,
                body: data
            }, function (err, res) {
                console.log(err); console.log(res);
                if (!err) {
                    if (res && res.statusCode === 201) {
                        grunt.log.ok('created ' + tagName + ' release on GitHub.');
                        resolve();
                    } else {
                        reject('Error creating GitHub release. Response: ' + res.statusCode);
                    }
                } else {
                    reject('Error creating GitHub release. Response: ' + res.text);
                }
            });
        } catch (e) {
            reject(e.toString());
        }

    });
}

function _getMilestoneByVersion(github, repository, version) {
    return new Promise(function (resolve, reject) {
        _getMilestones(github, repository).then(function (milestones) {
            var milestone = milestones.filter(function (element) {
                return element.title === 'v' + version;
            });
            milestone = milestone[0];
            if (milestone) {
                resolve(milestone);
            } else {
                reject('There is not milestone for this version');
            }
        }, function (error) {
            reject(error);
        });
    });
}

//module implementation
function _getMilestones(github, repository) {
    return new Promise(function (resolve, reject) {

        var milestonesUrl = githubBaseUri + "repos/" + repository + "/milestones";
        logger.debug('Getting milestones from url: \n' + milestonesUrl);

        request.get(milestonesUrl, requestOptionsHelper(github), function (err, res, body) {

            logger.debug('Receiving request.');
            if (!err && res.statusCode === 200) {
                logger.debug('Request has been done successfully. Body: \n' + JSON.stringify(body, null, 2));
                resolve(body);
            } else {
                rejectHelper(err, res, reject);
            }

        });

    });
}

function _getIssuesByMilestone(github, repository, milestoneNumbre) {
    return new Promise(function (resolve, reject) {
        var issuesUrl = githubBaseUri + "repos/" + repository + "/issues?state=all&milestone=" + milestoneNumbre;
        logger.debug('Getting issues from url: \n' + issuesUrl);

        request.get(issuesUrl, requestOptionsHelper(github), function (err, res, body) {

            logger.debug('Receiving request.');
            if (!err && res.statusCode === 200) {

                logger.debug('Request has been done successfully. Body: \n' + JSON.stringify(body, null, 2));
                resolve(body);

            } else {
                rejectHelper(err, res, reject);
            }
        });
    });
}

function requestOptionsHelper(github) {
    return {
        auth: {
            username: process.env[github.usernameVar],
            pass: process.env[github.accessTokenVar]
        },
        headers: {
            'User-Agent': 'grunt-release-github'
        },
        json: true
    };
}

function rejectHelper(err, res, reject) {
    if (err) {
        logger.error("Error here: " + err.toString());
        reject(err.toString());
    } else {
        if (res.statusCode === 403) {
            logger.error('Your github rate_limit has been reached.');
            reject('Your github rate_limit has been reached.');
        } else if (res.statusCode === 404) {
            logger.error('Not found issues for this milestones.');
            reject('Not found issues for this milestones.');
        } else {
            logger.error('Unexpected error.');
            reject('Unexpected error.');
        }
    }
}
