const del = require('del')
const broswer = require('browser-sync')
const { parallel, src, dest, series, watch } = require("gulp")
// const sass = require("gulp-sass")
// const babel = require("gulp-babel")
// const swig = require("gulp-swig")

const loadPlugins = require("gulp-load-plugins")

// 自动加载 项目中所用到的插件  插件名都是 gulp- 后面的部分 若是有多个杠 则用驼峰
// 例如 gulp-sass 就 plugins.sass gulp-test-hhh  plugins.testHhh
const plugins = loadPlugins();
const bs = broswer.create(); 

const style = () => {
  return src("./src/assets/styles/*.scss", { base: "src" })
    .pipe(plugins.sass({ outputStyle: "expanded " }))
    .pipe(dest('temp'))
    // 执行完之后 把流直接推到浏览器中 此时的 bs init中就不需要file 去指定监听文件了
    .pipe(bs.reload({stream: true}))
}

const script = () => {
  return src("./src/assets/scripts/*.js", { base: "src" })
    // @babel/preset-env 可转换最新的 es6语法
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({stream: true}))
}

const page = () => {
  return src("src/*.html", { base: 'src' })
    .pipe(plugins.swig())
    .pipe(dest('temp'))
    .pipe(bs.reload({stream: true}))
}
const image = () => {
  return src("src/assets/images/**", { base: 'src' })
    .pipe(dest('dist'))
}

const font = () => {
  return src("src/assets/fonts/**", { base: 'src' })
    .pipe(dest('dist'))
}

const clean = () => {
  return del(["dist", "temp"])
}
// imagemin 插件是github上的 下载不下来 
// const image = ()=> {
//   return src("./src/assets/images/**", {base: "src"})
//     .pipe(imagemin)
//     .pipe(dest("dist"))
// }

// image 也可以压缩字体
// const font = ()=> {
//   return src("./src/assets/fonts/**", {base: "src"})
//     .pipe(imagemin)
//     .pipe(dest("dist"))
// }

const extra = () => {
  return src("./public/**", { base: "src" })
    .pipe(dest("dist"))
}

const useref = ()=>{
  return src("temp/*.html", {base: "dist"})
    .pipe(plugins.useref({searchPath: ['dist', '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCss :true,
      minifyJs: true
    })))
    .pipe(dest('dist'))
}


const server = () => {
  watch("./src/assets/styles/*.scss", style)
  watch("./src/assets/scripts/*.js", script)
  watch("src/*.html", page)
  // 开发阶段 监视图片 字体没有实际意义
  // watch("src/assets/images/**", image) 
  // watch("src/assets/fonts/**", font)
  // watch("./public/**", extra)
  // 一旦这些资源文件 变化 就刷新浏览器
  watch([
    "src/assets/images/**",
    "src/assets/fonts/**",
    "./public/**"
  ], bs.reload)

  bs.init({
    // files: "dist/**", //监听文件
    notify: false,
    open: false,
    server: {
      baseDir: [ //请求过来后 依次从数组中去找
        'temp', 'src', 'public'
      ],
      routes: {
        "/node_modules": "node_modules"
      }
    }
  })
}


// 并行执行 
const compile = parallel(style, script, page)

// 开发阶段 先编译 后启动服务 避免没有dist目录 服务报错
const develop = series(compile, server)

// 上线之前执行 先清空dist 然后编译压缩所有文件
const build = series(
  clean,
  parallel(
     series(compile, useref) ,
      image,
      font,
      extra
  )
)

module.exports = {
  clean,
  build,
  develop,
}
