var gulp = require("gulp");
var postcss = require("gulp-postcss");
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var alImport = require("postcss");
var precss = require('precss');

gulp.task('css', function(){
  var processors = [
    alImport(),
    autoprefixer(),
    cssnext,
    precss
  ];
  return gulp.src("./src/style.css")
    .pipe(postcss(processors))
    .pipe(gulp.dest("./dest"));
})