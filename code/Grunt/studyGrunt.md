#### 常用的插件
##### grund-sass
compile Sass to CSS use node-sass 

```
yarn add grunt-sass sass --save-dev 
```

##### bable-babel

use next generation for javascript, today

```
yarn add --dev grunt-babel @babel/core @babel/preset-env
```

##### grunt-contrib-watch

Run predefined tasks whenever watched file patterns are added, changed or deleted

```
yarn add grunt-contrib-watch --save-dev
```

```
// Grount的 入口文件
const sass = require('sass');
const loadGroundTask = require('load-grunt-tasks');
module.exports = grunt => {
  // 配置多目标任务
  grunt.initConfig({
    clean: {
      css: "src/css/*.css" //删除 src 下的所有css文件 也可以指定文件名(index.css) 或者删除 整个文件夹 (**)
    },
    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      main: {
        files: {
          // key值 是 构建完成后的 文件村位置 ，value 是目标文件
          'src/css/style.css': 'src/sass/main.scss'
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        // 转换最新的语法
        presets: ['@babel/preset-env']
      },
      dist: {
        files: {
          'dist/app.js': 'src/app.js'
        }
      }
    },
    watch: {
      js: {
        files: ['src/*.js'],
        tasks: ['babel'],
      },
      css: {
        files: ['src/sass/*.scss'],
        tasks: ['sass'],
      }
    },
  })
  // // 使用插件 一般任务名为 插件的最后一个单词
  // grunt.loadNpmTasks('grunt-contrib-clean');
  // grunt.loadNpmTasks('grunt-sass');

  // 上述 每次都要定义一个插件并注册任务，此处可以使用  load-grunt-tasks 管理多个插件任务 自动添加我们引入的任务
  loadGroundTask(grunt)
  grunt.registerTask("default", ["sass", "babel", "watch"])
}
```

