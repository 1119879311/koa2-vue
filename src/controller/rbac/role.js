import {Controller, POST, GET} from "../../lib/router";
import base from "../base";
import logicRole from "../../logic/role";


@Controller("/rbac/role")
export  default class extends base {
    constructor() {
        super();
    }

    @GET("/")
    async index(ctx,next){
        var {id,status} = ctx.request.query;
        try {
            if(id){
                var res =await ctx.model.table("tk_role").where({id,status}).findOne();
            }else{
                  var res = await ctx.model.table("tk_role as r").where({status}).select();
            }
            return  ctx.body =await ctx.success({mssage:"select is success",data:res});
        } catch (error) {
            return  ctx.body =await ctx.error(error);              
        }
       
    }
    @POST("/add")
    async add(ctx,next){
        var { name,title,status=1,sort=100,pid=1} = ctx.request.body;
        // 验证数据
        var validRes = await logicRole.veryRole({name,title});
        if (validRes) return ctx.body = await ctx.error(validRes);
        var options = {
            name,title,status,sort,pid,
            createtime:new Date().getTime(),
            updatetime:new Date().getTime()
        }
       
        try {
            var resInsert =await ctx.model.table("tk_role").thenAdd(options,{name,title,_logic: 'OR'})
         
            if(resInsert.type=="exist"){
                return  ctx.body =await ctx.error("name or title  is exist");  
            }
            return  ctx.body =await ctx.success("add is success")
        } catch (error) {
            return  ctx.body =await ctx.error(error); 
        }
      

    }
    @POST("/update")
    async update(ctx,next){
        var {id, name,title,status=1,pid=1,sort} = ctx.request.body;
        // 数据验证
        var validRes = await logicRole.veryRole({name,title});
        if (validRes) return ctx.body = await ctx.error(validRes); 

        var options  = { id, name,title,status,pid,sort, updatetime:new Date().getTime() };
        try {
            var res = await ctx.model.table("tk_role").where({id})
            .thenUpdate(options,{id:["!=",id],__complex:{name:name,title:title,_logic: 'OR'}});
            
            if(res.type=="exist"){
                return  ctx.body =await ctx.error("name or title  is exist"); 
            }
            return  ctx.body =await ctx.success("update is success");

        } catch (error) {
            return  ctx.body =await ctx.error(error);
        }
    

    }
     //删除
     @POST("/delete")
     async delete(ctx,next){
         var {id} = ctx.request.body;
         if(!id){
             return ctx.body = await {status:false,code:401,msg:"roleId  is required"}
         }
          try {
                //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
            var resfind = await ctx.model.table("tk_role").where({id,status:2}).findOne();
            if(!resfind) return ctx.body = await {code:-101, status:false,mssage:"正常状态无法删除",data:""};
            
            var resU =  await ctx.model.table("tk_user_role").where({"r_id":id}).buildSql().delete();
            var resR =  await ctx.model.table("tk_role_auth").where({"r_id":id}).buildSql().delete();
            var resT =   await ctx.model.table("tk_role").where({id}).buildSql().delete();
             // 执行事务（原子性）：
             await ctx.model.transaction([resU,resR,resT]);
             return  ctx.body =await ctx.success("detele is success");
         } catch (error) {
            return ctx.body  = await {code:-101,status:false,mssage:error||"server is error"};
         }
     }

    //  更新状态
    @POST("/swtich")
    async switch(ctx,next){
        var {data=[]} = ctx.request.body;
        try {
          var res =await ctx.model.table("tk_role").updateMany(data,{key:"id"});
          return  ctx.body =await ctx.success("update is success");
        } catch (error) {
           return  ctx.body =await ctx.error(error);            
        }
    }
    //分配权限
    @POST("/assginAuth")
    async assginRole(ctx,next){
        var {id,authArrId={}} = ctx.request.body;
        if(Object.prototype.toString.call(authArrId)=="[object Object]"){
            authArrId = Object.values(authArrId);
        }
        if(!id|| !Array.isArray(authArrId)){
           return  ctx.body =await ctx.error("roleid  is required or authArrId type is array");            
        }

        try {
            // 先删除原来的auth
            var sqlArr = [await ctx.model.table("tk_role_auth").where({r_id:id}).buildSql().delete()];
            // 如果有添加auth
            if(authArrId&&authArrId.length){
                var addData = authArrId.map(itme=>{return {a_id:itme,r_id:id} });
                var addSql =await ctx.model.table("tk_role_auth").buildSql().add(addData);
                sqlArr.push(addSql);
            }
             // 执行事务（原子性）：
            await ctx.model.transaction(sqlArr);
            return  ctx.body =await ctx.success("分配成功");
        } catch (error) {
              return  ctx.body =await ctx.error(error); 
            
        }
    }


}