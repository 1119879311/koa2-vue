import {Controller, POST, GET} from "../../lib/router";
import base from "../base";
@Controller("/rbac/auth")
export default class auth extends base{
    @GET("/")
    async index(ctx,next){
        var res = ctx.model.table("tk_auth_muen").select();
        ctx.body = await [{id:1,componet:"systemPage",is_muen:2,parent_id:0},{id:2,componet:"userPage",is_muen:2,parent_id:1},{id:3,componet:"rolePage",is_muen:2,parent_id:1},{id:4,componet:"authPage",is_muen:2,parent_id:1}];
    }
    @POST("/add")
    async add(){
        var {name,componet,title,url,is_muen=1,is_state=1,parent_id=0} = ctx.request.body;
        ctx.model.table("tk_auth_muen").where().thenAdd({})
    }

    @POST("/del")
    async del(ctx,next){
        
    }
}
