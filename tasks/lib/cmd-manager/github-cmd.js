'use strict';

var childProcess = require('child_process');
var Promise = require('bluebird');
var ErrorModel = require('../domain/error-model');

module.exports = function Github(grunt, templateData, options) {
    this.grunt = grunt;
    this.templateData = templateData;
    this.options = options;
    this.name = 'release';

    //getters and setters
    this.getTagName = _getTagName;
    this.getTagMassage = _getTagMessage;
    this.getCommitMessage = _getCommitMessage;

    //core functions
    this.gitAdd = _gitAdd;
    this.gitCommit = _gitCommit;
    this.gitTag = _gitTag;
    this.gitPush = _gitPush;
    this.gitPushTag = _gitPushTag;
    this.npmPublish = _npmPublish;

    //run function
    this.run = _run;
};

/**
 * Core functions
 */

function _gitTag() {
    var tagName = this.getTagName();
    var tagMessage = this.getTagMassage();

    //build tagName and tagMessage
    return this.run('git', ['tag', tagName, '-m', '"' + tagMessage + '"']);
}

function _gitAdd() {
    return this.run('git', ['add', '.']);
}

function _gitCommit() {
    var commitMessage = this.getCommitMessage;
    //build commitMessage
    return this.run('git', ['commit', '-m', commitMessage]);
}

function _gitPush() {
    return this.run('git', ['push', this.options.remote, 'HEAD']);
}

function _gitPushTag() {
    var tagName = this.getTagName();

    //build tagName
    return this.run('git', ['push', this.options.remote, tagName]);
}

function _npmPublish() {
    return this.run('npm', ['publish']);
}



/**
 * Auxiliar functions
 */

function _getCommitMessage() {
    var grunt = this.grunt;
    grunt.template.process(grunt.config.getRaw(this.name + '.options.commitMessage') || 'release <%= version %>', this.templateData);
}

function _getTagMessage() {
    var grunt = this.grunt;
    grunt.template.process(grunt.config.getRaw(this.name + '.options.tagMessage') || 'version <%= version %>', this.templateData);
}

function _getTagName() {
    var grunt = this.grunt;
    return grunt.template.process(grunt.config.getRaw(this.name + '.options.tagName') || '<%= version %>', this.templateData);
}

function _run(cmd, options) {
    var github = this;
    var grunt = github.grunt;

    grunt.verbose.writeln('Running: ' + cmd);

    return new Promise(function (resolve, reject) {
        var process = childProcess.spawn(cmd, options);

        // process.stdout.on('data', (data) => {
        //     logger.debug(data.toString());
        // });

        // process.stderr.on('data', (data) => {
        //     logger.debug(data.toString());
        // });

        process.on('exit', (code) => {
            if (!code) {
                grunt.log.ok(cmd + " has been executed successfully");
                resolve();
            } else {
                grunt.log.error('An error occured while ' + cmd + ' was executing.');
                reject(new ErrorModel(500, 'An error occured while cmd was executing.'));
            }
        });
    });
}