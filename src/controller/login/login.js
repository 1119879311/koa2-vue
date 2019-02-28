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
            let userInfo = await ctx.model.table("tk_user").where({name: name, password: password}).findOne();
            if (!userInfo) return ctx.body = await {code: -101,status:false, mssage: "username or password is error"};
            if(userInfo.status!==1)  return ctx.body = await {code: -101,status:false, mssage: "you number is forbidden login"};
            let token = await jwtAuth.jwtSign({name, uid: userInfo.id});
            ctx.body = await {token: token, username: name, uid: userInfo.id,status:true};
        } catch (error) {
            ctx.body = await {status:false,mssage:"login is fail",code:-101};
        }
      
    }
}