import {Controller, POST, GET} from "../../util/router_decorator";
import cateModel from "../../model/tk_cate";
import articleModel from "../../model/tk_article";
import tabModel from "../../model/tk_tab";


@Controller("/api/artcle")
export  default  class  {
    @GET('/')
    async index(ctx,next){
       var {id} = ctx.request.query;
       if(id){
         return  ctx.body = await articleModel.getArticleId({id});
       }
       ctx.body = await articleModel.getArticle({where:{"a.status":1}});
    }

    @GET("/:type")
    async type(ctx,next){
        var { type } = ctx.params;
        var {id} = ctx.request.query;
        switch (type) {
            case "cate":
                ctx.body = await ctx.heper.diGuiAdd(await cateModel.getGroup()) ;
                break;
            case "tab":
                if(id){
                     ctx.body = await articleModel.getArticleTabId({id});
                }else{
                    ctx.body = await tabModel.getGroup();
                }
                break;
            default:
                break
        
        }

    }

    @POST("/del")
    async delete(ctx,next){

    }

    @POST("put")
    async put(ctx,next){

    }

}