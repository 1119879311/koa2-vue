import jwt from "jsonwebtoken";
import { signed } from "../config";

 class index{
    static utilUser(ctx){
        let token = ctx.header.authorization;
        if(!token)  return  {code:-101,msg:"miss is token"};
        try {
            let res =  jwt.verify(token,ctx.config("signed"));
            if(res._timeOut_- new Date().getTime()<0) return   {code:-104,msg:"token is not invalid"};
            ctx.state['userInfo'] = res;
        } catch (error) {
            return  {code:-104,msg:"token is error"};
        }
        return null;
    }


    signed(data={},signed=signed){
        Object.assign(data, {_timeOut_: new Date().getTime() + (1000*60 * 60*24)});
        return jwt.sign( data, signed);
    }
    isUser(){
        let cthis = this;
        return (target,value,dec)=>{
            let fn = dec.value;
            dec.value = async (ctx,next,_this)=>{
                if(!ctx.request) return;
                let res =  cthis.constructor.utilUser(ctx);
                if(res) return ctx.body = await res;
                await fn.call(_this,ctx,next,_this);
            }
        }
    }
    isRoleAuth(){
        let cthis = this;
        return (target,value,dec)=>{
            let fn = dec.value;
            dec.value = async (ctx,next,_this)=>{
                  if(!ctx.request) return;
                var res =  cthis.constructor.utilUser(ctx);
                if(res) return ctx.body = await res;
                await fn.call(_this,ctx,next,_this);
            }
        }
    }
}
export default new index();