/*!
grunt-release-github 2.0.0, built on: 2017-08-01
Copyright (C) 2017 Daniel Arteaga
http://darteaga.com
https://github.com/dani8art/grunt-release-github*/


'use strict';

var gruntcmd = require('../../tasks/lib/cmd-manager/grunt-cmd');
var grunt = require('grunt');

exports.grunt_cmd = {

    setUpGrunt: function (test) {
        test.done();
    },

    run_a_task: function (test) {
        gruntcmd.runTask(grunt, 'hello').then(test.done, test.done);
    },

    run_several_tasks: function (test) {
        gruntcmd.runTasks(grunt, ['hello', 'hello']).then(function () {
            test.strictEqual(1, 1);
            test.done();
        }, function () {
            test.done(1);
        });
    }
};