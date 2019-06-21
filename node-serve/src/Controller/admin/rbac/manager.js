const {Controller,POST,GET} = imports("Lib/router")
const userModel = imports("models/user");
const userLogic = imports("logic/user");
const roleBase = imports("Controller/admin/role_base")

// 该模块属于权限管理的用户模块，所有请求需要授权

@Controller("/manager")
class index extends roleBase{

    @GET("/")
    async findUser(ctx,next){
        let {id} = ctx.request.query;
        if(id){
            ctx.body = await ctx.send( await userModel.findOneUser(id))
        }else{
            ctx.body = await ctx.send( await userModel.findAllUser(ctx.request.query))
        }
      
    }

    /**
     * @param POST /manager/add
     * @param option { username,password,state}
     * @parma return 
     **/ 

    @POST("/add") //添加 user
    async add(ctx,next){
        var {name,password,contact} =  ctx.request.body;
        // 数据验证
        var validRes = await userLogic.addUser({name,password,contact});
        if (validRes) return  ctx.body =await ctx.error(validRes); 
        ctx.body =await ctx.send(await userModel.add(ctx.request.body))
       
    }
    
    @POST("/update") //更新 user (改name,state状态,password)
    async update(ctx,next){
        var {id,name,password,contact,status} =  ctx.request.body;
        // 数据验证
        if(!id) return ctx.body =await ctx.error("id is must required"); 
        var validRes = await userLogic.editUser({name,password,contact,status});
        if (validRes) return ctx.body =await ctx.error(validRes); 
        ctx.body =await ctx.send(await userModel.update(ctx.request.body))

    }

    @POST("/delete")  //删除 user
    async delete(ctx,next){
        let {id} = ctx.request.body;
        if(!id) return  ctx.body =await ctx.error("id  is required"); 
        ctx.body =await ctx.send(await userModel.delete(id))
      
    }
    /**单个/批量修改状态
     * @param {object} ctx.request.body 
     * @param {array} data =>[{id:1,status:1}]
     * */
    @POST("/swtich")
    async swtich(ctx,next){
        var {data} = ctx.request.body;
        ctx.body= await ctx.send( await userModel.switch(data) )
    }

    // 分配角色
     /**
     * @param POST /manager/assginRole
     * @param {number} id 
     * @param {array} roleArrId [1,2] or [{id,1,id:2}]
     **/ 
    @POST("/assginRole")
    async assginRole(ctx,next){
        var {id,roleArrId} = ctx.request.body;
        if(Object.prototype.toString.call(roleArrId)=="[object Object]"){
            roleArrId = Object.values(roleArrId);
        }
        if(!id|| !Array.isArray(roleArrId)){
            return  ctx.body =await ctx.error("id  is required or roleArrId type is array")
        }
        ctx.body =await ctx.send(await userModel.assginRole(id,roleArrId))   
    }
   
}
module.exports = index;