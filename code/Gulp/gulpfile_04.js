// gulp 入口文件
// node 实现gulp 中css压缩原理
const fs = require("fs");
const { Transform } = require("stream")
const path = require("path")
const { parallel } = require("gulp")

const minicss = () => {
    const read = fs.createReadStream(path.join(__dirname, "./src/css/index.css"))
    const write = fs.createWriteStream(path.join(__dirname, "./src/css/main.min.css"))
    const transform = new Transform({
        // 核心
        transform(chunk, encoding, callback) { 
            // chunk 读取流中读取到的 buffer
            const input = chunk.toString()
            const output = input.replace(/\s+/g,"").replace(/\/\*.+?\*\//g,"")
            callback(null, output)
        }
    })
    read
    .pipe(transform)// 先导入转换流
    .pipe(write) //转换后导入写入流
    return read
}

exports.default = parallel(minicss)