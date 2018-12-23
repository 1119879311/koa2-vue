import model from "./model";
export default class index{
    constructor(){

    }
    // 删除角色
    static async delRole(r_id=[]){
        // 角色是否存在;
        if(!r_id||!r_id.length) {return false};
        var roleId =await ctx.model.table("tk_role").field("id").where({id:["in",r_id]}).find();
        if(!roleId.id) {return false};
        //2.删除user-role 的关系
        var reDelRole =  await ctx.model.table("tk_user_role").where({r_id:["in",r_id]}).delete();
        //3.删除该role_auth 的关系
        var reDelAuth =  await ctx.model.table("tk_role_auth").where({r_id:["in",r_id]}).delete();
        //4. 删除该角色的信息
        var resEnd = await ctx.model.table("tk_role").where({id:["in",r_id]}).delete();
        return await true;
    }
}