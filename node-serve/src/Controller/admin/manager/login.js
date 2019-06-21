const {Controller,POST} = imports("Lib/router")
const { md5}  = imports("util/heper");
const { expiresIn}  = imports("Config");
const TOKENS = imports("util/utilToken")

@Controller()
class index{

    @POST("/login") 
    async findUser(ctx,next){
        var { name,password } = ctx.request.body; 
        if(!name||!password) return ctx.body = await ctx.error("name or passord is must require")
        var res = await ctx.Model.findOne({table:"tk_user",where:{name,password:md5(password)}});
        if(!res){ //用户是否存在
            return ctx.body = await ctx.error("no user")
        }
        if(res.status!=1&& res.isRoot!=1){ //用户是否启用(超级用户除外)
            return ctx.body = await ctx.error("your number is forbbin is login")
        }
        //签发token
        var data = {isRoot:res.isRoot,username:res.name,userId:res.id,expiresIn:new Date().getTime()+expiresIn};
        var token =await TOKENS.Set(data);
        data["token"] =token;
        ctx.body = await ctx.success({data});
    }

}
module.exports = index;