var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');
var url = require('url');
var gutil = require('gulp-util');

var tsProject = ts.createProject('tsconfig.json', {
    typescript: require('typescript')
});

gulp.task('ts:lint', function () {
    return gulp.src(['typescript/{**,./}/*.ts'])
        .pipe(tslint())
        .pipe(tslint.report('verbose', {
            emitError: false
        }));
});

gulp.task('default', ['ts:compile','test'], function () {
    return gulp.watch(['typescript/{**,./}/*.ts', 'typescript/{**,./}/*.html'], ['ts:compile','test']);
});

gulp.task('ts:compile',['ts:lint'], function () {
    return gulp.src(['typescript/{**,./}/*.ts'])
        .pipe(ts(tsProject, { sortOutput: true }))
        .pipe(gulp.dest('dist/'));

});

gulp.task('test',['ts:compile'], function () {
    return gulp.src(['dist/{**,./}/*.spec.js']).pipe(
        jasmine({
            verbose: true,
            includeStackTrace: true,
            config: {
                stopSpecOnExpectationFailure: false,
                random: false
            }
        })
    );
});

gulp.task('seed',['ts:compile'], function () {
    return gulp.src(['dist/seeding/{**,./}/*.seed.js']).pipe(
        jasmine({
            verbose: true,
            includeStackTrace: true,
            config: {
                stopSpecOnExpectationFailure: false,
                random: false
            }
        })
    );
});
