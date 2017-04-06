/*
 * grunt-release
 * https://github.com/geddski/grunt-release
 *
 * Copyright (c) 2013 Dave Geddes
 * Licensed under the MIT license.
 */

'use strict';
var merge = require("set-options"),
    semver = require('semver');

var changelogManager = require('./lib/changelog-manager/changelog-manager'),
    gitCMD = require('./lib/cmd-manager/git-cmd'),
    gruntCMD = require('./lib/cmd-manager/grunt-cmd'),
    bumper = require('./lib/bumper/bumper'),
    githubService = require('./lib/services/github-service'),
    npmCMD = require('./lib/cmd-manager/npm-cmd');

module.exports = function (grunt) {
    grunt.registerTask('release', 'Bump version, git tag, git push, npm publish', function (type) {

        var done = this.async();

        //default options
        var defaultsOptions = {
            bump: true,
            changelog: false, // Update changelog file
            changelogFromGithub: false, //Get github issues
            // Text which is inserted into change log
            changelogText: '### <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n',

            // file is in charge of master information, ie, it is it which define the base version to work on
            file: grunt.config('pkgFile') || 'package.json',
            packageObject: 'pkg',

            // additionalFiles are additional files that also need to be bumped
            additionalFiles: [],
            // updateVars are grunt variables that also need to be bumped
            updateVars: [],
            add: true,

            commit: true,
            commitMessage: 'release <%= pkg.version %>',

            github: {
                apiRoot: 'https://api.github.com' // Default Github.com api
            },

            // Text which is inserted into release body
            githubReleaseBody: 'version <%= pkg.version %>',
            tag: true,
            tagName: '<%= pkg.version %>',
            tagMessage: 'version <%= pkg.version %>',

            push: true,
            pushTags: true,
            npm: false,
            remote: 'origin',
            beforeRelease: [],
            afterRelease: [],
            beforeBump: [],
            afterBump: []
        };

        //user-given options
        var userOptions = this.options() || {};

        var options = merge(userOptions, defaultsOptions);

        //if package if null fail;
        var pkg = grunt.config(options.packageObject);

        if (pkg == null) {
            grunt.fail.warn('pkg object NOT FOUND, please see "release.packageObject" option.');
        }

        //save pre version for rollback
        var preVersion = pkg.version;

        var newVersion;
        //update version.
        if (options.bump) {
            if (semver.valid(type)) {
                newVersion = type;
            } else {
                newVersion = semver.inc(preVersion, type || 'patch');
            }
        }
        options.additionalFiles.push(options.file);

        //update on pkg object;
        grunt.config(options.packageObject + ".version", newVersion);

        if (!newVersion) {
            grunt.fail.warn('Resulting version number is empty.');
        }

        var username = process.env[options.github.usernameVar];
        var password = process.env[options.github.passwordVar] || process.env[options.github.accessTokenVar];

        if (!options.github || (password && username)) {

            grunt.verbose.writeln("Run before bump tasks:");
            gruntCMD.runTasks(grunt, options.beforeBump).then(function () {
                if (options.bump) {
                    return bumper.bump(grunt, options, newVersion);
                }
            }).then(function () {
                return gruntCMD.runTasks(grunt, options.afterBump);
            }).then(function () {
                return gruntCMD.runTasks(grunt, options.beforeRelease);
            }).then(function () {
                if (options.changelog) {
                    return changelogManager.updateChangelog(options, newVersion);
                }
            }).then(function () {
                if (options.add) {
                    return gitCMD.add();
                }
            }).then(function () {
                if (options.commit) {
                    return gitCMD.commit(grunt, options);
                }
            }).then(function () {
                if (options.tag) {
                    return gitCMD.tag(grunt, options);
                }
            }).then(function () {
                if (options.push) {
                    return gitCMD.push(options);
                }
            }).then(function () {
                if (options.pushTags) {
                    return gitCMD.pushTag(grunt, options);
                }
            }).then(function () {
                if (options.npm) {
                    npmCMD.publish(options, newVersion);
                }
            }).then(function () {
                if (options.github) {
                    githubService.createRelease(options, grunt, type);
                }
            }).then(function () {
                return gruntCMD.runTasks(grunt, options.afterRelease);
            }).then(done).catch(function (err) {
                //rollback
                grunt.fail.warn(err.toString() || 'release failed');
            });

        } else {
            if (!username) {
                grunt.log.warn('Error: No username for GitHub release');
            } else if (!password) {
                grunt.log.warn('Error: No password for GitHub release');
            }
            grunt.fail.warn('Environment variable for github username is required. \n' +
                'Environment variable for github accesstoken is required.\n' +
                'See your environment vars and your Gruntfile for configuring.');
        }

    });

};
