const {Controller,POST,GET} = imports("Lib/router")
const authModel = imports("models/auth");
const authLogic = imports("logic/auth");
const roleBase = imports("Controller/admin/role_base")

// 该模块属于权限管理的角色模块，所有请求需要授权

@Controller("/auth")
class index extends roleBase{


    /**获取所有权限行为
     * @param body {  id,status}
     *@param  return {code,mssage/errmsg,data,status} 
    */
    @GET("/")
    async find(ctx,next){
        let {status,roleId} = ctx.request.query;
        // 查询所有的权限行为
        var data = await authModel.findAll(status);
        // 根据角色id 刷选除对应的权限行为
        if(data&&data.length&&roleId){ 
           var roleAuth = await authModel.findRoleAuth(roleId);
        }
        ctx.body =await ctx.send({data,roleAuth})
      
    }

    /**添加 权限行为
     * @param POST /auth/add
     * @param body {name,identName,url,status,groupName}
    * @param return {code,mssage/errmsg,data,status}
     **/ 

    @POST("/add") 
    async add(ctx,next){
        var { name,identName,url} = ctx.request.body;
        var validRes = await authLogic.veryAuth({name,url,identName});
        if (validRes) return ctx.body = await ctx.error(validRes);
        ctx.body =await ctx.send(await authModel.add(ctx.request.body))
       
    }
    /**修改权限行为
     * @param POST /auth/update
     * @param body { id, name,identName,url,status,groupName}
     * @param return {code,mssage/errmsg,data,status}
     **/ 
    @POST("/update") 
    async update(ctx,next){
        var {id, name,identName,url} = ctx.request.body;
        if(!id) return  ctx.body =await ctx.error("id  is required"); 
       // 数据验证
        var validRes = await authLogic.veryAuth({name,url,identName});
       if (validRes) return ctx.body = await ctx.error(validRes);
       ctx.body =await ctx.send(await authModel.update(ctx.request.body))

    }
    /**删除权限行为
     * @param POST /auth/delete
     * @param body { id}
     * @param return {code,mssage/errmsg,data,status}
     **/ 
    @POST("/delete")  //删除role
    async delete(ctx,next){
        let {id} = ctx.request.body;
        if(!id) return  ctx.body =await ctx.error("id  is required"); 
        ctx.body =await ctx.send(await authModel.delete(id))
      
    }

    /**单个/批量修改状态
     * @param {object} ctx.request.body 
     * @param {array} data =>[{id:1,status:1}]
     * @param return {code,mssage/errmsg,data,status}    
     * */
    @POST("/swtich")
    async swtich(ctx,next){
        var {data} = ctx.request.body;
        ctx.body= await ctx.send( await authModel.switch(data) )
    }
   
}
module.exports = index;