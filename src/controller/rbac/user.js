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
         if(id){
             var res =await ctx.model.table("tk_user").noField("password").where({id}).findOne();

             res?res["user_role"]=await URModel.getRole(id):res;
             
             ctx.body = await { code:200, state:true, mssage:"select add success",result:res}
         }else{
             var res= await ctx.model.table("tk_user").noField("password").pageSelect(pageNum,pageSize);
            res["status"] = true;
            ctx.body = await res;

         }


    }
    @GET("/search")
    async search(ctx,next){

    }

    @POST("/add")
    async add(ctx,next){
        var {name,password,status,contact,roleArr} =  ctx.request.body;
        var validRes = await logicUser.addUser({name,password,contact});
        if (validRes) return ctx.body = await validRes;
        var options  = {
            name:name,
            password:password,
            contact:contact,
            token:ctx.heper.signRonder(48),
            status:status||1,
            createtime:new Date().getTime(),
            updatatime:new Date().getTime(),
        }

        var resInsert =await ctx.model.table("tk_user").thenAdd(options,{name,contact,_logic: 'OR'})
        // if name or contac is exits ,then add is fail...
        if(resInsert.type=="exist"){
            return ctx.body = await  ({code:-101,  state:false,mssage:"name or contact  is exist",result:""});
        }
        await URModel.addRole(resInsert.id,roleArr||[]);
        return ctx.body = await ({code:200,state:true,mssage:"add is success",result:resInsert.id})
    }

    @POST("/add")
    async put(ctx,next){
        var {id,name,password,contact,status,roleArr} =  ctx.request.body;
        if(!id) return ctx.body = await {code:-101,mssage:"id is must required"}
        var validRes = await logicUser.editUser({name,password,contact});
        if (validRes) return ctx.body = await validRes;
        var options  = {
            name,contact,
            status:status||1,updata_time:new Date().getTime()
        }
        //Prevent password is empty to Be modified;
        if(password&&password.trim()){
            options["password"] = ctx.heper.md5(password)
        }
        //find userid if exist
        var userid =await ctx.model.table("tk_user").field("id").where({id}).findOne();
        if(!userid||!userid.id) return  ctx.body = await ({code:-101,  state:false,mssage:"no user",result:""});

        var userInfo = await ctx.model.table("tk_user").where({id:["!=",id],__complex:{name:name,contact:contact,_logic: 'OR'}}).findOne();
        if(userInfo&&userInfo.id) return  ctx.body = await ({code:-101,  state:false,mssage:"name or contact  is exist",result:""});

        var updataUserRes = await ctx.model.table("tk_user").update(options,{where:{id}});
        roleArr = roleArr.length?roleArr:['']
        await URModel.addRole(userid.id,roleArr);
        ctx.body = await {code:200,  state:true,mssage:"edit is success",result:[]};

    }
    @POST("/switch")
    async delete(ctx,next){
         //1:open,2:off,0:del;
        var { status,switchdata } = ctx.request.body;
        var statusFlag = ["0","1","2"].indexOf(status)==-1?false:true;

        if(!Array.isArray(switchdata) && switchdata){
           var switchdata = [{id:switchdata}]
        }else if(!Array.isArray(switchdata)|| !switchdata.length || !statusFlag){
            return  ctx.body = await  {code:-104,mssage:"miss options or options is error"}
        }
        switchdata =  switchdata.filter(itme=> {return itme.id}).map(itme=>itme.id);
        switch (status) {
            case "0":
                var idArrs =  await ctx.model.table("tk_user").field('id').where({name:["!=","root"],id:["in",switchdata],status:0}).select();
                if(!idArrs|| !idArrs.length) return ctx.body = await   {code:200,state:true,mssage:""};
                idArrs = idArrs.map(itme=> itme.id);
                console.log(idArrs)
                var useRole = await ctx.model.table("tk_user_role").where({u_id:["in",idArrs]}).delete();
                var res =  await ctx.model.table("tk_user").where({name:["!=","root"],id:["in",idArrs],status:0}).delete();
                return  ctx.body = await   {code:200,state:true,mssage:res}
                break;
            case "1":
            case "2":
                status = status=="1"?1:0;
                console.log(status)
                switchdata = switchdata.map(itme=> { return {id:itme,status:status} })
                console.log(switchdata)
                var res =await  ctx.model.table("tk_user").updateMany(switchdata,{"key":"id"});
                return  ctx.body = await  {code:200,state:true,mssage:res}
        }
        return ctx.body = await  {code:-104,mssage:"miss options or options is error"}
    }


}