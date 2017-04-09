'use strict';

var run = require('./cmd').run;

module.exports = {
    add: _add,
    commit: _commit,
    tag: _tag,
    push: _push,
    pushTag: _pushTag,
    removeTagsRemote: _removeTagRemote,
    removeTagLocal: _removeTagLocal,
    resetAndPush: _resetAndPush,
    discardChanges: _discardChanges
};

function _discardChanges() {
    return run('git', ['checkout', '.']);
}

//git reset --hard HEAD~1
//git push origin HEAD --force
function _resetAndPush(grunt, options) {
    return run('git', ['reset', '--hard', 'HEAD~1']).then(function () {
        return run('git', ['push', options.remote, 'HEAD', '--force']);
    });
}

//git tag -d release01
function _removeTagLocal(grunt, options) {
    var tagName = _getTagName(grunt, options);
    return run('git', ['tag', '-d', tagName]);
}

function _removeTagRemote(grunt, options) {
    //  git push --delete origin tagname
    var tagName = _getTagName(grunt, options);
    return run('git', ['push', '--delete', options.remote, tagName]);
}

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