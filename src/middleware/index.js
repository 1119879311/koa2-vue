import logger from "./logger";
import heper from "../util/heper";
import config from "./setConfig";
import model from './model';
import isAuthUser from "./isUserAuth";
import bodyparse from "koa-bodyparser";

Object.assign(heper,{jwtSign:isAuthUser.siger})

export default (app)=> {
    app
    .use(config)
    .use(logger)
    .use(model)
    .use(bodyparse())
    .use( async  (ctx,next)=>{
        ctx.heper = heper;
        await next();
    })
    // .use(isAuthUser.verifyHeader({GET:['*'],POST:["/api/v1/admin/login"]}))
   
}