'use strict';

var Promise = require('bluebird');

module.exports = {
    bump: _bump
};


function _bump(grunt, options, newVersion) {

    var pkg, promises = [], configProp, fullProp;

    options.updateVars.forEach(function (varElement) {
        configProp = grunt.config(varElement);
        if (typeof configProp === 'object') {
            fullProp = varElement + '.version';
            grunt.config(fullProp, newVersion);
        } else if (typeof configProp === 'string') {
            fullProp = configProp;
            grunt.config(fullProp, newVersion);
        }
        grunt.log.ok('bumped version of ' + fullProp + ' to ' + newVersion);
    });

    options.additionalFiles.forEach(function (fileElement) {
        promises.push(new Promise(function (resolve, reject) {
            try {
                pkg = grunt.file.readJSON(fileElement);
                pkg.version = newVersion;
                grunt.file.write(fileElement, JSON.stringify(pkg, null, 2) + '\n');
                grunt.log.ok('bumped version of ' + fileElement + ' to ' + newVersion);
                resolve();
            } catch (e) {
                reject(e);
            }
        }));
    });

    return Promise.all(promises);

}