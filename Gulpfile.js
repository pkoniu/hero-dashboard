"use strict";

let gulp = require('gulp');
let less = require('gulp-less');

let runSequence = require('run-sequence');

gulp.task('less', () => {
    return gulp.src('public/less/styles.less')
        .pipe(less())
        .on('error', function (err) {
            console.log('Error: ', err.message);
            this.emit('end');
        })
        .pipe(gulp.dest('public'));
});


gulp.task("watch:less", () => {
    gulp.watch('public/less/**/*.less', ['less']);
});