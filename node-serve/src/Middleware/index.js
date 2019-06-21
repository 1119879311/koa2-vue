const koaStatic = require("koa-static");
const path = require("path")
const Koa2cors = require("koa2-cors")
const bodyparse =require("koa-bodyparser")
const {staticPath }  = imports("Config");
const model = imports("models/model")
const {success,error,send}  = imports("Middleware/ctxbody");
const {logsInfo}  = imports("Middleware/logs");


module.exports = (app)=>{
    app
    .use(Koa2cors())
    .use(bodyparse())
    .use(logsInfo)
    .use(koaStatic(path.join('.',staticPath)))
    .use(async (ctx,next)=>{
        ctx.Model = model;
        ctx.success = success;
        ctx.error =error;
        ctx.send =send;
        await next()
    })
}