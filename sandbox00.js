'use strict';

var GruntManager = require('./tasks/lib/cmd-manager/grunt-cmd');
var grunt = require('grunt');
var gruntcmd = new GruntManager(grunt);

console.log('INIT');
gruntcmd.runTasks(['hello', 'hello']).then(() => {
    console.log('END');
}, () => {
    console.log('ERROR END');
});