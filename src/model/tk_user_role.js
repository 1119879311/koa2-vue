import model from "./model";
export default class{

    static async getRole(uid=""){
        var where = uid?{"u.id":uid}:"";
        var resRole = model.table("tk_user_role ur").field("u.id as user_id,r.id as role_id,r.name as role_name,r.title as role_title,r.pid as role_pid").join([
            {table:"tK_role r",join:"right",on:"r.id=ur.r_id"},
            {table:"tK_user u",join:"left",on:"u.id=.ur.u_id"}
        ]).where(where).pageSelect();
        return await resRole
     }
     static  async  addRole(u_id="",role_id=['']){
         // 找出是否存在roleid
         if(!u_id||Object.prototype.toString.call(role_id)!=='[object Array]') {return false};
         var userid =await model.table("tk_user").field("id").where({id:u_id}).findOne();
         if(!userid||!userid.id) {return false};
         var roleId = await model.table("tk_role").field("id").where({id:["in",role_id]}).select();
         var user_role = await model.table("tk_user_role").where({u_id:u_id}).select();
         user_role = user_role.map(itme=>itme.r_id);
         roleId = roleId.map(itme=> itme.id);
         //找出新添加的role
         var  addRoleId= [];
         roleId.map((x)=>{if(user_role.indexOf(x)==-1){addRoleId.push({u_id:u_id,r_id:x});} });

         // 找出要删除的role
         var  deleteRoleId=user_role.filter((x)=>{if(roleId.indexOf(x)==-1) return x; });
         if(addRoleId.length>0){
             var resAddRole =  await model.table("tk_user_role").add(addRoleId);
         }

         if(deleteRoleId.length>0){
             var reDelRole =  await model.table("tk_user_role").where({u_id:u_id,r_id:["in",deleteRoleId]}).delete();
         }
         return {roleId:roleId,user_role:user_role,addRoleId:addRoleId,deleteRoleId:deleteRoleId};
     }

}