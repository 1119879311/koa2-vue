import {Controller, POST, GET} from "../../lib/router";
import userAuth from "../../util/auth_decorator";
@Controller("/blog/tab")
export  default class{
    // 查询
    @GET("/")
    async  index(ctx,next){
        var {status} = ctx.request.query;
        var where =status==0?{}:{status};
        var res = await ctx.model.table("tk_tab").where(where).select();
        return  ctx.body =await ctx.success({data:res})
    }
    // 添加
    @POST("/add")
    @userAuth.isUser()
    @userAuth.isRoleAuth()
    async add(ctx,next){
        var {name,status = 1} = ctx.request.body;
        if(!name)  return  ctx.body =await ctx.error("name is required")
         try {
            var resInsert =await ctx.model.table("tk_tab").thenAdd({
                name,status,createtime:new Date().getTime(),
                },{name});
            if(resInsert.type=="exist"){
                return  ctx.body =await ctx.error("name is exist")
               
            }else if(resInsert.type=="add"){
                return  ctx.body =await ctx.success("add is success")
            }
            return  ctx.body =await ctx.error("add is fail")
            
         } catch (error) {
            return  ctx.body =await ctx.error(error)
         }  
    }
    //更新
    @POST("/update")
    @userAuth.isUser()
    @userAuth.isRoleAuth()
    async update(ctx,next){
        var {id,name,status = 1} = ctx.request.body;
        if(!id||!name) return  ctx.body =await ctx.error("id or name is required")
         try {
            var res = await ctx.model.table("tk_tab").where({id}).thenUpdate({name,status},{id:["!=",id],name})
            if(res.type=="exist"){
                return  ctx.body =await ctx.error("name is exist");
            }else if(res.type=="update"){
                return  ctx.body =await ctx.success("update is success")
            }  
            return  ctx.body =await ctx.error("update is fail")

         } catch (error) {
            return  ctx.body =await ctx.error(error)             
         }
        
    }
    //单个/批量修改状态
    @POST("/swtich")
    @userAuth.isUser()
    @userAuth.isRoleAuth()
    async swtich(ctx,next){
        var {data=[]} = ctx.request.body;
        try {
          var res =await ctx.model.table("tk_tab").updateMany(data,{key:"id"});
          return  ctx.body =await ctx.success("update is success");
        } catch (error) {
          return  ctx.body =await ctx.error(error);
        }
    }
    //删除
    @POST("/delete")
    @userAuth.isUser()
    @userAuth.isRoleAuth()
    async delete(ctx,next){
        var {id} = ctx.request.body;
        if(!id)  return  ctx.body =await ctx.error("id  is required");
         
        //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
        var resfind = await ctx.model.table("tk_tab").where({id,status:2}).findOne();
        if(!resfind) return  ctx.body =await ctx.error("detele is fail");  
        if(resfind&&resfind.error) return ctx.body = await resfind;
         // 先删除中间表tk_tab_article
         try {
           var resR =  await ctx.model.table("tk_tab_article").where({"t_id":id}).buildSql().delete();
           var resT =   await ctx.model.table("tk_tab").where({id}).buildSql().delete();
           await ctx.model.transaction([resR,resT]); 
           return  ctx.body =await ctx.success("detele is success");
        } catch (error) {
            return  ctx.body =await ctx.error(error);
        }
    }


}