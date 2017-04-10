'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        clean: {
            test: 'test/fixtures/_*.{json,md}'
        },
        nodeunit: {
            tests: ['test/*.test.js', 'test/lib/**/*.test.js'],
            libTests: 'test/lib/**/*.test.js',
            gruntCmd: 'test/lib/grunt-cmd.test.js'
        },
        release: {
            options: {
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

    grunt.registerTask('test', [
        'jshint',
        'clean',
        'setup',
        'releaseTest',
        'nodeunit',
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
