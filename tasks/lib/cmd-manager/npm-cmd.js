/*!
grunt-release-github 2.0.0, built on: 2017-08-01
Copyright (C) 2017 Daniel Arteaga
http://darteaga.com
https://github.com/dani8art/grunt-release-github*/


'use strict';

var CMD = require('./cmd');

var run = CMD.run;

module.exports = {
    publish: _publish,
    unpublish: _unpublish
};

function _unpublish(packageName, version) {
    var opt = ['unpublish', packageName + '@' + version];
    return run('npm', opt);
}

function _publish(options, newVersion) {
    var opt = ['publish'];
    var msg = 'published version ' + newVersion + ' to npm';

    if (options.npmtag) {
        opt = opt.concat(['--tag', newVersion]);

        msg += ' with a tag of "' + newVersion + '"';
    }

    return run('npm', opt);
}
