// gulp 操作文件的api
const { parallel, src, dest } = require("gulp")
const cleanCss = require('gulp-clean-css')
const rename = require("gulp-rename")
// gulp 中的文件操作多数是 流操作
const minicss = ()=>{
    return src('./src/css/*.css')
    .pipe(cleanCss())
    .pipe(rename({extname: ".main.css"}))
    .pipe(dest('dist'))
}

exports.default = parallel(minicss)