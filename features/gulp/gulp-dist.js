'use strict';

module.exports = function(allonsy, gulp) {
  var path = require('path'),
      async = require('async'),
      through = require('through2'),
      fs = require('fs-extra'),
      _distPaths = [],
      _distObject = {},
      _distExcludePaths = [],
      _distExcludeObject = {};

  gulp.addDist = function(paths, namespaces, cleanOnStart) {
    paths = typeof paths == 'string' ? [paths] : paths;
    namespaces = typeof namespaces == 'string' ? [namespaces] : namespaces;

    paths.forEach(function(distPath) {
      distPath = path.resolve(distPath);

      _distObject[distPath] = cleanOnStart || false;
    });

    _distPaths = Object.keys(_distObject);
  };

  gulp.cleanDists = function() {
    if (!process.env.GULP_CLEAN_DEST || process.env.GULP_CLEAN_DEST == 'false') {
      return;
    }

    _distPaths.forEach(function(distPath) {
      if (!_distObject[distPath]) {
        return;
      }

      fs.removeSync(distPath);
    });
  };

  gulp.excludeDist = function(paths) {
    if (typeof paths != 'undefined') {
      paths = typeof paths == 'string' ? [paths] : paths;

      paths.forEach(function(p) {
        p = path.resolve(p);

        _distExcludeObject[p] = true;
      });

      _distExcludePaths = Object.keys(_distExcludeObject);
    }

    return _distExcludePaths;
  };

  gulp.dist = function(subPath, options) {
    options = options || {};

    subPath = subPath && subPath.indexOf('/') !== 0 ? path.sep + subPath : subPath || '';

    var files = [],
        dests = _distPaths.map(function(distPath) {
          return gulp.dest(distPath + subPath, options);
        });

    return through.obj(function(file, encoding, done) {
      files.push(file);

      done();
    }, function(done) {
      var transform = this;

      async.each(files, function(file, nextFile) {

        async.each(dests, function(dest, nextDest) {
          dest.write(file, nextDest);
        }, nextFile);

      }, function() {
        files.forEach(function(file) {
          transform.push(file);
        });

        done();

        transform.emit('end');
      });
    });
  };

  var distFiles = allonsy.findInFeaturesSync('*-gulp-dist.json');

  distFiles.forEach(function(file) {
    var distConfig = require(path.resolve(file));

    if (distConfig.excludes && distConfig.excludes.length) {
      gulp.excludeDist(distConfig.excludes);
    }
  });
};
