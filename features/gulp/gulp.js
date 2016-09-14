'use strict';

var gulp = require('gulp'),
    path = require('path'),
    extend = require('extend'),
    allonsy = require(path.resolve(__dirname, '../../../allons-y/features/allons-y/allons-y.js'));

gulp.defaultTasksCount = 1 + (process.env.GULP_WATCHER && process.env.GULP_WATCHER == 'true' ? 1 : 0);

require(path.resolve(__dirname, 'gulp-output.js'))(allonsy, gulp);
require(path.resolve(__dirname, 'gulp-dist.js'))(allonsy, gulp);

process.env.GULP_START = 'true';

DependencyInjection.service('$gulp', function() {
  return gulp;
});

allonsy.bootstrap({
  owner: 'gulp'
}, function() {

  gulp.cleanDists();

  var gulpFiles = allonsy.findInFeaturesSync('*-gulpfile.js'),
      defaultTasks = [],
      watchs = [],
      afters = [],
      lessPaths = [],
      lessPlugins = [];

  gulpFiles.forEach(function(gulpFile) {
    var gulpModule = require(path.resolve(gulpFile)),
        tasks = DependencyInjection.injector.controller.invoke(null, gulpModule, {
          controller: {
            $default: function() {
              return extend(true, [], defaultTasks);
            },

            $lessPaths: function() {
              return lessPaths;
            },

            $lessPlugins: function() {
              return lessPlugins;
            }
          }
        });

    if (!tasks) {
      return;
    }

    if (typeof tasks == 'string') {
      tasks = [tasks];
    }
    else if (typeof tasks == 'object' && !Array.isArray(tasks)) {
      tasks.tasks = typeof tasks.tasks == 'string' ? [tasks.tasks] : tasks.tasks;

      if (tasks.after) {
        afters.push(tasks.after);
      }

      if (tasks.lessPaths) {
        lessPaths = lessPaths.concat(tasks.lessPaths);
      }

      if (tasks.lessPlugins) {
        lessPlugins = lessPlugins.concat(tasks.lessPlugins);
      }

      if (tasks.watch && tasks.tasks && tasks.tasks.length) {
        var watch = (typeof tasks.watch == 'string' ? [tasks.watch] : tasks.watch) || [],
            gulpTasks = tasks.tasks;

        watchs.push(function() {
          gulp.watch(watch, gulpTasks);
        });
      }

      tasks = tasks.tasks || null;
    }

    if (tasks && tasks.length) {
      defaultTasks = defaultTasks.concat(tasks);
    }
  });

  gulp.defaultTasksCount += defaultTasks.length;

  if (process.env.GULP_START == 'true') {
    if (process.env.GULP_WATCHER && process.env.GULP_WATCHER == 'true' && watchs.length) {
      gulp.task('watch', function() {
        watchs.forEach(function(watchFunc) {
          watchFunc();
        });
      });

      defaultTasks.push('watch');
    }

    gulp.task('default', defaultTasks);
  }

  if (afters.length) {
    afters.forEach(function(after) {
      DependencyInjection.injector.controller.invoke(null, after, {
        controller: {
          $watchs: function() {
            return watchs;
          },

          $lessPaths: function() {
            return lessPaths;
          },

          $lessPlugins: function() {
            return lessPlugins;
          },

          $default: function() {
            return extend(true, [], defaultTasks);
          }
        }
      });
    });
  }
});
