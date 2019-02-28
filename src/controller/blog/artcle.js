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
                await ctx.model.table("tk_article").where({id:option.id}).update({"readcount":res.data.readcount+1})
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
            return ctx.body = {status,data,mssage}
        } catch (error) {
            ctx.body = await Object.assign({status:false},error||{error:"serve is error"})
        }
        
        
    }

   
    @POST("/add")
    @userAuth.isRoleAuth()
    @userAuth.isUser()
    async add(ctx,next){
        // 数据校验
        var {title,content,cid,thumimg,remark,status=1,sort=100,tabList=[]} = ctx.request.body;
        var resVery = await logicArticle.veryAtricle({title,content,thumimg,remark,tabList});
        if (resVery) return ctx.body = await resVery;
        // 写入article数据 
        try {
            console.log(content)
            var resInsert = await ctx.model.table("tk_article").thenAdd({
                title,content:content,cid,thumimg,remark,readcount:100,status,sort,createtime:(new Date().getTime()),
            },{title});
            
            if(resInsert.type=="exist"){
                return ctx.body = await  ({code:-101,  status:false,mssage:"title is exist",data:""});
            
            }else if(resInsert.type=="add"){
                // 写入tab数据 
                var resTab = await ctx.model.table("tk_tab").field("id").where({"id":["in",tabList],status:1}).select();
                var resTabId = resTab.map(itme=> {return {t_id:itme.id,a_id:resInsert.id}});
                if(resTabId.length){
                    await ctx.model.table("tk_tab_article").add(resTabId);
                }
                return ctx.body = await ({code:200,status:true,mssage:"add is success",data:resInsert.id})
            }
            return ctx.body = await  ({code:-101, status:false,mssage:"add is fail",data:""});
        } catch (error) {
            ctx.body = await {code:-101,status:false,mssage:"server is error"};
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
            return ctx.body = await ({code:200,status:true,mssage:"update is success",data:res})
          } catch (error) {
            return ctx.body  = await {code:-101,status:false,mssage:error};
          }
      }

    //更新 
    @POST("/update")
    async update(ctx,next){
        var {id,title,content,cid,thumimg,remark,sort,status=1,tabList=[]} = ctx.request.body;
        if(!id){
            return ctx.body = await {status:false,code:401,msg:"id is required"}
        }
        var resVery = await logicArticle.veryAtricle({title,content,thumimg,remark,tabList});
        if (resVery) return ctx.body = await resVery;
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
                await ctx.model.transaction(sqlArr);
               return ctx.body = await  ({code:200, status:true,mssage:"updata is success",data:""});
           }else{
               return ctx.body = await  ({code:-101, status:false,mssage:"updata is fail",data:""});
           }
        } catch (error) {
            return ctx.body = await  ({code:-101, status:false,mssage:"server is error,updata is fail",data:""});
            
        }
       
    }
     //删除
     @POST("/delete")
     async delete(ctx,next){
         var {id} = ctx.request.body;
         if(!id){
             return ctx.body = await {status:false,code:401,msg:"id  is required"}
         }
         //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
         var resfind = await ctx.model.table("tk_article").where({id,status:2}).findOne();
         if(!resfind) return ctx.body = await {code:-101, status:false,mssage:"正常状态无法删除",data:""};
         if(resfind&&resfind.error) return ctx.body = await resfind;
          // 先删除中间表tk_tab_article
          try {
            var resR =  await ctx.model.table("tk_tab_article").where({"a_id":id}).delete();
            var resT =   await ctx.model.table("tk_article").where({id}).delete();
            return ctx.body = await ({code:200,status:true,mssage:"detele is success",data:""})
         } catch (error) {
             return ctx.body = await  ({code:-101, status:false,mssage:"server is error",data:""});
         }
     }
    //  搜索
     @GET("/search")
     async search(ctx,next){
         let {q} = ctx.request.query;
         if(!q){
             return ctx.body = await { status:false,code:-101,mssage:"miss search key"}
         }
         var res = await ctx.model.table("tk_article as a").noField("content").field("c.name as cname,c.status as cstatus")
            .join({join:'left',table:"tk_cate as c",on:"c.id = a.cid"})
            .where([{"a.title|a.remark|c.name":["like",`%${q}%`]},{"a.status":1},"and"])
            .order({id:"desc"})
            .pageSelect();
         res["status"] = true;
         ctx.body = await res;
     }
}