import {Controller, POST, GET} from "../../lib/router";
import logicUser from "../../logic/user";
import jwtAuth from "../../util/auth_decorator";
@Controller("/login")
export default class {

    @POST("/")
    async login(ctx, next) {
        let {name, password} = ctx.request.body;
        let logicRes = await logicUser.login({name, password});
        if (logicRes) return ctx.body = await logicRes;
        try {
            let userInfo = await ctx.model.table("tk_user").where({name, password: ctx.heper.md5(password)}).findOne();
            if (!userInfo) return ctx.body = await {code: -101,status:false, mssage: "username or password is error"};
            //超级用户无限制    
            if(userInfo.isAdmin!=1){
                if(userInfo.status!==1){
                    return  ctx.body =await ctx.error("you number is forbidden login");  
                }
            }
            let token = await jwtAuth.jwtSign({name, uid: userInfo.id,isAdmin:userInfo.isAdmin});
            return  ctx.body =await ctx.success({mssage:"login is success",data:{token,username:name,userId:userInfo.id}})
        } catch (error) {
            return  ctx.body =await ctx.error("login is fail");
        }
      
    }
}