var gulp = require('gulp'),
livereload = require('gulp-livereload');
var exec = require('child_process').exec;

gulp.task('default', function() {
  livereload.listen();
  gulp.watch('PITCHME.md', function() {


    exec('git add .; git commit -am "autocommit"; git push', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      setTimeout(function() {
        livereload.reload();
        console.log('live-reload',null);
        exec('afplay /System/Library/Sounds/Pop.aiff -v 0.3');
      }, 1000);

    });

  });
});
