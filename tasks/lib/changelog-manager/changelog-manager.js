'use strict';

var Promise = require('bluebird'),
    grunt = require('grunt'),
    milestone = require('../services/github-milestone'),
    logger = require('../logger/logger');

module.exports = {
    updateChangelog: _updateChangelog
};

function _updateChangelog(options, newVersion) {
    return new Promise(function (resolve, reject) {

        var filename = options.changelog;
        // Default filename
        if (options.changelog === true) {
            filename = 'CHANGELOG.md';
        }

        if (!options.changelogFromGithub) {

            var changelogText = options.changelogText;
            var changelogPreviousContent = grunt.file.read(filename);
            var changelogContent = changelogText + changelogPreviousContent;

            if (changelogPreviousContent.indexOf(changelogText) === -1) {
                grunt.file.write(filename, changelogContent);
            }

            options.changelogContent = changelogText;

            grunt.log.ok('UPDATE Changelog ' + filename);
            resolve();

        } else {

            milestone.getMilestoneText(options, newVersion).then(function (newLines) {
                if (newLines) {
                    try {
                        var changelogPreviousContent = grunt.file.read(filename);
                        var changelogContent = newLines + changelogPreviousContent;

                        options.changelogContent = newLines;

                        if (changelogPreviousContent.indexOf(newLines) === -1) {
                            grunt.file.write(filename, changelogContent);
                        }

                        grunt.log.ok('UPDATE Changelog ' + filename);
                        resolve();

                    } catch (e) {
                        reject(e);
                    }

                } else {
                    reject(new Error('Not found milestone in github with title: ' + newVersion));
                }
            }, reject);
        }

    });
}