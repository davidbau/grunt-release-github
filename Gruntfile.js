/*!
grunt-release-github 1.0.4, built on: 2017-08-01
Copyright (C) 2017 Daniel Arteaga
http://darteaga.com
https://github.com/dani8art/grunt-release-github*/


'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        licenseNotice: grunt.file.read('extra/license-notice', {
            encoding: 'utf8'
        }).toString(),
        latestReleaseNotes: grunt.file.read('extra/latest-release-notes', {
            encoding: 'utf8'
        }).toString(),
        usebanner: {
            license: {
                options: {
                    position: 'top',
                    banner: '/*!\n<%= licenseNotice %>*/\n',
                    replace: true
                },
                files: {
                    src: ['tasks/**/*.js', 'test/**/*.js', 'Gruntfile.js'] //If you want to inspect more file, you change this.
                }
            },
            readme: {
                options: {
                    position: 'bottom',
                    banner: '## Copyright notice\n\n<%= latestReleaseNotes %>',
                    replace: /##\sCopyright\snotice(\s||.)+/g,
                    linebreak: false
                },
                files: {
                    src: ['README.md']
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js',
                '<%= nodeunit.test %>',
                '<%= nodeunit.cmd_test %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        clean: {
            test: 'test/fixtures/_*.{json,md}'
        },
        nodeunit: {
            test: ['test/milestone.test.js', 'test/release.test.js', 'test/lib/services/**/*.test.js'],
            cmd_test: ['test/lib/cmd/**/*.test.js']
        },
        release: {
            options: {
                packageObject: 'pkg',
                changelog: true,
                changelogFromGithub: true,
                githubReleaseBody: 'See [CHANGELOG.md](./CHANGELOG.md) for details.',
                npmtag: false,
                github: {
                    repo: 'dani8art/grunt-release-github',
                    usernameVar: 'GITHUB_USERNAME',
                    accessTokenVar: 'GITHUB_ACCESS_TOKEN'
                }
            }
        },
        releaseTest: {
            options: {
                bump: true,
                add: false,
                commit: false,
                tag: false,
                push: false,
                pushTags: false,
                npm: false,
                npmtag: false,
                github: false
            },
            general: {
                options: {
                    file: 'test/fixtures/_component.json',
                    changelog: 'test/fixtures/_CHANGELOG.md',
                    additionalFiles: ['test/fixtures/_bower.json'],
                    changelogText: grunt.template.process('### <%= version %>\n', {
                        data: {
                            'version': '0.0.13'
                        }
                    }),
                    commitMessage: grunt.template.process('v<%= version %>', {
                        data: {
                            'version': '0.0.13'
                        }
                    }),
                    beforeRelease: ['dummyBefore', {
                        name: 'dummyBefore',
                        preserveFlags: true
                    }]
                }
            },
            absolute: {
                args: ['1.2.3'],
                options: {
                    file: 'test/fixtures/_bower-absolute.json'
                }
            },
            patch: {
                args: ['patch'],
                options: {
                    file: 'test/fixtures/_component-patch.json'
                }
            },
            minor: {
                args: ['minor'],
                options: {
                    file: 'test/fixtures/_component-minor.json'
                }
            },
            major: {
                args: ['major'],
                options: {
                    file: 'test/fixtures/_component-major.json'
                }
            }
        },
        setup: {
            test: {
                files: [{
                    from: 'test/fixtures/component.json',
                    dest: 'test/fixtures/_component.json'
                }, {
                    from: 'test/fixtures/bower.json',
                    dest: 'test/fixtures/_bower.json'
                }, {
                    from: 'test/fixtures/CHANGELOG.md',
                    dest: 'test/fixtures/_CHANGELOG.md'
                }, {
                    from: 'test/fixtures/CHANGELOG.md',
                    dest: 'test/fixtures/_CHANGELOG_GITHUB.md'
                }, {
                    from: 'test/fixtures/bower.json',
                    dest: 'test/fixtures/_bower-absolute.json'
                }, {
                    from: 'test/fixtures/component.json',
                    dest: 'test/fixtures/_component-patch.json'
                }, {
                    from: 'test/fixtures/component.json',
                    dest: 'test/fixtures/_component-minor.json'
                }, {
                    from: 'test/fixtures/component.json',
                    dest: 'test/fixtures/_component-major.json'
                }]
            }
        }
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-banner');

    grunt.registerTask('buildOn', function () {
        grunt.config('pkg.buildOn', grunt.template.today("yyyy-mm-dd"));
        grunt.file.write('package.json', JSON.stringify(grunt.config('pkg'), null, 2));
    });
    
    grunt.registerTask('test', [
        'jshint',
        'clean',
        'setup',
        'releaseTest',
        'nodeunit:test',
        'clean'
    ]);

    grunt.registerTask('dummyBefore', function () {
        var flags = grunt.option.flags().join(' ');
        var filePath = 'test/fixtures/_dummyBefore.json';
        var contents = grunt.file.exists(filePath) ? grunt.file.readJSON(filePath) : {
            timesCalled: 0,
            flags: []
        };
        var updatedObject = {
            timesCalled: contents.timesCalled + 1,
            flags: flags.length ? contents.flags.concat(flags) : contents.flags
        };

        grunt.file.write(filePath, JSON.stringify(updatedObject));
    });

    grunt.registerMultiTask('setup', 'Setup test fixtures', function () {
        this.files.forEach(function (f) {
            grunt.file.copy(f.from, f.dest);
        });
    });

    grunt.registerTask('hello', 'Hello world!', function () {
        grunt.log.ok('Hello world!');
    });

    grunt.registerMultiTask('releaseTest', function () {
        var args = (this.data.args || []).join(':');

        grunt.option.init({
            flag: 'test'
        });
        grunt.config.set('release', {});
        grunt.config.merge({
            release: grunt.config.data[this.name]
        });

        grunt.config.merge({
            release: grunt.config.data[this.name][this.target]
        });

        grunt.task.run('release' + (args && ':' + args));
    });
};
