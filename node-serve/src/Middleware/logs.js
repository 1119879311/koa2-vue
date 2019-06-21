const fs = require("fs")
const infoPath = "./logs/info.log"
const ErrorPath = "./logs/error.log"

const logs = {
    info:(str='')=>{
        console.log(`\u001b[32m${str}\u001b[32m`);//绿色
    },
    error:(str='')=>{
        console.log(`\u001b[31m\u001b[31m`);//红色
        console.log(str)
    }
}


let logsInfo = (async (ctx,next)=>{//捕获正常请求日志
    //过滤静态资源 .ico .jpg,.jpeg,.png,.svg,.gif,.mp3,.mp4
    if(/.(ico|png|jpg|jpeg|gif|svg|pm3|pm4)+$/.test(ctx.request.url)) {
        await next();
    }else{
        var logStr = `[${new Date().toLocaleString()}] [info]: ${getClientIp(ctx.request)} ${ctx.request.method} ${ctx.request.url} ${ctx.protocol}://${ctx.host}`;
        fs.appendFile(infoPath,logStr+'\n','utf8',(err,res)=>{})
        logs.info(logStr);
        await next()
    }
   
})
let logsError = async (err,ctx)=>{//捕获异常记录错误日志
    var logStr = `[${new Date().toLocaleString()}] [${getClientIp(ctx.request)}] [error] : ${err.stack}`;
    fs.appendFile(ErrorPath,logStr+'\n','utf8',(err,res)=>{})
    await logs.error(err.stack)
    await logs.info();
    return ctx.body =await {code:500,errorMsg:"serve is error"}
 }

 function getClientIp(req){
     return req.headers['x-forwarded-for'] || req.headers['x-real-ip']||req.ip
 }

module.exports = {
    logsInfo,logsError,logs
}