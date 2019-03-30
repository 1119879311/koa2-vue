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
}