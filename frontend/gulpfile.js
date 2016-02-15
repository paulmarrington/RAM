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
var merge = require("merge2");
var bowerFiles = require("main-bower-files");
var inject = require("gulp-inject");
var es = require("event-stream");
var templateCache = require("gulp-angular-templatecache");
var chmod = require('gulp-chmod');

gulp.task("copy:font", function () {
    return gulp.src(["fonts/*.{eot,svg,ttf,woff,woff2}"], { base: "./" })
        .pipe(chmod(755)).pipe(gulp.dest("dist/")); // move the fonts into dist folder
});

gulp.task("copy:data", function () {
    return gulp.src(["data/**/*.json"], { base: "./" })
        .pipe(chmod(755))
        .pipe(gulp.dest("dist"));
});

gulp.task("copy:images", function () {
    return gulp.src(["images/**/*.{jpeg,jpg,png,svg,gif}"], { base: "./" })
        .pipe(chmod(755))
        .pipe(gulp.dest("dist"));
});

gulp.task("copy:jslib", function () {
    return gulp.src(["javascript/lib/*"])
        .pipe(chmod(755))
        .pipe(gulp.dest("dist/js/lib")); // move the javascript/lib into dist folder
});

gulp.task("copy:bower", function () {
    return gulp.src(bowerFiles(), { base: "./" })
        .pipe(chmod(755))
        .pipe(gulp.dest("dist/")); // move the javascript/lib into dist folder
});

gulp.task("copy:templates", function () {
    return gulp.src(["views/**/*.html"])
        .pipe(templateCache({ "standalone": true }))
        .pipe(chmod(755))
        .pipe(gulp.dest("dist/js/")); // merge .html templates into templates.js file
});

gulp.task("copy:index.html", function () {
    return gulp.src(["index.html"])
        .pipe(inject(gulp.src(bowerFiles(), { read: false }), { name: "bower" }))
        .pipe(chmod(755))
        .pipe(gulp.dest("dist"));
});

gulp.task("dist", seq(["clean"], ["ts:compile", "copy:images", "scss:compile", "copy:data", "copy:index.html", "copy:templates"], ["copy:font", "copy:jslib", "copy:bower"]));

// var tsProject = ts.createProject({
//     noImplicitAny: true,
//     removeComments: true,
//     preserveConstEnums: true,
//     target: "es5",
//     experimentalDecorators: true,
//     emitDecoratorMetadata: true,
//     sortOutput: true,
//     outFile: "app.js"
// });

var tsProject = ts.createProject("tsconfig.json", {
    typescript: require("typescript"),
    outFile: "app.js"
});

gulp.task("clean", function () {
    return gulp.src(["dist"], { read: false }).pipe(rimraf());
});

gulp.task("ts:compile", ["ts:lint"], function () {

    var tsResult = gulp.src("typescript/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write("."))
        .pipe(chmod(755))
        .pipe(gulp.dest("dist/js"));

    // return gulp.src(["typescript/**/*.ts"])
    //     .pipe(sourcemaps.init())
    //     .pipe(ts(tsProject))
    //     .pipe(sourcemaps.write("."))
    //     .pipe(gulp.dest("javascript"))

});

gulp.task("html:watch", ["copy:index.html", "copy:templates"], function () {
    gulp.watch(["views/**/*.html", "index.html"], ["copy:index.html", "copy:templates"]);
});

gulp.task("bower:watch", ["copy:bower"], function () {
    gulp.watch(["bower_components/**/*.js"], ["copy:index.html", "copy:bower"]);
});

gulp.task("data:watch", function () {
    gulp.watch(["data/**/*.{json}"], ["copy:data"]);
});

gulp.task("ts:watch", ["ts:compile"], function () {
    gulp.watch(["typescript/**/*.ts"], ["ts:compile"]);
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
        }))
});

gulp.task("serve", ["copy:images","scss:watch", "ts:watch", "html:watch", "bower:watch", "data:watch"], function () {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });

    return gulp.watch([
        "./typescript/**/*.js",
        "./index.html",
        "./views/**/*.html",
        "./scss/*.*",
        "./images/*.*",
    ], [browserSync.reload]);
});