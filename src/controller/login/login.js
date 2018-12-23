import {Controller, POST} from "../../util/router_decorator"
import logicUser from "../../logic/user";
@Controller("/api/login")
export default class {

    @POST("/")
    async login(ctx, next) {
        let {name, password} = ctx.request.body;
        let logicRes = await logicUser.login({name, password});
        if (logicRes) return ctx.body = await logicRes;
        let userInfo = await ctx.model.table("tk_user").where({name: name, password: password,status:1}).findOne();
        if (!userInfo) return ctx.body = await {code: -101, msg: "username or password is error or you number is forbidden login"};
        let sign = await ctx.config("signed");
        let token = await ctx.heper.jwtSign({name, uid: userInfo.id}, sign);
        ctx.body = await {token: token, username: name, uid: userInfo.id};
    }


}