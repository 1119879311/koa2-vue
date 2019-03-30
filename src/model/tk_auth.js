import model from "./model";
export default class index{
    // 查一个用户的所有权限
    static  async getPower(uid=""){
      var res = null;
      var roleId = await model.table("tk_role as r").field("r.id").where({"r.status":1,"ur.u_id":uid})
       .join({table:"tk_user_role as ur",join:"right",on:"r.id=ur.r_id"}).select();  
      if(roleId&&roleId.length){
        res= await model.table("tk_auth as r").field("identName").where({"r.status":1,"ra.id":["in",roleId]}).join({
              table:"tk_role_auth as ra",join:"right",on:"r.id=ra.r_id"
        }).select();
      }
      return res;
    }
   

}