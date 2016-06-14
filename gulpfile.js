"use strict";

let gulp = require('gulp');

let concat = require('gulp-concat');


gulp.task('concat:js', () => {
    return gulp.src([
        'public/app/app.js',
        'public/app/**/*.js'
    ]).pipe(concat('app.concat.js'))
        .pipe(gulp.dest('public'));
});

gulp.task('watch:js', () => {
    return gulp.watch('public/app/**/*.js', ['concat:js']);
});