import {Controller, POST,GET } from "../../util/router_decorator";
import base from "../base";
import logicAuth from "../../logic/auth";


@Controller("/rbac/auths")
export default class auth extends base{
    @GET("/")
    async get(ctx,next){
        var  {status,id} = ctx.request.query;
        var where =status? {status}:{};
        if(id){
           var res = await ctx.model.table("tk_auth").where([where,{id}]).findOne();
           var authGrup =await ctx.model.table("tk_auth").where(where).field("g_name").group("g_name").select();
           res?res["authGrup"] = authGrup:'';
           return  ctx.body = await {code:200,status: true,mssage:"find is success",result:res};  
        }
        var res = await ctx.model.table("tk_auth as a").where(where).select();
        var resObj = [];
        res.forEach(element => {
            var resItme =  resObj.filter(itme=>itme.nameGroup==element.g_name);
            if(!resItme.length){
                resObj.push({"nameGroup":element.g_name,data:[element]});
                return;
            };
            resItme[0]["data"].push(element);
        });
        ctx.body =await {code:200,status: true,mssage:"find is success",result:resObj};  


    }

    @POST("/add")
    async add(ctx,next){
        var { name,url,status=1,g_name="默认分组",pid=1} = ctx.request.body;
        // var res=g_id==1?1: await ctx.model.table("tk_auth_group").where({"gid":g_id}).findOne();
        // if(!res) return ctx.body = await {code:"-1",status:false,mssage:"no auth group",result:""}
        var validRes = await logicAuth.addAuth({name,url,g_name});
        if (validRes) return ctx.body = await validRes;
        var options = {
            name,url,status,g_name,
            create_time:new Date().getTime(),
            update_time:new Date().getTime()
        }
        var resInsert =await ctx.model.table("tk_auth").thenAdd(options,{name,url,_logic: 'OR'})
        if(resInsert.type=="exist"){
            return ctx.body = await  ({code:-101,  state:false,mssage:"name or url  is exist",result:""});
        }
        return ctx.body = await  ({code:200,  state:true,mssage:"add is success",result:""});
    }

    @POST("/edit")
    async edit(ctx,next){
        var { name,url,status=1,g_name="默认分组",pid=1} = ctx.request.body;

    }
}