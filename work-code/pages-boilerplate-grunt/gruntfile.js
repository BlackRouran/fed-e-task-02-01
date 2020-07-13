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
          src: "src/assets/styles/*.scss",
          dest: "dist/css"
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
  loadGroundTask(grunt)
  grunt.registerTask("default", ["sass", "babel", "watch"])
}