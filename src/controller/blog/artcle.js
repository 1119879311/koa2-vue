import {Controller, POST, GET} from "../../util/router_decorator";
import cateModel from "../../model/tk_cate";
import articleModel from "../../model/tk_article";
import tabModel from "../../model/tk_tab";
import logicArticle from "../../logic/article";


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
                    console.log(ctx.model.option)  
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
        var {title,content,cid,thumimg,remark,status=1,sort=100,tabList=[]} = ctx.request.body;
        var resVery = await logicArticle.veryAtricle({title,content,thumimg,remark,tabList});
        if (resVery) return ctx.body = await resVery;
        var resInsert = await ctx.model.table("tk_article").thenAdd({
            title,content,cid,thumimg,remark,readcount:100,status,sort,createtime:(new Date().getTime()),
        },{title});
        
        if(resInsert.type=="exist"){
            return ctx.body = await  ({code:-101,  status:false,mssage:"title is exist",data:""});
        
        }else if(resInsert.type=="add"){
            // 添加 tab
            var resTab = await ctx.model.table("tk_tab").field("id").where({"id":["in",tabList],status:1}).select();
            var resTabId = resTab.map(itme=> {return {t_id:itme.id,a_id:resInsert.id}});
            if(resTabId.length){
                await ctx.model.table("tk_tab_article").add(resTabId);
            }
            return ctx.body = await ({code:200,status:true,mssage:"add is success",data:resInsert.id})
        }
        ctx.body = await resInsert;
        try {
           
        } catch (error) {
            console.log(error);
            ctx.body = await {code:-101,status:false,error:"server is error"};
        }
       
        
        
    }
    @POST("/del")
    async delete(ctx,next){

    }

    @POST("/update")
    async update(ctx,next){
        var {id,title,content,cid,thumimg,remark,sort,status=1,tabList=[]} = ctx.request.body;
        if(!id){
            return ctx.body = await {status:false,code:401,msg:"id is required"}
        }
        var resVery = await logicArticle.veryAtricle({title,content,thumimg,remark,tabList});
        if (resVery) return ctx.body = await resVery;
        console.log(resVery)
        try {
            var res = await ctx.model.table("tk_article").where({id}).thenUpdate({title,content,cid,thumimg,remark,status},{id:["!=",id],title})
        
            if(res.type=="exist"){
                return ctx.body = await  ({code:-101, status:false,mssage:"title is exist",data:""});
           
           }else if(res.type=="update"){
                //先删除再添加.l;
                var sqlArr = [];
                var delSql = await ctx.model.table("tk_tab_article").where({a_id:id}).buildSql().delete();
                sqlArr.push(delSql);
                if(tabList&&tabList.length){
                    var addData = tabList.map(itme=>{ return { a_id:id,t_id:itme } });
                    var addSql =await ctx.model.table("tk_tab_article").buildSql().add(addData);
                    sqlArr.push(addSql);
                }
                // 执行事务（原子性）：
               var result =  await ctx.model.transaction(sqlArr);
               return ctx.body = await  ({code:200, status:true,mssage:"updata is success",data:""});
           }
        } catch (error) {
            return ctx.body = await  ({code:-101, status:false,mssage:"server is error,updata is fail",data:""});
            
        }
       
    }

}