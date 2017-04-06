'use strict';

var run = require('./cmd').run;

module.exports = {
    add: _add,
    commit: _commit,
    tag: _tag,
    push: _push,
    pushTag: _pushTag
};

function _tag(grunt, options) {
    var tagName = _getTagName(grunt, options);
    var tagMessage = _getTagMessage(grunt, options);
    return run('git', ['tag', tagName, '-m', '"' + tagMessage + '"']);
}

function _add() {
    return run('git', ['add', '.']);
}

function _commit(grunt, options) {
    var commitMessage = _getCommitMessage(grunt, options);
    return run('git', ['commit', '-m', '"' + commitMessage + '"']);
}

function _push(options) {
    return run('git', ['push', options.remote, 'HEAD']);
}

function _pushTag(grunt, options) {
    var tagName = _getTagName(grunt, options);
    return run('git', ['push', options.remote, tagName]);
}

function _getCommitMessage(grunt, options) {
    return grunt.template.process(options.commitMessage);
}

function _getTagMessage(grunt, options) {
    return grunt.template.process(options.tagMessage);
}

function _getTagName(grunt, options) {
    return grunt.template.process(options.tagName);
}