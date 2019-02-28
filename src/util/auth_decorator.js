import jwt from "jsonwebtoken";
import { signed,sessionTime } from "../config";
import heper from "./heper";

 class index{
    //  签发token
    jwtSign(data={},sign=signed){
        Object.assign(data, {_timeOut_: new Date().getTime() + (sessionTime),signRonder:heper.signRonder(30)+new Date().getTime()})
        return jwt.sign( data,sign);
    }

    // 实现header token认证  (用户验证)
    utilUser(ctx){
        if(!ctx.request) return;
        let token = ctx.header.authorization;
        if(!token)  return  {code:-101,mssage:"no login,miss is token",status:false};
        try {
            let res =  jwt.verify(token,ctx.config("signed"));
            if(res._timeOut_- new Date().getTime()<0) return   {code:-104,mssage:"no login,token is not invalid",status:false};
            ctx.state['userInfo'] = res;
        } catch (error) {
            return  {code:-104,mssage:"no login,token is error",status:false};
        }
        return null;
    }
    utilRole(ctx){
        console.log(ctx.state);
        return null
        // return {state:false,mssage:"你无权限操作"};
    }

    // 装饰 用户拦截
    isUser(){
        let cthis = this;
        return (target,value,dec)=>{
            let fn = dec.value;
            dec.value = async (ctx,next,_this)=>{
                if(!ctx.request) return;
                let res =  cthis.utilUser(ctx);
                if(res) return ctx.body = await res;
                await fn.call(_this,ctx,next,_this);
            }
        }
    }
    // 装饰 角色拦截
    isRoleAuth(){
        let cthis = this;
        return (target,value,dec)=>{
            let fn = dec.value;
            dec.value = async (ctx,next,_this)=>{
                if(!ctx.request) return;
                var res =  cthis.utilRole(ctx);
                if(res) return ctx.body = await res;
                await fn.call(_this,ctx,next,_this);
            }
        }
    }
}
export default new index();