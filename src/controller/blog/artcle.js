import {Controller, POST, GET} from "../../lib/router";
import cateModel from "../../model/tk_cate";
import articleModel from "../../model/tk_article";
import tabModel from "../../model/tk_tab";
import logicArticle from "../../logic/article";
import userAuth from "../../util/auth_decorator"

@Controller("/blog/artcle")
export  default  class  {
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
   
    @GET('/')
    async index(ctx,next){      
   
       var option = ctx.request.query||{};
      
        // 查单条article
       if(option.id){
            var res =  await articleModel.getArticleId(option);
            if(option.addRead&&res.status){ 
                await ctx.model.setInit().table("tk_article").where({id:option.id}).update({"readcount":res.data.readcount+1})
            }
            return ctx.body  = res
       }
        //查询 tab 下的所有 article    
       if(option.tabId){
             return ctx.body = await articleModel.getArticleTabId(option);
       }
        //查询 cate 下(包括子集)的所有 article    
       if(option.cateId){
            var cidArr = await ctx.model.table("tk_cate").field("id,pid").where({status:1,id:[">=",option.cateId]}).select();    
            option["cid"] = [...(await ctx.heper.filterChrildId(cidArr, "id", "pid", option.cateId)),option.cateId];
            return ctx.body = await articleModel.getArticle(option);
       }
        //搜索 article    
       if(option.search){
            var res = await ctx.model.table("tk_article as a").noField("content").field("c.name as cname,c.status as cstatus")
            .join({join:'left',table:"tk_cate as c",on:"c.id = a.cid"})
            .where([{"a.title|a.remark|c.name":["like",`%${option.search}%`]},{"a.status":1},"and"])
            .order({id:"desc"})
            .pageSelect();
            res["status"] = true;
          return   ctx.body = await res;
       }
        //默认查所有 article    
       return  ctx.body = await articleModel.getArticle(option);
    }

    // 统计分组article(根据cate|tab)
    @GET("/groupType")
    async type(ctx,next){
        var option = ctx.request.query||{};
        try {
            var status = true;
            var mssage = "select is success";
            var data=[];
            switch (option.type) {
                case "cate":
                    var data = await ctx.heper.diGuiAdd(await cateModel.getGroup(option));                   
                    break;
                case "tab":
                    var data = await tabModel.getGroup(option); 
                    break;   
                default:
                     status=false,mssage="miss type ,no data"; 
                     break;
            }
            return  ctx.body =await ctx.success({status,data,mssage});
        } catch (error) {
            return  ctx.body =await ctx.error(error);
        }
        
        
    }

   
    @POST("/add")
    @userAuth.isUser()
    @userAuth.isRoleAuth()
    async add(ctx,next){
        // 数据校验
        var {title,content,cid,thumimg,remark,status=1,tabList=[]} = ctx.request.body;
        var resVery = await logicArticle.veryAtricle({title,content,thumimg,remark,tabList});
        if (resVery)  return  ctx.body =await ctx.error(resVery);
        // 写入article数据 
        try {
           
            var resInsert = await ctx.model.table("tk_article").thenAdd({
                title,content:content,cid,thumimg,remark,readcount:100,status,createtime:(new Date().getTime()),
            },{title});
            
            if(resInsert.type=="exist"){
                return  ctx.body =await ctx.error("title is exist");
            
            }else if(resInsert.type=="add"){
                // 写入tab数据 
                var resTab = await ctx.model.table("tk_tab").field("id").where({"id":["in",tabList],status:1}).select();
                var resTabId = resTab.map(itme=> {return {t_id:itme.id,a_id:resInsert.id}});
                if(resTabId.length){
                    await ctx.model.table("tk_tab_article").add(resTabId);
                }
                return  ctx.body =await ctx.success({mssage:"add is success",data:resInsert.id});
            }
            return  ctx.body =await ctx.error("add is fail");
        } catch (error) {
            return  ctx.body =await ctx.error(error);
        } 
        
    }
   
      //单个/批量修改状态
   
    @POST("/swtich")
    @userAuth.isUser()
    @userAuth.isRoleAuth()
    async swtich(ctx,next){
          var {data=[]} = ctx.request.body;
          try {
            var res =await ctx.model.table("tk_article").updateMany(data,{key:"id"});
            return  ctx.body =await ctx.success("update is success");
          } catch (error) {
            return  ctx.body =await ctx.error(error);
          }
      }

    //更新 
    @POST("/update")
    @userAuth.isUser()
    @userAuth.isRoleAuth()
    async update(ctx,next){
        var {id,title,content,cid,thumimg,remark,sort,status=1,tabList=[]} = ctx.request.body
        if(!id) return  ctx.body =await ctx.error("id is required"); 
        var resVery = await logicArticle.veryAtricle({title,content,thumimg,remark,tabList});
        if (resVery)  return  ctx.body =await ctx.error(resVery);

        try {
            var res = await ctx.model.table("tk_article").where({id})
            .thenUpdate({title,content,cid,thumimg,remark,status},{id:["!=",id],title})
        
            if(res.type=="exist"){
                return  ctx.body =await ctx.error("title is exist");
           
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
                await ctx.model.transaction(sqlArr);
                return  ctx.body =await ctx.success("update is success");
           }
           return  ctx.body =await ctx.error(error);
        } catch (error) {
            return  ctx.body =await ctx.error(error);
        }
       
    }
     //删除
     @POST("/delete")
     @userAuth.isUser()
     @userAuth.isRoleAuth()
     async delete(ctx,next){
         var {id} = ctx.request.body;
         if(!id){
             return ctx.body = await {status:false,code:401,msg:"id  is required"}
         }
       
          try {
             //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
            var resfind = await ctx.model.table("tk_article").where({id,status:2}).findOne();
            if(!resfind) return  ctx.body =await ctx.error("detele is fail"); 
             // 先删除中间表tk_tab_article
            var resR =  await ctx.model.table("tk_tab_article").where({"a_id":id}).buildSql().delete();
            var resT =   await ctx.model.table("tk_article").where({id}).buildSql().delete();
        //执行事务
            await ctx.model.transaction([resR,resT]);          
            return  ctx.body =await ctx.success("detele is success");
         } catch (error) {
             console.log(error)
            return  ctx.body =await ctx.error(error);
         }
     }
    //  搜索
     @GET("/search")
     async search(ctx,next){
         let {q} = ctx.request.query;
         if(!q)  return  ctx.body =await ctx.error("miss search key");
         var res = await ctx.model.table("tk_article as a").noField("content").field("c.name as cname,c.status as cstatus")
            .join({join:'left',table:"tk_cate as c",on:"c.id = a.cid"})
            .where([{"a.title|a.remark|c.name":["like",`%${q}%`]},{"a.status":1},"and"])
            .order({id:"desc"})
            .pageSelect();
        return  ctx.body =await ctx.success(res);
     }
}