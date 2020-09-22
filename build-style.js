const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const less = require('gulp-less');
const sass = require("gulp-sass");
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

// 编译less
// gulp.task('css', function () {
//     gulp.src('./static/cesium/Widgets/widgets.css')
//         .pipe(less())
//         .pipe(autoprefixer({
//             browsers: ['last 2 versions', 'ie > 8']
//         }))
//         .pipe(cleanCSS())
//         .pipe(rename('veu-iclient3d-webgl.css'))
//         .pipe(gulp.dest('./dist/styles'));
// });

// 编译scss
gulp.task('sass', function () {
    gulp.src('./src/common/scss/index.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie > 8']
        }))
        .pipe(cleanCSS())
        .pipe(rename('vue-iclient3d-webgl.min.css'))
        .pipe(gulp.dest('./dist/styles'));
});

// 拷贝字体文件
gulp.task('fonts', function () {
    gulp.src('./src/common/css/fonts/*.*')
        .pipe(gulp.dest('./dist/styles/fonts'));
});

gulp.task('default', ['sass','fonts']);

// //Gulp plugin
// var gulp = require("gulp"),
//   util = require("gulp-util"),
//   concat = require('gulp-concat'),
//   uglifycss = require('gulp-uglifycss'),
//   sass = require("gulp-sass"),
//   autoprefixer = require('gulp-autoprefixer'),
//   minifycss = require('gulp-minify-css'),
//   rename = require('gulp-rename'),
//   del = require('del'),
//   log = util.log;


// // 样式文件打包成 一个sgm-ng-comm.min.css
// var sassFiles = "./scss/style.scss";
// gulp.task("sass", function(){
//   log("generate css files " + (new Date()).toString());
//   gulp.src(sassFiles)
//     .pipe(sass({ style: 'expanded' }))
//     .pipe(autoprefixer("last 3 version","safari 5", "ie 8", "ie 9"))
//       .pipe(concat('veu-iclient3d-webgl.css'))
//     .pipe(gulp.dest("./dist/css"))
//     .pipe(rename('veu-iclient3d-webgl.min.css'))
//     .pipe(minifycss())
//     .pipe(gulp.dest('./dist/css/min'));
// });

// gulp.task("watch", function(){
//   log("Watching scss files for modifications");
//   gulp.watch(sassFiles, ["sass"]);
// });
// //删除生成的
// gulp.task('clean', function() {
//     del(['dist']);
// });
// gulp.task("default", ['clean','sass','themes']);