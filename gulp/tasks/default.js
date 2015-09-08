var gulp = require('gulp');

gulp.task('default', function() {
    gulp.start('scss', 'browserify', 'watch');
});
