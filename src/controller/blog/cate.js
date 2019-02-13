import {Controller, POST, GET} from "../../util/router_decorator";
import userAuth from "../../util/auth_decorator";
import heper from "../../util/heper";
@Controller("/blog/cate")
class cate{
    // 查询
    @GET("/")
    async index(ctx,next){
        var {status} = ctx.request.query;
        var where = {};
       
        if(status) where["status"] = status;
        var res = await ctx.model.clearOtions().table("tk_cate").where(where).select();
        if(res.error){
           return ctx.body = await res;
        }
        ctx.body = await {status:true,data:res,mssage:"select is success"};
    }
   
    @POST("/add")
    async add(ctx,next){
        var {name,pid=0,sort=100,status = 1} = ctx.request.body;
       
        if(!name){
            return ctx.body = await {status:false,code:401,msg:"name is required"}
        }
       
        var resInsert =await ctx.model.table("tk_cate").thenAdd({
            name,pid,sort,status,create_time:new Date().getTime(),
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
        var {id,name,pid=0,sort=100,status = 1} = ctx.request.body;
        
         if(!id||!name){
             return ctx.body = await {status:false,code:401,msg:"id or name is required"}
         }
        
         var res = await ctx.model.table("tk_cate").where({id}).thenUpdate({name,pid,sort},{id:["!=",id],name})
        
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
       
        if(!ctx.heper.isArray(data)||!data.length){
            return ctx.body = await  ({code:-101,  status:false,mssage:"data is array required",data:""});
        };
       
        if(data.length==1){ //单个(存在父子关系，切换父级，子级也要切换)
            var status =  data[0]['status'];
            var res = await ctx.model.table("tk_cate").field("id,status,pid").select();
           
            // 1.更新正常状态，需要检查是否有父级,且要为正常状态，如果处于禁用状态，子级无法更新为正常状态
            if(status==1){ //切换正常状态
                // 找父级
                var resPartFilter = ctx.heper.filterChrildId(res,"pid", "id",data[0]['pid'],true);
              
                var resSome = resPartFilter.some(itme=>itme.status==2);
               
                if(resSome){
                    return ctx.body = await  ({code:-101, status:false,mssage:"无法更新,父级处于禁用状态，子级无法开启正常",data:""});
                }
            }
           
            // 找子级
            var resFilter = ctx.heper.filterChrildId(res,"id", "pid",data[0]['id']);
           
            var resMap = resFilter.map(itme=>{return {id:itme,status} });
          
            data = [...resMap,{id:data[0].id,status}];
        }
        // 批量更新
        var res =await ctx.model.table("tk_cate").updateMany(data,{key:"id"});
        if(res&&res.error){
            return ctx.body = await res;
        }
        return ctx.body = await ({code:200,status:true,mssage:"update is success",data:""})
    }
     //删除
     @POST("/delete")
     async del(ctx,next){
        var {id} = ctx.request.body;
        if(!id){
            return ctx.body = await {status:false,code:401,msg:"id  is required"}
        }
        //先查是否存在适合的删除数据 (id,status = 2|停用状态)    
        var resfind = await ctx.model.table("tk_cate").where({id,status:2}).findOne();
        if(resfind) return ctx.body = await {code:-101, status:false,mssage:"删除失败,正常状态无法删除",data:""};
        
        var resChild = await ctx.model.table("tk_cate").field("id").where({pid:id,id,"_logic":"OR"}).select();
   
        if(resChild&&resChild.length>1){
           
            var delRRow = resChild.filter(itme=>itme.id==id);
          
            var pid = delRRow[0].pid?delRRow[0].pid:0;
           
            var updateData =  resChild.map(val=>{ if(itme.id!=id){ return {id:val.id,pid} } })
            // 批量更新子级
            
            var res =await ctx.model.table("tk_cate").updateMany(updateData,{key:"id"});
            if(res&&res.error){
                return ctx.body = await res;
            }
        }
        // 删除
       
        var resDel =  await ctx.model.table("tk_cate").where({id}).delete();
       
        if(resDel&&resDel.error){
            return ctx.body = await {code:-101, status:false,mssage:"detele is fail",data:""};
        }
        return ctx.body = await ({code:200,status:true,mssage:"detele is success",data:""})
     }
}