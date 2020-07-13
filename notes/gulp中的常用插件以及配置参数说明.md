#### src()

```
return src('src/assets/styles/*.scss', {base: 'src'})
        .pipe(dest('dist'))
```

src 第一个参数表示文件路径。可使用通配符 ** 表示所有文件，base 参数表示输出时 以哪个文件夹为参照。

#### dest()

表示文件输出流位置

####  gulp-sass

把sass文件转为css

```
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(plugins.sass({ outputStyle: "expanded " })) // 将所有花括号展开
        .pipe(dest('temp'))
}
```

#### gulp-babel

转换es6代码，此插件依赖以下插件 babel-core，babel-preset-env

由于我的项目bable 为8.0 会有版本冲突，因此 安装  @babel/core，@babel/preset-env

```
const script = () => {
    return src("./src/assets/scripts/*.js", { base: "src" })
        // @babel/preset-env 可转换最新的 es6语法
        .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('temp'))
        .pipe(bs.reload({ stream: true }))
}
```



####  gulp-load-plugins

自动加载gulp项目构建 中所用到的插件，使用该插件后 就不用在逐个require  插件了。下面以 图片压缩插件 gulp-imagemin 为例：

使用前：

```
const imagemin = require('gulp-imagemin')

const image = ()=> {
    return src('src/assets/images/**', {base: 'src'})
    .pipe(imagemin({progressive: true}))
    .pipe(dest('dist'))
}
```

使用后：

```
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins();
// 项目中只要用到插件的 就可以t通过 plugins.插件名 在gulp-后的部分 就可以直接用了。gulp-imagemin =》 plugins.imagemin
//需要注意的是当有多个 - 的时候 使用驼峰 gulp-test-test => plugins.testTest
const image = ()=> {
    return src('src/assets/images/**', {base: 'src'})
    .pipe(plugins.imagemin({progressive: true}))
    .pipe(dest('dist'))
}
```

#### gulp-imagemin

此插件可压缩图片以及字体。

```
const image = ()=> {
    return src('src/assets/images/**', {base: 'src'})
    .pipe(plugins.imagemin({progressive: true})) //此处是无损压缩图片
    .pipe(dest('dist'))
}
```

#### gulp-clean-css 

压缩css

#### gulp-htmlmin

压缩html

#### gulp-uglify

压缩js

#### del

del 用于删除目标路径中的所有文件。这个不是gulp的插件，是一个单独的工具

```
const clean = ()=> {
    return del(["dist", "temp"])
}
```

#### browser-sync

browser-sync 会启动一个服务，可以帮我们自动刷新浏览器等。这个不是gulp的插件，是一个单独的工具

```
const broswer = require('browser-sync')
const bs = broswer.create(); 

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
   return  bs.init({
      files: "dist/**", //监听文件
      notify: false, 
      open: false, // 不自动打开浏览器
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
```

#### gulp-useref ,"gulp-if": "^3.0.0",

**gulp-useref**这是一款可以将HTML引用的多个CSS和JS合并起来，减小依赖的文件个数，从而减少浏览器发起的请求次数。gulp-useref根据注释将HTML中需要合并压缩的区块找出来，对区块内的所有文件进行合并。**注意：它只负责合并，不负责压缩！**,如果需要做其他操作，可以配合`gulp-if`插件使用.

如下：当我们将html编译后呢这些资源文件将合并

```
<!-- build:css assets/styles/vendor.css -->
  <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
  <!-- endbuild -->
  <!-- build:css assets/styles/main.css -->
  <link rel="stylesheet" href="assets/styles/main.css">
  <!-- endbuild -->
```

```
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
```

