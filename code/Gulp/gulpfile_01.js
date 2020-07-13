// gulp的注册任务方法
/* 
    * gulp 的任务都是异步任务
    * 任务完成后需要手动执行下 done 告诉gulp任务执行完毕
*/

// gulp 通过导出函数的方式去注册任务
exports.foo = (done)=>{
    console.log('foo is doing');
    done()
}

// 当函数名为default 时 此任务为 默认任务
exports.default = (done)=>{
    console.log('default is doing');
    done()
}

// gulp 4.0之前的写法 此方法不推荐使用
const gulp = require("gulp")
gulp.task("bar", (done) => {
    console.log('bar is doing');
    done()
})