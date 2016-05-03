var gulp = require("gulp");
var tslint = require("gulp-tslint");
var ts = require("gulp-typescript");
var url = require("url");
var gutil = require('gulp-util');

var tsProject = ts.createProject("tsconfig.json", {
    typescript: require("typescript")
});

gulp.task("ts:lint", function () {
    return gulp.src(["typescript/{**,./}/*.ts"])
        .pipe(tslint())
        .pipe(tslint.report("verbose", {
            emitError: false
        }));
});

gulp.task("ts:watch", ["ts:compile"], function () {
    return gulp.watch(["typescript/{**,./}/*.ts", "typescript/{**,./}/*.html"], ["ts:compile"]);
});

gulp.task("ts:compile", ["ts:lint"], function () {
    return gulp.src(["typescript/{**,./}/*.ts"])
        .pipe(ts(tsProject, { sortOutput: true }))
        .pipe(gulp.dest("dist/"));

});

gulp.task("watch", ["ts:watch"]);