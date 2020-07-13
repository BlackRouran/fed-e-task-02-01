#### sass学习
##### package.json 配置说明

npm scripts 是实现自动化构建最简单的方式

```
{
  "name": "trialscss",
  "version": "1.0.0",
  "description": "sass",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    // 通过npm  run build 可执行此命令 --watch  监视单个Sass 文件，每次修改并保存时自动编译
    "build": "sass src/sass/main.scss src/css/style.css --watch "  
    //"preserve" : "npm run build", // serve 执行之前 先执行此命令 start 和此命令 不同时存在
    //启动一个 server服务 可监听 --files 监听文件变化后刷新页面
    "serve": "browser-sync . --files \"src/css/*.css\"" 
    "start": "run-p build serve" // 同时启动两个服务
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "sass": "^1.26.9"，
    "npm-run-all": "^4.1.5" // 可以同时执行多个命令
  }
}

```

