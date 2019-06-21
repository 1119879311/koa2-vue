const {Controller,POST,GET} = imports("Lib/router")
const cateModel = imports("models/cate");
const {userAuth,roleAuth} = imports("Lib/permission")


@Controller("/cate")
class index{

    @GET("/") 
    async getAll(ctx,next){
        var {status} = ctx.request.query;
        ctx.body = await ctx.send( await cateModel.findAll(status));
    }
  

    @POST("/add")
    @userAuth()
    @roleAuth()
    async add(ctx,next){
        ctx.body = await ctx.send( await cateModel.add(ctx.request.body));   
    }

      //单个/批量修改状态
    /**
     * @param {object} ctx.request.body 
     * @param {array} data =>[{id:1,status:1}]
     * */
    @POST("/swtich")
    @userAuth()
    @roleAuth()
    async swtich(ctx,next){
        // var data =[{id:6,status:1},{id:8,status:1},{id:3,status:1}] 
        // var data =[{id:2,status:2},{id:3,status:2}] 
        var {data=[]} = ctx.request.body;  
        ctx.body =await ctx.send(await cateModel.swtich({data}))
    }

    //单个更新所有
    @POST("/update")
    @userAuth()
    @roleAuth()
    async update(ctx,next){
        var {id,name} = ctx.request.body;
        if(!id||!name)  return ctx.body = await ctx.error("id or name is required");
        ctx.body = await ctx.send( await cateModel.update(ctx.request.body));   
    }

    // 删除一个
    @POST("/delete")
    @userAuth()
    @roleAuth()
    async del(ctx,next){
    //   var {id} = ctx.request.body;
      var {id} = ctx.request.body;
      ctx.body= await ctx.send( await cateModel.del(id))
    }
    

}
module.exports = index;