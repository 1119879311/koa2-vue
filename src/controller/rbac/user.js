import {Controller, POST, GET} from "../../lib/router";
import base from "../base";
import URModel from "../../model/tk_user_role";
import logicUser from "../../logic/user";


@Controller("/rbac/user")
export  default class extends base {
     constructor(){
         super();
     }

    @GET("/")
    async index(ctx, next) {
         var {id,pageNum,pageSize} = ctx.request.query;
         try {
            if(id){
                var res =await ctx.model.table("tk_user as u").noField("password").where({"u.id":id}).findOne();
                console.log(await URModel.getRole(id))
                if(res){
                    res["user_role"] = await URModel.getRole(id)
                }
                return  ctx.body =await ctx.success({data:res});

            }else{
               var res =await ctx.model.table("tk_user as u").noField("password").field("group_concat(concat_ws('-',r.title,r.status) separator '，') as role")
               .join(["left join tk_user_role ur on ur.u_id =u.id","left join tk_role as r  on r.id = ur.r_id"])
                .group("u.id").limit([pageNum,pageSize]).select();

                var resCout = await ctx.model.table("tk_user").count();
               // 对用户的角色进行数组对象处理
                if(res&&res.length){
                   res.forEach(element => {
                       if(!element["role"]) return element["role"] = [];
                       element["role"] = element["role"].split('，').map(itme=>{
                           var val = itme.split("-");
                           return {name:val[0],status:val[1]}  
                       })
                   });
                }
                return  ctx.body =await ctx.success({count: resCout[0]['count'],data:res});   
            }
         } catch (error) {
             console.log(error)
            return  ctx.body =await ctx.error(error);        
         }
    }

    @POST("/add")
    async add(ctx,next){
        var {name,password,status=1,contact} =  ctx.request.body;
        // 数据验证
        var validRes = await logicUser.addUser({name,password,contact});
        if (validRes) return  ctx.body =await ctx.error(validRes); 

        var options  = { name,status,contact,
            password:ctx.heper.md5(password),
            token:ctx.heper.signRonder(48)+new Date().getTime(),
            createtime:new Date().getTime(),
            updatatime:new Date().getTime(),
        }
       try {
            var resInsert =await ctx.model.table("tk_user").thenAdd(options,{name,contact,_logic: 'OR'})
            // if name or contac is exits ,then add is fail...
            if(resInsert.type=="exist"){
                return  ctx.body =await ctx.error("name or contact  is exist"); 
            }
            return  ctx.body =await ctx.success("add is success");
       } catch (error) {
           return  ctx.body =await ctx.error(error); 
       }
          
    }

    @POST("/update")
    async put(ctx,next){
        var {id,name,password,contact,status} =  ctx.request.body;
        // 数据验证
        if(!id) return ctx.body =await ctx.error("id is must required"); 
        var validRes = await logicUser.editUser({name,password,contact,status});
        if (validRes) return ctx.body =await ctx.error(validRes); 

        var options  = {name,contact, status:status,updatatime:new Date().getTime() };
        //Prevent password is empty to Be modified;
        if(password&&password.trim()){
            options["password"] = ctx.heper.md5(password)
        }
       
        try {
            var res = await ctx.model.table("tk_user").where({id})
            .thenUpdate(options,{id:["!=",id],__complex:{name,contact,_logic: 'OR'}});
            
            if(res.type=="exist"){
                return  ctx.body =await ctx.error("name or contact  is exist"); 
            }
             return  ctx.body =await ctx.success("update is success");
        } catch (error) {
           return  ctx.body =await ctx.error(error);    
        }
    }


    @POST("/swtich")
    async swtich(ctx,next){
        var {data=[]} = ctx.request.body;
          try {
            await ctx.model.table("tk_user").updateMany(data,{key:"id"});
            return  ctx.body =await ctx.success("update is success");
          } catch (error) {
            return  ctx.body =await ctx.error(error); 
          }
    }
     //删除
     @POST("/delete")
     async delete(ctx,next){
         var {id} = ctx.request.body;
         if(!id) return  ctx.body =await ctx.error("id  is required"); 
          
          try {
                //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
            var resfind = await ctx.model.table("tk_user").where({id,status:2}).findOne();
           
            if(!resfind) return  ctx.body = await ctx.error("用户不存在或者处于正常状态无法删除");
         
            var resR =  await ctx.model.table("tk_user_role").where({"u_id":id}).buildSql().delete();
            var resT =   await ctx.model.table("tk_user").where({id}).buildSql().delete();
               // 执行事务（原子性）：
           var res= await ctx.model.transaction([resR,resT]);
          
            return  ctx.body =await ctx.success("detele is success");
         } catch (error) {
            return  ctx.body =await ctx.error(error); 
         }
     }
    //分配角色
    @POST("/assginRole")
    async assginRole(ctx,next){
        var {id,roleArrId} = ctx.request.body;
        if(Object.prototype.toString.call(roleArrId)=="[object Object]"){
            roleArrId = Object.values(roleArrId);
        }
        if(!id|| !Array.isArray(roleArrId)){
            return  ctx.body =await ctx.error("id  is required or roleArrId type is array")
        }
        try {
            // 先删除原来的role
            var sqlArr = [await ctx.model.table("tk_user_role").where({u_id:id}).buildSql().delete()];
            // 如果有添加role
            if(roleArrId&&roleArrId.length){
                var addData = roleArrId.map(itme=>{return {r_id:itme,u_id:id} });
                var addSql =await ctx.model.table("tk_user_role").buildSql().add(addData);
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