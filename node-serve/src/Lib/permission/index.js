let { codeState } =imports("Middleware/ctxbody");
const TOKENS = imports("util/utilToken")


let utilUser = async (ctx)=>{
    if(!ctx.request) return;
    let token =await ctx.header.authorization;
    if(!token)  return  {code:codeState["NoToken"],errmsg:"no login,miss is token",status:false};
    try {
        let res = await TOKENS.Get(token);
        ctx.state['userInfo'] = res["data"];
        ctx.set({"tokenField":"token","tokenValue":token});
    } catch (err) {
        return  {code:codeState["NoToken"],errmsg:"no login,token is expired",status:false};
    }
    return null;
}

let utilRole =async (ctx)=>{
    // return null;
    var {userId,isRoot} = ctx.state.userInfo;
    if(isRoot==1) return null;//如果是超级管理用户直接跳过；
    var urlAuth = ctx.path.replace(/(\/)?$/,"/");
    var roleId = await ctx.Model.select({table:"tk_role as r",field:"r.id",where:{"ur.u_id":userId,"r.status":1},
          join:{table:"tk_user_role as ur",join:"right",on:"ur.r_id=r.id"}})
    if(!roleId|| !roleId.length) return {status:false,errmsg:"your request no auth",code:codeState["NoAuth"]};
    roleId = roleId.map(itme=>itme.id);
    var resAuth = await ctx.Model.findOne({table:"tk_auth as a",field:"a.url",where:{"ra.r_id":["in",roleId],"a.url":urlAuth,"a.status":1},
        join:{table:"tk_role_auth as ra",join:"right",on:"a.id=ra.a_id"}});
    if(resAuth&&resAuth.url) return null;
    return {code:codeState["NoAuth"],errmsg:"your request no auth",status:false}
}

const userAuth = ()=>{
    return (target,value,dec)=>{
        let fn = dec.value;
        dec.value = async (ctx,next,_this)=>{
            if(!ctx.request) return;
            let res = await utilUser(ctx);
            if(res) return ctx.body = await res;
            await fn.call(target,ctx,next,_this);
        }
    }
}

const roleAuth = ()=>{
    return (target,value,dec)=>{
        let fn = dec.value;
        dec.value = async (ctx,next,_this)=>{
            if(!ctx.request) return;
            let res = await utilRole(ctx);
            if(res) return ctx.body = await res;
            await fn.call(target,ctx,next,_this);
        }
    }
}

module.exports = {
    userAuth,roleAuth,utilUser,utilRole
}


