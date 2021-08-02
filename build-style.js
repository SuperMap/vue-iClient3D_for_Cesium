

// 打包scss
const gulp = require("gulp");
const sass = require("gulp-sass");
const minifyCss = require("gulp-clean-css");
const renameCss = require("gulp-rename");



// gulp创建任务
// gulp.task("sass", function () {
//     return gulp.src("./src/style/globle.scss") // 编写的scss文件路径
//         .pipe(sass()) //将scss编译成css
//         // .pipe(gulp.dest("dist/SM_iClient3D_VUE_for_WebGL/styles")) //未压缩的css存放目录
//         .pipe(minifyCss()) //压缩css
//         .pipe(renameCss("index.css")) //重命名压缩后的css
//         .pipe(gulp.dest("lib/theme")) //压缩后的css存放位置
      
// });
// // 拷贝字体文件
// gulp.task('font', function () {
//     return   gulp.src('./src/style/font/*.*')
//         .pipe(gulp.dest('lib/theme/font'));
// });
// gulp.task('default', gulp.parallel('sass','font'));




gulp.task("sass", function () {
    return gulp.src("./src/style/globle.scss") // 编写的scss文件路径
        .pipe(sass()) //将scss编译成css
        // .pipe(gulp.dest("dist/SM_iClient3D_VUE_for_WebGL/styles")) //未压缩的css存放目录
        .pipe(minifyCss()) //压缩css
        .pipe(renameCss("components.css")) //重命名压缩后的css
        .pipe(gulp.dest("examples/dist")) //压缩后的css存放位置
      
});
// 拷贝字体文件
gulp.task('font', function () {
    return   gulp.src('./src/style/font/*.*')
        .pipe(gulp.dest('examples/dist/font'));
});
gulp.task('default', gulp.parallel('sass','font'));




