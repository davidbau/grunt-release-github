'use strict';

var request = require('request'),
    promise = require('bluebird'),
    logger = require('winston');

logger.transports.Console.timestamp = true;
logger.level = 'info';

module.exports.updateChangelog = function (user, repository, version, callback) {

    var milestonesUrl = "https://api.github.com/repos/" + user + "/" + repository + "/milestones";
    logger.debug('getting milestones from url: \n' + milestonesUrl);


    logger.debug('sending request.');
    request.get(milestonesUrl, {
        'auth': {
            'user': user,
            'pass': process.env["GITHUB_ACCESS_TOKEN"],
            'sendImmediately': false
        },
        headers: {
            'User-Agent': 'request'
        },
        json: true
    }, (err, res, body) => {
        logger.debug('receiving request.');
        if (!err && res.statusCode === 200) {
            //logger.debug(body); // Show the HTML for the Google homepage.
            logger.debug('200 OK.');
            var milestones = body;
            logger.debug('getting issues.');
            promise.each(milestones, (milestone) => {
                return new promise((resolve, reject) => {
                    //do request for issues
                    var issuesUrl = "https://api.github.com/repos/" + user + "/" + repository + "/issues?state=all&milestone=" + milestone.number;
                    logger.debug('getting issues from url: \n' + issuesUrl);
                    logger.debug('sending request.');
                    request.get(issuesUrl, {
                        'auth': {
                            'user': user,
                            'pass': process.env["GITHUB_ACCESS_TOKEN"],
                            'sendImmediately': false
                        },
                        headers: {
                            'User-Agent': 'request'
                        },
                        json: true
                    }, (err, res, body) => {
                        logger.debug('receiving request.');
                        if (!err && res.statusCode === 200) {
                            logger.debug('200 OK.');
                            // logger.debug("ISSUES");
                            // logger.debug(body);
                            milestone.issues = body;
                            resolve();
                        } else {
                            logger.debug('issues request error.');
                            if (err) {
                                reject(err.toString());
                            } else {
                                reject(res.statusCode);
                            }
                        }
                    });
                });

                // .then((success) => {
                //     //one milestone success
                // }, (error) => {
                //     //one milestone error
                // })
            }).then((success) => {
                //all milestones success
                logger.debug('All milestones has been requested successfully.');
                logger.debug('Filtering by current milestone. ' + version);
                var currentMilestone = milestones.filter((element) => {
                    return element.title === version;
                });

                //logger.debug(currentMilestone[0].issues);

                if (!currentMilestone || currentMilestone.length === 0) {
                    logger.debug('Not found milestone in github with title: ' + version);
                    callback(null);
                } else {
                    logger.debug('Building milestone string');
                    var milestone = currentMilestone[0];
                    var now = new Date();
                    var stringChangelog = "### " + milestone.title + ' - ' + now.getUTCFullYear() + '-' + now.getUTCMonth() + 1 + '-' + now.getUTCDate() + '\n\n';

                    milestone.issues.forEach((element) => {
                        stringChangelog += '- [#' + element.number + '](' + element.html_url + ') - ' + element.title + '\n\n';
                    });
                    //logger.debug(stringChangelog);
                    logger.debug(stringChangelog);
                    logger.debug('Resolving promise');
                    callback(stringChangelog);
                }
            }, (error) => {
                //global errors
                logger.debug('Some error has ocurred ' + error.toString());
                callback(error);
            });
        } else {
            logger.debug("milestones request has been failed.");
            logger.debug(res.statusCode);
            callback();
        };
    });
};
