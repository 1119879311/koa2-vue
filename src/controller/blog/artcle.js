import {Controller, POST, GET} from "../../util/router_decorator";
import cateModel from "../../model/tk_cate";
import articleModel from "../../model/tk_article";
import tabModel from "../../model/tk_tab";


@Controller("/blog/artcle")
export  default  class  {
   
    @GET('/')
    async index(ctx,next){      
    /**
     * @param {Number} id 
     * @param {Number} a_status [1,2]
     * @param {Number} c_status [1,2]
     * @param {Number} sort
     * @param {Number} is_tab [0,1,2]
     * @param {Number} page 
     * @param {Number} limit 
     * 
     */
       var option = ctx.request.query||{};
       if(option.id){
         return ctx.body = await articleModel.getArticleId(option);
       }
       ctx.body = await articleModel.getArticle(option);
    }

    @GET(/:type/)
    async type(ctx,next){
        var { type } = ctx.params;
        var option = ctx.request.query||{};
        switch (type) {
            case "cate": 
                 //id, c_status,a_status
                if(option.id){
                    var cidArr = await ctx.model.table("tk_cate").field("id,pid").where({status:1,id:[">=",option.id]}).select();
                   
                    var cidArr = await ctx.heper.filterChrildId(cidArr, "id", "pid", option.id);
                    cidArr.push(option.id);
                    option["cid"]= cidArr;
                  return ctx.body = await articleModel.getArticle(option);
                }else{
                    return  ctx.body = await ctx.heper.diGuiAdd(await cateModel.getGroup(option));
                  
                }
                break;
            case "tab":
                //id, t_status,a_status,sort
                if(option.id){
                    ctx.body = await articleModel.getArticleTabId(option);
                }else{     
                    ctx.body = await tabModel.getGroup(option);                
                    // ctx.body = await tabModel.getGroup({t_status,a_status});
                }
                break;
            default:       
                break
        
        }

    }
    @POST("/add")
    async add(ctx,next){
        var data = ctx.request.body;
        
    }
    @POST("/del")
    async delete(ctx,next){

    }

    @POST("put")
    async put(ctx,next){

    }

}