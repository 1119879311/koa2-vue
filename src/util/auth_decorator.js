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
    async utilUser(ctx){
        if(!ctx.request) return;
        let token = ctx.header.authorization;
       
        if(!token)  return  {code:-101,mssage:"no login,miss is token",status:false};
        try {
            let res =  jwt.verify(token,ctx.config("signed"));
            if(res._timeOut_- new Date().getTime()<0) return   {code:-401,mssage:"no login,token is not invalid",status:false};
            ctx.state['userInfo'] = res;
        } catch (err) {
            return  {code:-401,mssage:"no login,token is error",status:false};
        }
       
        return null;
    }
    async utilRole(ctx){
        var {uid,isAdmin} = ctx.state.userInfo;
        if(isAdmin==1) return null;//如果是超级管理用户直接跳过；

        var urlAuth = ctx.path.replace(/(\/)?$/,"/");
        var roleId =await  ctx.model.table("tk_role as r").field("r.id")
        .join({table:"tk_user_role as ur",join:"right",on:"ur.r_id=r.id"}).where({"ur.u_id":uid,"r.status":1}).select();
        if(!roleId|| !roleId.length){
             return {status:false,mssage:"你无权限操作",code:-404};
        }
        roleId = roleId.map(itme=>itme.id);
        var resAuth =await  ctx.model.table("tk_auth as a").field("a.url")
        .join({table:"tk_role_auth as ra",join:"right",on:"a.id=ra.a_id"}).where({"ra.r_id":["in",roleId],"a.url":urlAuth,"a.status":1}).findOne();
       
        if(resAuth&&resAuth.url){
            return null;
        }
        return {status:false,mssage:"你无权限操作",code:-404};
    }

    // 装饰 用户拦截
    isUser(){
        let cthis = this;
        return (target,value,dec)=>{
            let fn = dec.value;
            dec.value = async (ctx,next,_this)=>{
                if(!ctx.request) return;
                let res = await cthis.utilUser(ctx);
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
                var res = await cthis.utilRole(ctx);
                if(res) return ctx.body = await res;
                return await fn.call(_this,ctx,next,_this);
            }
        }
    }
}
export default new index();