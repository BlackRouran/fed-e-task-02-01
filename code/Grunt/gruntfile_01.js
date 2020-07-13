// Grount的 入口文件 使用请改名为 grundfile.js
// 用于定义一些 需要执行的任务
// 导出一个方法
// 此方法接受一个 grunt 的形参 ，内部提供一些创建任务时所用到的API

module.exports = grunt => {

    // 通过 registerTask 注册一个任务 第一个参数是 任务名称 第二个是任务
    grunt.registerTask("foo", ()=>{
        console.log("hello grunt");
       // 通过 return false 终止后续任务
        return false
    })

    // 第二个参数 可以是一个字符串 此 字符串作为任务描述 可以用 grunt --help 打印出来
    grunt.registerTask("foo1", 'this is foo1 task', ()=>{
        console.log("grunt task foo1")
    })

    // default 可以注册为 grunt 的 默认任务 。直接用 yarn grunt 就会执行此命令
    // grunt.registerTask("default", ()=>{
    //     console.log("this is grunt default task")
    // })

    // 通过 传递一个数组 可依次执行数组里的任务
    grunt.registerTask("default",["foo", "foo1"])

    //grunt 默认执行同步任务，如果要执行异步任务 需要 执行this.async 告诉grunt 此任务为异步任务
    grunt.registerTask('async-task',function(){
        const done = this.async();
        setTimeout(()=>{
            console.log("async task is working")
            // 调用回调 告诉 grunt 任务已经处理完成
            done()
        },10)
    })
}