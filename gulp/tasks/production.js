var gulp = require('gulp');

// Run this to build and compress all the things!
gulp.task('production',  function() {
  gulp.start(['images', 'fonts', 'minifyCss', 'uglifyJs']);
});
