const {Controller,POST,GET} = imports("Lib/router")
const tabModel = imports("models/tab");
const {userAuth,roleAuth} = imports("Lib/permission")


@Controller("/tab")
class index{

    @GET("/") 
    async getAll(ctx,next){
        var {status} = ctx.request.query;
        ctx.body = await ctx.send( await tabModel.findAll(status));
    }
  

    @POST("/add")
    @userAuth()
    @roleAuth()
    async add(ctx,next){
       ctx.body= await ctx.send( await tabModel.add(ctx.request.body) )
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
        var {data} = ctx.request.body;
        ctx.body= await ctx.send( await tabModel.switch(data) )
    }

    //单个更新所有
    @POST("/update")
    @userAuth()
    @roleAuth()
    async update(ctx,next){
        ctx.body= await ctx.send( await tabModel.update(ctx.request.body) )      
    }

    // 删除一个
    @POST("/delete")
    @userAuth()
    @roleAuth()
    async del(ctx,next){
        var {id} = ctx.request.body;
        ctx.body= await ctx.send( await tabModel.del(id) )
    }
    

}
module.exports = index;