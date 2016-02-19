var gulp = require("gulp");
var ts = require("gulp-typescript");
var concat = require("gulp-concat");
var sourcemaps = require("gulp-sourcemaps");
var tslint = require("gulp-tslint");
var ignore = require("gulp-ignore");
var rimraf = require("gulp-rimraf");
var scss = require("gulp-sass");
var seq = require("gulp-sequence");
var uglify = require("gulp-uglify");
var browserSync = require("browser-sync").create();
var inject = require("gulp-inject");
var es = require("event-stream");
var templateCache = require("gulp-angular-templatecache");
var chmod = require('gulp-chmod');
var zip = require('gulp-zip');

gulp.task("copy:font", function () {
    return gulp.src(["fonts/*.{eot,svg,ttf,woff,woff2}"], { base: "./" })
        .pipe(chmod(755)).pipe(gulp.dest("dist/")); // move the fonts into dist folder
});

gulp.task("copy:data", function () {
    return gulp.src(["data/**/*.json"], { base: "./" })
        .pipe(chmod(755))
        .pipe(gulp.dest("dist"));
});

gulp.task("publish:zip", ["dist"], function () {
    return gulp.src("dist/**/*")
        .pipe(zip('frontend-dist.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task("copy:images", function () {
    return gulp.src(["**/*.{jpeg,jpg,png,svg,gif,ico}"], { base: "./" })
        .pipe(chmod(755))
        .pipe(gulp.dest("dist"));
});

gulp.task("copy:jslib",["copy:systemJsConf"], function () {
    return gulp.src(["javascript/lib/*"])
        .pipe(chmod(755))
        .pipe(gulp.dest("dist/js/lib")); // move the javascript/lib into dist folder
});

gulp.task("copy:systemJsConf",["copy:jspm"], function () {
    return gulp.src(["system.config.js"])
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("copy:jspm", function () {
    return gulp.src(["./jspm_packages/**/**"], { base: "./" })
        .pipe(chmod(755))
        .pipe(gulp.dest("dist/"));
});

gulp.task("copy:templates", function () {
    return gulp.src(["views/**/*.html"])
        .pipe(templateCache({ "standalone": true }))
        .pipe(chmod(755))
        .pipe(gulp.dest("dist/js/")); // merge .html templates into templates.js file
});

gulp.task("copy:index.html", function () {
    return gulp.src(["index.html"])
        .pipe(chmod(755))
        .pipe(gulp.dest("dist"));
});

gulp.task("dist", seq(["clean"], ["ts:compile", "copy:images", "scss:compile", "copy:data", "copy:index.html", "copy:templates"], ["copy:font", "copy:jslib", "copy:jspm"]));

var tsProject = ts.createProject("tsconfig.json", {
    typescript: require("typescript"),
    outFile: "app.js"
});

gulp.task("clean", function () {
    return gulp.src(["dist"], { read: false }).pipe(rimraf());
});

gulp.task("ts:compile", ["ts:lint"], function () {

    var tsResult = gulp.src(["typescript/**/*.ts", "../commons/**/*.ts"])
        // .pipe(sourcemaps.init())
        .pipe(ts(tsProject, { sortOutput: true }));
    // .pipe(uglify({mangle:false}))

    return tsResult.js
        // .pipe(sourcemaps.write("."))
        .pipe(chmod(755))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("html:watch", ["copy:index.html", "copy:templates"], function () {
    gulp.watch(["views/**/*.html", "index.html"], ["copy:index.html", "copy:templates"]);
});

gulp.task("jspm:watch", ["copy:jspm"], function () {
    gulp.watch(["jspm_packages/**/*.js"], ["copy:jspm"]);
});

gulp.task("data:watch", function () {
    gulp.watch(["data/**/*.{json}"], ["copy:data"]);
});

gulp.task("ts:watch", ["ts:compile"], function () {
    gulp.watch(["typescript/**/*.ts", "../commons/**/*.ts"], ["ts:compile"]);
});


gulp.task("scss:compile", function () {
    return gulp.src("./scss/app.scss")
        .pipe(sourcemaps.init())
        .pipe(scss().on("error", scss.logError))
        .pipe(chmod(755))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./dist/css"));
});

gulp.task("scss:watch", ["scss:compile"], function () {
    gulp.watch("scss/**/*.scss", ["scss:compile"]);
});

gulp.task("ts:lint", function () {
    return gulp.src(["typescript/**/*.ts", "test/**/*.ts"])
        .pipe(tslint())
        .pipe(tslint.report("verbose", {
            emitError: false
        }));
});

gulp.task("serve", ["copy:images", "scss:watch", "ts:watch", "html:watch","data:watch","jspm:watch","copy:jslib"], function () {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        },
        online: true
    });

    return gulp.watch([
        "./typescript/**/*.js",
        "./index.html",
        "./views/**/*.html",
        "./scss/*.*",
        "./images/*.*",
    ], [browserSync.reload]);
});
