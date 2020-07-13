// gulp 任务的并行执行 和 依次执行


const {series, parallel, task} = require("gulp")



const task1 = (done)=>{
    console.log('task1 is doing');
    done()
}
const task2 = (done)=>{
    console.log('task2 is doing');
    done()
}
const task3 = (done)=>{
    console.log('task3 is doing');
    done()
}
// series 依次执行以下任务 异步
exports.foo = series(task1, task2, task3)
// parallel 并行执行以下任务 同步
exports.bar = parallel(task1, task2, task3)