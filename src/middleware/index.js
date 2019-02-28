import logger from "./logger";  //打印日志中间件
import heper from "../util/heper"; //辅助工具方法 中间件
import config from "./setConfig"; //配置文件中间件
import model from './model';    //数据库model中间件
import bodyparse from "koa-bodyparser"; 
import koaStatic from "koa-static";
// import isAuthUser from "./isUserAuth";
// Object.assign(heper,{jwtSign:isAuthUser.siger})
const __rootDir = process.cwd()
import { staticPath } from "../config";
export default (app)=> {
    app
    .use(config)
    .use(logger)
    .use(model)
    .use(bodyparse())
    .use(koaStatic(__rootDir + staticPath))
    .use( async  (ctx,next)=>{
        ctx.heper = heper;
        await next();
    })
    // .use(isAuthUser.verifyHeader({GET:['*'],POST:["/api/v1/admin/login"]}))
   
}