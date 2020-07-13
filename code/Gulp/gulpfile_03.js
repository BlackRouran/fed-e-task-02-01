// gulp 中的异步处理方式
const fs = require("fs");
// 错误优先  若多个任务同时执行 则此任务后的任务都不会再执行
exports.foo = (done)=>{
    console.log('foo is doing');
    done(new Error('task failed~~'))
}

// promiose 可直接返回一个不传任何参数的 promise ，一旦resolve后此时gulp 会认为我们的任务正常执行完了
exports.foo1 = ()=>{
    console.log('foo1 is doing')
    return Promise.resolve()
}
//若传入 reject 则执行失败 
exports.foo2 = ()=>{
    console.log('foo1 is doing')
    return Promise.reject(new Error("foo2 is failed.."))
}

// node 8 以上的 可使用 async
const timeout = time =>{
    return new Promise(resolve =>{
        setTimeout(resolve, time)
    })
}
// 当 promise 返回 resolve 时 执行
exports.foo3 = async()=>{
    await timeout(1000)
    console.log('async task~')
}
// stream 流  一般时读物文件时 也是用的最多的
exports.foo4 = ()=>{
    const ReadStream = fs.createReadStream('package.json');
    const writeStream = fs.createWriteStream('test.txt');
    ReadStream.pipe(writeStream);
    return ReadStream
}

// 事实上 底层gulp 是在 stream 的end方法中 手动调用了done()

exports.foo5 = (done)=>{
    const ReadStream = fs.createReadStream('package.json');
    const writeStream = fs.createWriteStream('test.txt');
    ReadStream.pipe(writeStream);
    ReadStream.on('end',()=>{
        done()
    })
}