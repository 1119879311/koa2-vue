import model from "./model";
export default class index{
    // 分组统计分类 (根据article)
    static  async getGroup(){
      var resDate = await  model.table("tk_cate as c").field("c.id,c.name,c.pid").join({
            join:"left",
            table:"tk_article as a",
            on:"a.cid = c.id"
        }).group("c.id").count("a.id");
      
        return resDate;
    }
   

}