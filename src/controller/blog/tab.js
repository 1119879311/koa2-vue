import {Controller, POST, GET} from "../../util/router_decorator";
import userAuth from "../../util/auth_decorator";
@Controller("/blog/tab")
class tab{
    // 查询
    @GET("/")
    async  index(ctx,next){
        var {status} = ctx.request.query;
        var where = {};
        if(status) Object.assign(where,{status});
        var res = await ctx.model.clearOtions().table("tk_tab").where(where).select();
        if(res.error){
           return ctx.body = await res;
        }
        ctx.body = await {status:true,data:res,mssage:"select is success"};
    }
    // 添加
    @POST("/add")
    async add(ctx,next){
        var {name,status = 1} = ctx.request.body;
        if(!name){
            return ctx.body = await {status:false,code:401,msg:"name is required"}
        }
        var resInsert =await ctx.model.table("tk_tab").thenAdd({
        name,status,create_time:new Date().getTime(),
        },{name});
        if(resInsert.type=="exist"){
            return ctx.body = await  ({code:-101,  status:false,mssage:"name is exist",data:""});
        }else if(resInsert.type=="add"){
            return ctx.body = await ({code:200,status:true,mssage:"add is success",data:resInsert.id})
        }
        ctx.body = await resInsert;
    }
    //更新
    @POST("/update")
    async update(ctx,next){
        var {id,name,status = 1} = ctx.request.body;
        if(!id||!name){
            return ctx.body = await {status:false,code:401,msg:"id or name is required"}
        }
        var res = await ctx.model.table("tk_tab").where({id}).thenUpdate({name,status},{id:["!=",id],name})
        if(res.type=="exist"){
            return ctx.body = await  ({code:-101, status:false,mssage:"name is exist",data:""});
        }else if(res.type=="update"){
            return ctx.body = await ({code:200,status:true,mssage:"update is success",data:""})
        }
        ctx.body = await res;
    }
    //单个/批量修改状态
    @POST("/swtich")
    async swtich(ctx,next){
        var {data=[]} = ctx.request.body;
        var res =await ctx.model.table("tk_tab").updateMany(data,{key:"id"});
        if(res&&res.error){
            return ctx.body = await res;
        }
        return ctx.body = await ({code:200,status:true,mssage:"update is success",data:""})
    }
    //删除
    @POST("/delete")
    async delete(ctx,next){
        var {id} = ctx.request.body;
        if(!id){
            return ctx.body = await {status:false,code:401,msg:"id  is required"}
        }
        //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
        var resfind = await ctx.model.table("tk_tab").where({id,status:2}).findOne();
        if(!resfind) return ctx.body = await {code:-101, status:false,mssage:"detele is fail",data:""};
        if(resfind&&resfind.error) return ctx.body = await resfind;
         // 先删除中间表tk_tab_article
         try {
           var resR =  await ctx.model.table("tk_tab_article").where({"t_id":id}).delete();
           var resT =   await ctx.model.table("tk_tab").where({id}).delete();
           if((resR&&resR.error) || (resT&&resT.error)){
                return ctx.body = await {code:-101, status:false,mssage:"detele is fail",data:""};
           }
           return ctx.body = await ({code:200,status:true,mssage:"detele is success",data:""})
        } catch (error) {
            console.log(error)
            return ctx.body = await  ({code:500, status:false,mssage:"server is error",data:""});
        }
    }


}