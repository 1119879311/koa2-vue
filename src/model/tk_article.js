// select a.*,c.name as cname,group_concat(concat_ws('-',t.id,t.name)separator '(^|&)')as tab from tk_article a 
// left join tk_tab_article ta on a.id =ta.a_id 
// left join tk_tab t on t.id = ta.t_id
// left join tk_cate c on c.id = a.cid group by a.id ;
import tabModel from "./tk_tab";
import model from "./model";
export default class index{
    static async getCommon(option = {where:"",order:""}){
        return await model.table("tk_article as a").noField("content").field("c.name as cname").join([
            {join:'left',table:"tk_cate as c",on:"c.id = a.cid"}
        ]).where(option.where).order(option.order).pageSelect();
    }
    static async getArticleId(where={id:""}){
        var res =  await model.table("tk_article as a").noField("content").field("c.name as cname").join([
            {join:'left',table:"tk_cate as c",on:"c.id = a.cid"}
        ]).where({"a.id":where.id}).findOne();
        var tabRes = await tabModel.getGropUidTab({a_id:where.id,status:1});
        tabRes = tabRes[res["id"]];
        res["tab"] = tabRes?tabRes:[];
        return res
    }
    //获取all article
    static  async getArticle(option = {where:"",order:""},t_status=1){
        let res = await this.getCommon(option);
        var tabRes = await tabModel.getGropUidTab({status:t_status||1});
        res.data.map( itme=>{if(itme){var tabArr = tabRes[itme.id];itme["tab"] = tabArr?tabArr:[];}})
        return res
    }

    // 根据tab id 获取 article
     static async getArticleTabId(option={id:"",t_status:1,a_status:1}){  
        var tabRes = await tabModel.getGropUidTab({id:option.id,status:option.t_status||1});     
        var aidArr = Object.keys(tabRes)
        var res =  await this.getCommon({where:{"a.id":["in",aidArr],"a.status":option.a_status||1}});
        res.data.map( itme=>{if(itme){var tabArr = tabRes[itme.id];itme["tab"] = tabArr?tabArr:[];}});
        return res;
       
     }
}