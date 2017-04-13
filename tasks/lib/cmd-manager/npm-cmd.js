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
