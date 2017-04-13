'use strict';
var Promise = require('bluebird');
var run = require('./cmd').run;

module.exports = {
    runTask: _runTask,
    runTasks: _runTasks
};

function _runTask(grunt, task) {
    var args = grunt.option.flags();
    if (args.length) {
        grunt.log.ok('-> current flags: ' + args);
    }

    if (typeof task === 'string') {
        return run('grunt', [task].concat(args));
    } else {
        grunt.fail.warn('Fail while ' + task + ' was executing.');
    }
}

function _runTasks(grunt, tasks) {

    return Promise.each(tasks, function (task) {
        return _runTask(grunt, task);
    });

}