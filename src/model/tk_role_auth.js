import model from "./model";
export default class index{
    static async getAuth(uid=""){
        var where = uid?{"u.id":uid}:"";
        var resRole = model.table("tk_role_auth ra").field("u.id as user_id,r.id as role_id,r.name as role_name,r.title as role_title,r.pid as role_pid").join([
            {table:"tK_role r",join:"right",on:"r.id=ur.r_id"},
            {table:"tK_user u",join:"left",on:"u.id=.ur.u_id"}
        ]).where(where).pageSelect();
        return await resRole
    }
    static  async  addAuth(r_id="",auth_id=['']){
        if(!r_id||Object.prototype.toString.call(auth_id)!=='[object Array]') {return false};
        var roleId =await model.table("tk_role").field("id").where({id:r_id}).findOne();
        if(!roleId||!roleId.id) {return false};
        var authId = await model.table("tk_auth").field("id").where({id:["in",auth_id]}).select();
        var role_auth = await model.table("tk_role_auth").where({r_id:r_id}).select();
        role_auth = role_auth.map(itme=>itme.a_id);
        authId = authId.map(itme=> itme.id);
        //找出新添加的role
        var  addAuthId= [];
        authId.map((x)=>{if(role_auth.indexOf(x)==-1){addAuthId.push({r_id:r_id,a_id:x});} });

        // 找出要删除的auth
        var  deleteAuthId=role_auth.filter((x)=>{if(authId.indexOf(x)==-1) return x; });
        if(addAuthId.length>0){
            var resAddRole =  await model.table("tk_role_auth").add(addAuthId);
        }
        if(deleteAuthId.length>0){
            var reDelRole =  await model.table("tk_role_auth").where({r_id:r_id,a_id:["in",deleteAuthId]}).delete();
        }
        return {roleId:roleId,role_auth:role_auth,addAuthId:addAuthId,deleteAuthId:deleteAuthId};
    }
}