var gulp = require('gulp'),
  livereload = require('gulp-livereload');

gulp.task('default', function() {
  livereload.listen();
  gulp.watch('PITCHME.md', function() {
    livereload.reload();
    console.log('changed !')
  });
});