'use strict';

module.exports = function($glob, $gulp, $default) {

  var fs = require('fs-extra'),
      excludesPaterns = $gulp.excludeDist();

  $gulp.task('gulp-dist', $default, function(done) {

    excludesPaterns.forEach(function(excludesPatern) {
      $glob.sync(excludesPatern).forEach(function(file) {
        fs.removeSync(file);
      });
    });

    done();
  });

  return {
    tasks: 'gulp-dist',
    watch: excludesPaterns
  };
};
