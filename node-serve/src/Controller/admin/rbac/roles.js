const {Controller,POST,GET} = imports("Lib/router")
const roleModel = imports("models/role");
const roleLogic = imports("logic/role");
const roleBase = imports("Controller/admin/role_base")

// 该模块属于权限管理的角色模块，所有请求需要授权

@Controller("/role")
class index extends roleBase{


    /**获取单个、所有角色
     * @param body {  id,status}
     *@param  return {code,mssage/errmsg,data,status} 
    */
    @GET("/")
    async findUser(ctx,next){
        let {id,status} = ctx.request.query;
        ctx.body = await ctx.send( await roleModel.findUser(id,status))
      
    }

    /**添加 角色
     * @param POST /role/add
     * @param body {  name,title,status=1,pid=1,sort}
    * @param return {code,mssage/errmsg,data,status}
     **/ 

    @POST("/add") 
    async add(ctx,next){
        var { name,title} = ctx.request.body;
        // 验证数据
        var validRes = await roleLogic.veryRole({name,title});
        if (validRes) return ctx.body = await ctx.error(validRes);
        ctx.body =await ctx.send(await roleModel.add(ctx.request.body))
       
    }
    /**修改角色
     * @param POST /role/update
     * @param body { id, name,title,status=1,pid=1,sort}
     * @param return {code,mssage/errmsg,data,status}
     **/ 
    @POST("/update") 
    async update(ctx,next){
        var {id, name,title,status=1,pid=1,sort} = ctx.request.body;
        // 数据验证
        if(!id) return ctx.body =await ctx.error("id is must required"); 
        var validRes = await roleLogic.veryRole({name,title});
        if (validRes) return ctx.body = await ctx.error(validRes); 
        ctx.body =await ctx.send(await roleModel.update(ctx.request.body))

    }
    /**删除角色
     * @param POST /role/del
     * @param body { id}
     * @param return {code,mssage/errmsg,data,status}
     **/ 
    @POST("/delete")  //删除role
    async delete(ctx,next){
        let {id} = ctx.request.body;
        if(!id) return  ctx.body =await ctx.error("id  is required"); 
        ctx.body =await ctx.send(await roleModel.delete(id))
      
    }

    /**单个/批量修改状态
     * @param {object} ctx.request.body 
     * @param {array} data =>[{id:1,status:1}]
     * @param return {code,mssage/errmsg,data,status}    
     * */
    @POST("/swtich")
    async swtich(ctx,next){
        var {data} = ctx.request.body;
        ctx.body= await ctx.send( await roleModel.switch(data) )
    }


     /**给角色分配权限行为
     * @param POST /manager/assginRole
     * @param {number} id 
     * @param {array} authArrId [1,2] or [{id,1,id:2}]
     * @param return {code,mssage/errmsg,data,status}   
     **/ 
    @POST("/assginAuth")
    async assginAuth(ctx,next){
        var {id,authArrId} = ctx.request.body;
        if(Object.prototype.toString.call(authArrId)=="[object Object]"){
            authArrId = Object.values(authArrId);
        }
        if(!id|| !Array.isArray(authArrId)){
            return  ctx.body =await ctx.error("id  is required or authArrId type is array")
        }
        ctx.body =await ctx.send(await roleModel.assginAuth(id,authArrId))   
    }
   
}
module.exports = index;