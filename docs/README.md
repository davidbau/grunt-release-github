# Documentation

> NOTE: This NPM module is designe to use with [github flow](https://guides.github.com/introduction/flow/) and github milestones. 

## Brief introduction

Basically, when we prepare a new version, we have to think about what feature we will 
implement and what bug or problem we will fix in this new version. As [github flow](https://guides.github.com/introduction/flow/) says each feature or bug will be a new issue for this project. We will use the milestones for scheduling this new issues, grouping it into a different milestone, depending on the version where the feature will be released. Having said that, we will have a milestone for each version.

#### Example

In this repository, you can see an example of this simple approach for managing your project in an agile way. This example is also used for testing this grunt tool. 

We have to release a new version `0.0.0`, for this reason, and following the approach that is described above, we have to create the milestone named `v0.0.0`.

> IMPORTANT! the name of the milestone is very important. It has to be made as follows: `vX.X.X` where `v` is always present and `X.X.X` is the version number. This tool will use the name of the milestone for building files, making tags and other things.

![milestone-v000](/docs/images/milestone-v000.png)

After, we will create the issues with features or bug which we will include into this milestone and we will work as [github flow](https://guides.github.com/introduction/flow/). finally, finishing our work, we will be ready to use `grunt-release-github`. 

#### Releasing

What will `grunt-release-github` do in my repository?

Releasing a new version of your project looks something like this:

1. bump the version in your `package.json` file.
2. stage the package.json file's change.
3. update `CHANGELOG.md` with the release info.
4. stage the changes of files.
5. commit that changes with a message like "release 0.6.22".
6. create a new git tag for the release.
7. push the changes out to GitHub.
8. also push the new tag out to GitHub.
9. create a .zip release on GitHub.
10. create a GitHub release on GitHub with the information of the release.
11. publish the new version to npm.

Cool, right? `grunt-release-github` will automate all that:

```shell
grunt release
```

## Setup
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm i grunt-release-github --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-release-github');
```

## Configure
The following are all the release steps, you can disable any you need to:

```js
  release: {
    options: {
      bump: true, //default: true
      changelog: true, //default: false
      changelogText: '<%= version %>\n', //default: '### <%= version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n'
      changelogFromGithub: true, //default false
      file: 'package.json', //default: package.json
      add: true, //default: true
      commit: true, //default: true
      tag: true, //default: true
      push: true, //default: true
      pushTags: true, //default: true
      npm: false, //default: false
      npmtag: true, //default: no tag
      githubReleaseBody: 'See [CHANGELOG.md](./CHANGELOG.md) for details.' //default:  'version <%= version %>'
      tagName: '<%= version %>', //default: '<%= version %>'
      commitMessage: 'release <%= pkg.version %>', //default: 'release <%= version %>'
      tagMessage: 'version <%= pkg.version %>', //default: 'version <%= pkg.version %>'
      beforeBump: [], // optional grunt tasks to run before file versions are bumped
      afterBump: [], // optional grunt tasks to run after file versions are bumped
      beforeRelease: [], // optional grunt tasks to run after release version is bumped up but before release is packaged
      afterRelease: [], // optional grunt tasks to run after release is packaged
      updateVars: [], // optional grunt config objects to update (this will update/set the version property on the object specified)
      github: {
        repo: 'dani8art/grunt-release-github', //put your user/repo here
        accessTokenVar: 'GITHUB_ACCESS_TOKEN', //ENVIRONMENT VARIABLE that contains GitHub Access Token
        usernameVar: 'GITHUB_USERNAME', //ENVIRONMENT VARIABLE that contains GitHub username
      }
    }
  }
```

#### Descriptions

- **bump**, `true` if you want to bump the version number in any file. 
- **changelog**, `true` if you want to update the changelog in the release process.
- **changelogText**, text for adding to the changelog. This option will be suppressed by the list of issues from a milestone if the `changelogFromGithub` option is `true`.
- **changelogFromGithub**, `true` if you want to get the changelog from a GitHub milestone.
- **file**, the file where the version number will be bumped.
- **add**, `true` if you want to stage the changes of the files that were updated.
- **commit**, `true` if you want to commint the changes that were updated.
- **tag**, `true` if you want to create a tag.
- **push**, `true` if you want to push all changes to the origin repository.
- **pushTags**, `true` if you want to push the tags to the origin repository.
- **npm**, `true` if you want to publish the module to NPM repository. Note that if you want to do that, you must be loged with `npm cli`.
- **githubReleaseBody**, this text will be added to the bottom of the release text.
- **tagName**, the name for the tag.
- **commitMessage**, the message of the commit.
- **tagMessage**, the message of the tag, only if **changelogFromGithub** is `false`
- **beforeBump, afterBump, beforeRelease, afterRelease**, task will be executed beetwen release steps. 
- **updateVars**, variables of `gruntConfig` where the version number will be bumped.
- **github** GitHub information for releasing.


## Using grunt-release-github

**Patch Release:**
```shell
grunt release
```
or
```shell
grunt release:patch
```

**Minor Release:**
```shell
grunt release:minor
```

**Major Release:**
```shell
grunt release:major
```

**Specific Version Release:**
```shell
grunt release:1.2.3
```

**Bump multiple files at once**

Sometimes you may need to bump multiple files while releasing.

```js
  release: {
    options: {
      additionalFiles: ['bower.json']
    }
  }
```

You can also provide multiple files in this array.

The version to bump is set in the master file defined with option 'file' (default : package.json).
This version will be propagated to every additionalFiles.