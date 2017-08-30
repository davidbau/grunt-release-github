/*!
grunt-release-github 2.0.0, built on: 2017-08-01
Copyright (C) 2017 Daniel Arteaga
http://darteaga.com
https://github.com/dani8art/grunt-release-github*/


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
        return run('grunt', [task]);
    } else {
        return run('grunt', [task.name].concat(args));
        //grunt.fail.warn('Fail while ' + task + ' was executing.');
    }
}

function _runTasks(grunt, tasks) {

    return Promise.each(tasks, function (task) {
        return _runTask(grunt, task);
    });

}