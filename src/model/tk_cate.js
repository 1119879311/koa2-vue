import model from "./model";
export default class index{
    // 分组统计分类 (根据article)
    static  async getGroup(option={}){
        var {c_status=1,a_status=1} = option;
        var arrWhere = ["a.cid=c.id",{"a.status":a_status},"and"];
        // 默认是1， 全部是0
        // a_status==0?arrWhere:arrWhere.push({"a.status":a_status});
        var coutSql = await model.table("tk_article as a").where(arrWhere).buildSql().count("a.id");
        // 默认是1， 全部是0
        var cateWhere = c_status==0?{}:(c_status?{"c.status":c_status}:{"c.status":1});
        
        return await model.table("tk_cate as c").field(`c.*,(${coutSql}) as count`).where(cateWhere).group("c.id").select();
    }
   

}