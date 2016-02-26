var gulp = require('gulp')
var nodemon = require('gulp-nodemon')
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var tslint = require("gulp-tslint");
var ignore = require("gulp-ignore");
var rimraf = require("gulp-rimraf");
var seq = require("gulp-sequence");
var zip = require('gulp-zip');

var tsProject = ts.createProject("tsconfig.json", {
    typescript: require("typescript")
});

gulp.task("clean", function () {
    return gulp.src(["dist"], { read: false }).pipe(rimraf());
});

gulp.task("ts:lint", function () {
    return gulp.src(["typescript/**/*.ts", "test/**/*.ts"])
        .pipe(tslint())
        .pipe(tslint.report("verbose", {
            emitError: false
        }));
});

gulp.task("ts:compile", ["ts:lint"], function () {
    var tsResult = gulp.src(["typescript/**/*.ts","../commons/**/*.ts"])
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/"));
});

gulp.task("ts:watch", ["ts:compile"], function () {
    gulp.watch(["typescript/**/*.ts","../commons/**/*.ts","typings/**/*.d.ts"], ["ts:compile"]);
});


gulp.task('serve',["ts:watch"], function () {
  nodemon({ script: 'dist/backend/typescript/Server.js',
          "verbose":true,
           "delay": 5,
            "execMap": {
                "js": "node --harmony"
            }
           })
    .on('restart', function () {
      console.log('RAM Backend Server: restarted [OK]')
    })
});

gulp.task("copy:resources",function (params) {
   return gulp.src(["package.json"])
        .pipe(gulp.dest("dist/"));
});

gulp.task("publish:zip",["ts:compile","copy:resources"],function () {
    return gulp.src("dist/**/*")
        .pipe(zip('backend-dist.zip'))
        .pipe(gulp.dest('./'));
});
