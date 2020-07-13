// 实现这个项目的构建任务
const del = require('del')
const broswer = require('browser-sync')
const loadPlugins = require('gulp-load-plugins')
const { series, parallel, src, dest, watch } = require('gulp')

const plugins = loadPlugins();
const bs = broswer.create();

// css js html 后续还要压缩编译 因此先放在临时目录
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(plugins.sass({ outputStyle: "expanded " }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}
const script = () => {
    return src("./src/assets/scripts/*.js", { base: "src" })
        // @babel/preset-env 可转换最新的 es6语法
        .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}
const page = () => {
    return src('src/**/*.html', { base: 'src' })
        .pipe(plugins.swig())
        .pipe(dest('temp'))
}
// public 下的文件 以及图片 字体 这些开发时不需要打包 上线时再编译打包进 dist下
const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}

const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(plugins.imagemin({ progressive: true }))
        .pipe(dest('dist'))
}

const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(plugins.imagemin({ progressive: true }))
        .pipe(dest('dist'))
}

const clean = () => {
    return del(["dist", "temp"])
}

const useref = () => {
    return src("temp/**/*.html", { base: "temp" })
        .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({
            collapseWhitespace: true,
            minifyCss: true,
            minifyJs: true
        })))
        .pipe(dest('dist'))
}

const server = () => {
    // watch gulp提供的监听方法 前面的文件发生变化 执行后面的任务
    watch("./src/assets/styles/*.scss", style)
    watch("./src/assets/scripts/*.js", script)
    watch("src/*.html", page)
    // 静态资源发生变化 调用bs的reload 方法 刷新浏览器
    watch([
        "src/assets/images/**",
        "src/assets/fonts/**",
        "./public/**"
    ], bs.reload)
    return bs.init({
        files: "dist/**", //监听文件
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

// 对开发和上线都需要处理的文件 所用到的任务 进行合并 
const compile = parallel(style, script, page)

const develop = series( clean, compile, server)

const build = series(
    clean,
    parallel(
        series(compile, useref),
        image,
        font,
        extra
        )
    )
module.exports = {
    clean,
    develop,
    build
}