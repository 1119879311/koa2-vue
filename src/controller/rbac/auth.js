import {Controller, POST, GET} from "../../lib/router";
import base from "../base";
import logicAuth from "../../logic/auth";


@Controller("/rbac/auth")
export default class auth extends base{
    /**
     * 查找 auth
     */

    @GET("/")
    async get(ctx,next){
        /**
         * status {Nnmber} 1 or 2 状态
         * id {Nnmber} auth 的id
         * roleId {array} 角色的ID 查 一个角色的权限
         */
        var  {status,id,roleId} = ctx.request.query;
        var where =status? {status}:{};
        try {
            if(id){
                var res = await ctx.model.table("tk_auth")
                .where([where,{id}])
                .order("groupName")
                .findOne();
                return  ctx.body =await ctx.success({data:res});
             }
             var res = await ctx.model.table("tk_auth as a")
             .where({status})
             .order("groupName desc,id desc")
             .select();   

             if(res&&roleId){
                var resrole=  await ctx.model.table("tk_role_auth as ra")
                .field("a.groupName,ra.a_id")
                .where({"a.status":1,"ra.r_id":roleId})
                .join({table:"tk_auth as a",join:"left",on:"a.id=ra.a_id"})
                .select()
             }  
            return  ctx.body =await ctx.success({data:res,roleAuth:resrole});  
        } catch (error) {
            return  ctx.body =await ctx.error(error);  
        }

       
    }
    // 添加auth
    @POST("/add")
    async add(ctx,next){
        var { name,identName,url,status=1,groupName=""} = ctx.request.body;
        var validRes = await logicAuth.veryAuth({name,url,identName});
        if (validRes) return ctx.body = await ctx.error(validRes);
        var options = {
            name,identName,url,status,groupName,
            createtime:new Date().getTime(),
            updatetime:new Date().getTime()
        }
        try {
            var resInsert =await ctx.model.table("tk_auth")
            .thenAdd(options,{name,identName,url,_logic: 'OR'});

            if(resInsert.type=="exist"){
                return  ctx.body =await ctx.error("name or identName or url  is exist");          
            }
            return  ctx.body =await ctx.success("add is success");
        } catch (error) {
            return  ctx.body =await ctx.error(error);  
        }
       
    }

  
     //编辑
     @POST("/update")
     async update(ctx,next){
        var {id, name,identName,url,status,groupName} = ctx.request.body;
        
         if(!id){
             return ctx.body = await {status:false,code:401,msg:"id  is required"}
         }
        // 数据验证
         var validRes = await logicAuth.veryAuth({name,url,identName,groupName});
        if (validRes) return ctx.body = await ctx.error(validRes);

         try {
            var res = await ctx.model.table("tk_auth").where({id})
            .thenUpdate({name,identName,url,status,groupName,updatetime:new Date().getTime()},{id:["!=",id],__complex:{name,identName,url,_logic: 'OR'}});
            
            if(res.type=="exist"){
                return  ctx.body =await ctx.error("name or identName or url  is exist"); 
            }
            return  ctx.body =await ctx.success("update is success");
         } catch (error) {
            return  ctx.body =await ctx.error(error);  
         }
     }
    // 更新状态
     @POST("/swtich")
     async switch(ctx,next){
         /**
          * data {array} [a_id];
          */
         var {data=[]} = ctx.request.body;
         try {
           var res =await ctx.model.table("tk_auth").updateMany(data,{key:"id"});
           return  ctx.body =await ctx.success({mssage:"update is success",data:res});
         } catch (error) {
            return  ctx.body =await ctx.error(error); 
         }
     }
       //删除
    @POST("/delete")
    async delete(ctx,next){
        var {id} = ctx.request.body;
        if(!id){
            return  ctx.body =await ctx.error("id  is required"); 
        }
        try {
              //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
            var resfind = await ctx.model.table("tk_auth").where({id,status:2}).findOne();
            if(!resfind) return  ctx.body =await ctx.error("detele is fail"); 

            var resR =  await ctx.model.table("tk_role_auth").where({"t_id":id}).buildSql().delete();
            var resT =   await ctx.model.table("tk_auth").where({id}).buildSql().delete();
            // 执行事务（原子性）：
            await ctx.model.transaction([resR,resT]);
            return  ctx.body =await ctx.success({mssage:"detele is success",data:res});
       
        } catch (error) {
            return  ctx.body =await ctx.error(error); 
        }
    }
}