const gulp = require("gulp");
const concatenate = require("gulp-concat");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
// const image = require('gulp-image');

const sassFiles = [
  "./public/scss/style.scss",
];

const vendorJsFiles = [
  "./node_modules/jquery/dist/jquery.min.js",
  "./node_modules/bootstrap/dist/js/bootstrap.min.js"
];

gulp.task('sass', function(){
    return gulp
      .src(sassFiles)
      .pipe(sass()) // Using gulp-sass
      .pipe(concatenate("styles.css"))
      .pipe(gulp.dest("./public/css/"))
      .pipe(cleanCSS())
      .pipe(rename("styles.min.css"))
      .pipe(gulp.dest('./public/css/'))
});

gulp.task("js:vendor", () => {
  return gulp
    .src(vendorJsFiles)
    .pipe(concatenate("vendor.min.js"))
    .pipe(gulp.dest("./public/js/"))
});

gulp.task('images', function(){
  return gulp
    .src('./public/img/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/img'))
});

gulp.task("watch", function(){
  gulp.watch(sassFiles, gulp.series("sass"));
});

// gulp.task("default", gulp.series("watch"));

// gulp.task('default', gulp.parallel(["js:vendor", 'sass', 'images', 'watch']))

// gulp.task("default", gulp.series("sass"));

gulp.task('default', gulp.parallel(["js:vendor", 'sass']))

