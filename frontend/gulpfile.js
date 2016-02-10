var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require("gulp-tslint");
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var scss = require('gulp-sass');
var seq = require('gulp-sequence');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var merge = require('merge2');

// var tsProject = ts.createProject({
//     module: 'system',
//     noImplicitAny: true,
//     removeComments: true,
//     preserveConstEnums: true,
//     target: 'es5',
//     experimentalDecorators: true,
//     emitDecoratorMetadata: true,
//     sortOutput: true,
//     outFile: 'app.js'
// });

var tsProject = ts.createProject('tsconfig.json', {
    typescript: require('typescript'),
    outFile: 'app.js'
});

gulp.task('clean', function () {
    return gulp.src([
        'javascript/app.js*',
        'css/app.css*'
    ], { read: false }) // much faster
        .pipe(rimraf());
});

gulp.task('ts:compile', ['ts:lint'], function () {

    var tsResult = gulp.src('typescript/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('javascript'));

    // return gulp.src(["typescript/**/*.ts"])
    //     .pipe(sourcemaps.init())
    //     .pipe(ts(tsProject))
    //     .pipe(sourcemaps.write("."))
    //     .pipe(gulp.dest("javascript"))

});

gulp.task('ts:watch', ['ts:compile'], function () {
    gulp.watch('typescript/**/*.ts', ['ts:compile']);
});

gulp.task('scss:compile', function () {
    return gulp.src('./scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(scss().on('error', scss.logError))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest('./css'));
});

gulp.task('scss:watch', ['scss:compile'], function () {
    gulp.watch('scss/**/*.scss', ['scss:compile']);
});

gulp.task('ts:lint', function () {
    return gulp.src(["typescript/**/*.ts", "test/**/*.ts"])
        .pipe(tslint())
        .pipe(tslint.report("verbose", {
            emitError: false
        }))
});

gulp.task('serve', ['scss:watch', 'ts:watch'], function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    return gulp.watch([
        "./javascript/**/*.js",
        "./css/**/*.css",
        "./views/**/*.html",
        "./data/**/**",
        "./index.html"
    ], [browserSync.reload]);
});