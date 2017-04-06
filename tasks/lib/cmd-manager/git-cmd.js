'use strict';

var run = require('./cmd').run;

module.exports = {
    add: _add,
    commit: _commit,
    tag: _tag,
    push: _push,
    pushTag: _pushTag
};

function _tag(options) {
    var tagName = options.tagName;
    var tagMessage = options.tagMessage;
    return run('git', ['tag', tagName, '-m', '"' + tagMessage + '"']);
}

function _add() {
    return run('git', ['add', '.']);
}

function _commit(options) {
    var commitMessage = options.commitMessage;
    return run('git', ['commit', '-m', commitMessage]);
}

function _push(options) {
    return run('git', ['push', options.remote, 'HEAD']);
}

function _pushTag(options) {
    var tagName = options.tagName;
    return run('git', ['push', options.remote, tagName]);
}