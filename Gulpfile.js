'use strict';

let gulp = require('gulp');
let sequence = require('run-sequence');

gulp.task('default', ['build-and-test'], () => {});

gulp.task('build-and-test', (cb) => {
    sequence('build', 'jshint', 'test', cb);
});

gulp.task('build', ['less']);

gulp.task('less', () => {
    let less = require('gulp-less');

    return gulp.src('public/less/styles.less')
        .pipe(less())
        .on('error', (err) => {
            console.log('Error: ', err.message);
            this.emit('end');
        })
        .pipe(gulp.dest('public'));
});

//todo: @chomik I guess you'd like to bind it somehow with task 'start', right? :D
gulp.task('watch:less', () => {
    gulp.watch('public/less/**/*.less', ['less']);
});

gulp.task('test', () => {
    let mocha = require('gulp-mocha');

    return gulp.src('./test/*-test.js', {read:false})
        .pipe(mocha())
        .once('end', () => {
            process.exit();
        });
});

gulp.task('jshint', () => {
    let jshint = require('gulp-jshint');

    return gulp.src(['./src/*.js', './test/*.js', './Gulpfile.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('start', ['less'], () => {
    let nodemon = require('gulp-nodemon');

    return nodemon({
        script: './bin/www',
        ext: 'js'
    }).once('exit', () => {
        console.log('Closing app.');
        process.exit();
    });
});
