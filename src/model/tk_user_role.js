import model from "./model";
export default class{

    static async getRole(uid=""){
        var where = uid?{"u.id":uid,"r.status":1}:"";
        var resRole = model.table("tk_user_role ur")
        .field("u.id as user_id,r.id as role_id,r.name as role_name,r.title as role_title,r.pid as role_pid,r.status as role_staus")
        .join([
            {table:"tK_role r",join:"right",on:"r.id=ur.r_id"},
            {table:"tK_user u",join:"left",on:"u.id=.ur.u_id"}
        ]).where(where).select();
        return await resRole
     }

     static async getAuth(){
         
     }



}