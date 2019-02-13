// select a.*,c.name as cname,group_concat(concat_ws('-',t.id,t.name)separator '(^|&)')as tab from tk_article a 
// left join tk_tab_article ta on a.id =ta.a_id 
// left join tk_tab t on t.id = ta.t_id
// left join tk_cate c on c.id = a.cid group by a.id ;
import tabModel from "./tk_tab";
import model from "./model";
export default class index{

    static async getCommon(option = {where:"",order:"",limit:""}){
        var {page,limit }=  option.limit;
        return await model.table("tk_article as a").noField("content").field("c.name as cname,c.status as cstatus")
                .join([{join:'left',table:"tk_cate as c",on:"c.id = a.cid"} ])
                .where(option.where)
                .order(option.order)
                .pageSelect(page,limit);
    }
    // 获取一条article
    static async getArticleId(option = {}){
        var {id,a_status,c_status,is_tab} = option;
        var wheres = {"at.id":id};
        if(a_status) wheres[`at.status`] = a_status;
        if(c_status) wheres[`c.status`] = c_status;
        var resInfo =  await model.table("tk_article as at")
            .field("at.*,c.name as c_name,c.status as c_status")
            .join({join:'left',table:"tk_cate as c",on:"c.id = at.cid"})
            .where(wheres)
            .findOne();
        if(resInfo&&resInfo.error){
            
            return resInfo;
        }
        if(resInfo){
           var tabWhere = is_tab==0?{a_id:id}:{a_id:id,status:is_tab};
           console.log(tabWhere)
           var tabRes =  await model.where(tabWhere).MormToMorm({
                middleTable:"tk_tab_article",relateTable:"tk_tab",field:"id,name",rkey:"id",fkey:"a_id",rfkey:"t_id",
            })
            resInfo["tab"] = tabRes[resInfo["id"]]?tabRes[resInfo["id"]]:[];
        }
       
        return  await resInfo;
    }
    //获取all article
    static  async getArticle(option = {}){
        var {a_status,c_status,sort,is_tab,cid,page,limit=10} = option;
        var where = {};
       if(a_status) where[`a.status`] = a_status;
       if(c_status) where[`c.status`] = c_status;
       if(cid) where[`a.cid`] = ["in",cid];
       let resInfo = await this.getCommon({where,order:sort,limit:{page,limit}});
       
       if(resInfo&&resInfo.error){
            resInfo["status"] = false;
           return resInfo;
       }
       resInfo["status"] = true;
        // 是否需要获取tab
        if(is_tab&&resInfo.data.length){
            var tabWhere = is_tab==0?{}:{status:is_tab};
            var tabRes = await tabModel.getGropUidTab(tabWhere);
            resInfo.data.map( itme=>{if(itme){var tabArr = tabRes[itme.id];itme["tab"] = tabArr?tabArr:[];}})
        }
        return resInfo;
       
    }

    // 根据tab id 获取 article
     static async getArticleTabId(option={}){ 
        //默认全部，1是正常，2是禁用
        var {id="",t_status=1,a_status=1,sort} = option;
        var tabWhere = {};
        if(t_status) tabWhere[`status`] = t_status;
       var tabRes =await model.table("tk_tab").join({join:'right',table:"tk_tab_article as ta",on:"id = t_id"}).where(tabWhere).select();
       try {
            var artId = [];
            var resObj = {};
            tabRes.forEach(itme=>{
                //找出 tabID 对应的所有article Id
                if(id&&itme.id==id){ artId.push(itme.a_id)}

                // 找出每一个article 下的所有的tab
                if(resObj[itme["a_id"]]){
                    resObj[itme["a_id"]].push(itme)
                }else{
                    resObj[itme["a_id"]] = [itme];
                }
            })
            var artWhere = {"a.id":["in",artId]};
            if(a_status) artWhere[`a.status`] = a_status;
            var res =  await this.getCommon({where:artWhere,order:sort});
            res.data.map( itme=>{if(itme){var tabArr = resObj[itme.id];itme["tab"] = tabArr?tabArr:[];}});
            return await res;
          
       } catch (error) {
            console.log(error)
             return await {error:"serve is error",code:500}
       }
       // res.data.map( itme=>{if(itme){var tabArr = tabRes[itme.id];itme["tab"] = tabArr?tabArr:[];}});
        // return await tabRes
        // try {
        //     var tabRes = await tabModel.getGropUidTab(tabWhere);  
        //     console.log(tabRes)   
        //     var aidArr = Object.keys(tabRes);//获取 article 的id;
        //     var artWhere = {"a.id":["in",aidArr]};
        //     if(a_status) artWhere[`a.status`] = a_status;
        //     var res =  await this.getCommon({where:artWhere,order:sort});
        //     res.data.map( itme=>{if(itme){var tabArr = tabRes[itme.id];itme["tab"] = tabArr?tabArr:[];}});
        //     return res;
        // } catch (error) {
        //     console.log(error)
        //     return await {error:"serve is error",code:500}
        // }
        //  var where = {};
        //  if(a_status) where[`a.status`] = a_status;
        //  if(c_status) where[`c.status`] = c_status;
        // //  var res =  await this.getCommon({where,order:sort});

        // option={id:"",t_status:-1,a_status:-1}
        // var getGropUidTabWhere = {id:option.id};
        // var wheres = {};
        // if(option.t_status!=undefined &&option.t_status!=-1) wheres[`status`] = option.t_status;
        // var tabRes = await tabModel.getGropUidTab(getGropUidTabWhere);     
        // var aidArr = Object.keys(tabRes)
        // var getCommonWhere = {"a.id":["in",aidArr]};
        // if(option.a_status!=undefined &&option.a_status!=-1) wheres[`a.status`] =option.a_status;
        // var res =  await this.getCommon({where:getCommonWhere});
        // res.data.map( itme=>{if(itme){var tabArr = tabRes[itme.id];itme["tab"] = tabArr?tabArr:[];}});
        // return res;
     }
}