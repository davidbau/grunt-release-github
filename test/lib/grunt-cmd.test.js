'use strict';

var GruntManager = require('../../tasks/lib/cmd-manager/grunt-cmd');
var grunt = require('grunt');
var gruntcmd;

exports.grunt_cmd = {

    setUpGrunt: function (test) {
        gruntcmd = new GruntManager(grunt);

        test.done();
    },

    run_a_task: function (test) {
        gruntcmd.runTask('hello').then(test.done, test.done);
    },

    run_several_tasks: function (test) {
        gruntcmd.runTasks(['hello', 'hello']).then(function () {
            test.done();
        }, function (err) {
            console.log(err);
            test.done(1);
        });
    }
};