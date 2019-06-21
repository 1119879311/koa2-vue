const {Controller,POST,GET} = imports("Lib/router")
const postModel = imports("models/post");
const cateModel = imports("models/cate");
const tabModel = imports("models/tab");
const logicPost =imports("logic/post");
const {userAuth,roleAuth} = imports("Lib/permission")


@Controller("/post")
class index{

    @GET("/") 
    async getAll(ctx,next){
        let option = ctx.request.query;
        // 分类下的
        if(option.cateId){
          return  ctx.body = await ctx.send(await postModel.findCateAll(option));
        }
        // 标签下的
        if(option.tabId){
            return  ctx.body = await ctx.send(await postModel.findTabAll(option));
        }
        // 搜索下的
        if(option.search){
            return  ctx.body = await ctx.send(await postModel.findSearchAll(option));
        }
        // 所有的
        ctx.body = await ctx.send(await postModel.findAll(option));
    }

     /**
     * @param {object} options 
     * @param {string|unmber} id post 
     * @param {string|unmber} a_status post状态,0:忽略状态查询(查所有) 1：正常，2：禁用
     * @param {string|unmber} is_tab post的tab状态 0:忽略状态查询 1：正常，2：禁用
     * @param {Booleam} addRead 
     * 
     */

    @GET("/detail")
    async findOne(ctx,next){
        var option = ctx.request.query||{};
        // 数据校验
        // ......
        var res =  await postModel.findId(option);
        return ctx.body  = ctx.send(res)
    }

    // 统计分组article(根据cate|tab)
    @GET("/groupType")
    async type(ctx,next){
        var {type} = ctx.request.query;
        switch (type) {
            case "cate":
                     ctx.body  = await ctx.send(await cateModel.groupCate(ctx.request.query))               
                break;
            case "tab":
                     ctx.body  = await ctx.send(await tabModel.groupTab(ctx.request.query))
                break;  
            case "all":
                    ctx.body  = await ctx.send({data:{cate:(await cateModel.groupCate(ctx.request.query)).data,tab:(await tabModel.groupTab(ctx.request.query)).data}})
                 break;  
            default:
                    ctx.body  = await ctx.error("type is require")
                break;
            }
    }

    @POST("/add")
    @userAuth()
    @roleAuth()
    async add(ctx,next){
         // 数据校验
         var {title,content,cid,thumimg,remark,tabList=[]} = ctx.request.body;
         var resVery = await logicPost.veryAtricle({title,content,thumimg,remark,tabList});
         if (resVery)  return  ctx.body =await ctx.error(resVery);
         ctx.body = await ctx.send( await postModel.addPost(ctx.request.body));

    }

     
    /**单个/批量修改状态
     * @param {object} ctx.request.body 
     * @param {array} data =>[{id:1,status:1}]
     * */
    @POST("/swtich")
    @userAuth()
    @roleAuth()
    async swtich(ctx,next){
            var {data=[]} = ctx.request.body;
            ctx.body = await ctx.send( await postModel.updateSwitch(data))
    }
    //单个更新所有
    @POST("/update")
    @userAuth()
    @roleAuth()
    async update(ctx,next){
        // 数据校验
        var {id,title,content,thumimg,remark,tabList=[]} = ctx.request.body;
        if(!id) return  ctx.body =await ctx.error("id is required");
        var resVery = await logicPost.veryAtricle({title,content,thumimg,remark,tabList});
        if (resVery)  return  ctx.body =await ctx.error(resVery);
        ctx.body = await ctx.send( await postModel.updateAll(ctx.request.body))
    }

    // 删除一个post
    @POST("/delete")
    async del(ctx,next){
        var {id} = ctx.request.body;
        ctx.body = await ctx.send( await postModel.delete(id));
    }

     /**post 上传缩略图
     * */ 
    @POST("/uploadThum")
    @userAuth()
    @roleAuth()
    async uploadThum(ctx,next){
        ctx.body = await postModel.uploadThum(ctx);
    }

    /**post 上传富文本编辑器的图片/文件
     * */ 
    @POST("/uploadueimg")
    @userAuth()
    @roleAuth()
    async uploadUeImg(ctx,next){
        ctx.body = await postModel.uploadUeImg(ctx);
        
    }
    

}
module.exports = index;