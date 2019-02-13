import {Controller, GET, POST} from "../../util/router_decorator";
import base from "../base";
import logicRole from "../../logic/role";
import roleAuthModel from "../../model/tk_role_auth";
import roleModel from "../../model/tk_role";

@Controller("/rbac/role")
export  default class extends base {
    constructor() {
        super();
    }

    @GET("/")
    async index(ctx,next){
        var {id,pageNum,pageSize} = ctx.request.query;
        if(id){
            var res =await ctx.model.table("tk_role").where({id}).findOne();
            // res?res["user_role"]=await URModel.getRole(id):res;
            ctx.body = await { code:200, state:true, mssage:"select add success",result:res}
        }else{
            ctx.body = await ctx.model.table("tk_role").pageSelect(pageNum,pageSize);

        }
    }
    @POST("/add")
    async add(ctx,next){
        var { name,title,status=1,sort=100,pid=1,authArr=[]} = ctx.request.body;
        var validRes = await logicRole.addRole({name,title});
        if (validRes) return ctx.body = await validRes;
        var options = {
            name,title,status,sort,pid,
            create_time:new Date().getTime(),
            update_time:new Date().getTime()
        }
        var resInsert =await ctx.model.table("tk_role").thenAdd(options,{name,title,_logic: 'OR'})
        // if name or title is exits ,then add is fail...
        if(resInsert.type=="exist"){
            return ctx.body = await  ({code:-101,  state:false,mssage:"name or title  is exist",result:""});
        }
        //add role handleAction
        await  roleAuthModel.addAuth(resInsert.id,authArr||[])
        return this.body = await ({code:200,  state:true,mssage:"resInsert",result:""});

    }
    @POST("/edit")
    async edit(ctx,next){
        var {id, name,title,status=1,sort=100,pid=1,authArr=[]} = ctx.request.body;
        var options  = {
            id, name,title,status,
            sort:data.sort||100,
            pid:pid||1,
            create_time:new Date().getTime(),
            update_time:new Date().getTime()
        }
        options.pid = options.pid==0?1:options.pid

        var roleid =await ctx.model.table("tk_role").field("id").where({id:id}).findOne();
        if(!roleid.id) return  ctx.body = await  ({code:-101,  state:false,mssage:"no exist role",result:""});

        var roleInfo = await ctx.model.table("tk_role").where({id:["!=",id],__complex:{name:name,title:title,_logic: 'OR'}}).findOne();
        if(roleInfo.id) return ctx.body = await({code:-101,  state:false,mssage:"name or title  is exist",result:""});
        var updataRes = await ctx.model.table("tk_role").where({id}).update(options);

        await  roleAuthModel.addAuth(roleInfo.id,authArr||[])
        this.body = await {code:200,  state:true,mssage:"edit is success",result:updataRes};

    }

    @POST("/switch")
    async switch(ctx,next){
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
                var idArrs =  await ctx.model.table("tk_role").field('id').where({name:["!=","superAdmin"],id:["in",switchdata],status:0}).select();
                if(!idArrs|| !idArrs.length) return ctx.body = await   {code:200,state:true,mssage:""};
                idArrs = idArrs.map(itme=> itme.id);
                console.log(idArrs)
                var res = await roleModel.delRole(idArrs);
                return  ctx.body = await   {code:200,state:true,mssage:res}
                break;
            case "1":
            case "2":
                status = status=="1"?1:0;
                console.log(status)
                switchdata = switchdata.map(itme=> { return {id:itme,status:status} })
                console.log(switchdata)
                var res =await  ctx.model.table("tk_role").updateMany(switchdata,{"key":"id"});
                return  ctx.body = await  {code:200,state:true,mssage:res}
        }
        return ctx.body = await  {code:-104,mssage:"miss options or options is error"}
    }

}