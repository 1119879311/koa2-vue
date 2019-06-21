const {Controller,POST} = imports("Lib/router")
const { md5 } = imports("util/heper")
const userAuth = imports("Controller/admin/user_base");

@Controller("/userCenter")
class index extends userAuth{

    @POST("/modifypwd") //修改当前登录用户的信息
    async modifypwd(ctx,next){
        let {password,checkPass} = ctx.request.body;
        let {userId} = ctx.state.userInfo
        if(!password||(password!=checkPass)) return ctx.body =  ctx.send({errmsg:"Two passwords are different"});       
        var data = {password:md5(password)};
        try {
             await ctx.Model.update({table:"tk_user",where:{id:userId},values:data});
            ctx.body = await ctx.success("update is success")
        } catch (error) {
            return ctx.body =  ctx.error('server is error');
        }
    }

}
module.exports = index;