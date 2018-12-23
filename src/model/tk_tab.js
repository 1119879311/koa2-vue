import model from "./model";
export default class index{
    // 分组统计标签 (根据article)
    static async getGroup(){
       return  await model.table("tk_tab_article as ta").field("t.id,t.name").join([
            {join:"right",table:"tk_tab as t",on:"t.id =ta.t_id"},
            {join:"left",table:"tk_article as a",on:"a.id =ta.a_id"}
        ]).group("t.id").count("a.id");
    }
    // 
    static async getGropUidTab(where={}){
       console.log(where)
        return  await model.where(where).MormToMorm({
            middleTable:"tk_tab_article",relateTable:"tk_tab",field:"id,name",rkey:"id",fkey:"a_id",rfkey:"t_id",
         })

    }
}