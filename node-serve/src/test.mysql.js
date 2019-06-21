// import model from "./lib/mysql/model";
var model = require("./lib/mysql/models");
// const model =require("mysql-model-orm");
(async ()=>{
    // 创建实例
    var Model = new model({
        "host": "localhost",//主机名/ip
        "user": "root",//用户名
        "password": "",//密码
        "port": 3306,//端口
        "database": "thinkjs" //连接的库
    })

    
    try {
       
        // 1. select():查询数据
        // var res = await Model.findOne({
        //     table:"tk_user",
        //     where:"isAdmin=2"
        // });
        // console.log(res)
        // var res = await Model.pageSelect({
        //     table:"tk_user"
        // });
       
        // console.log(JSON.stringify(res));
        // console.log(res)
        

        // 2. findOne():查询一条数据
        // var res = await Model.table("tk_tab").findOne();
        
        // 1.1 table(val)：stirng,数据表名，必填

        // 3.field(val)：string|array,指定字段查询 
        // var res = await Model.table("tk_tab").field("id").select();

        // 4.noField(val):string|array, 查询除了某字段外的所有字段 
        // var res = await Model.table("tk_tab").noField("id,status").select();

        // 5.where(option):string|object|array 按条件查询
        //     (5.1)：string
        //          var res = await Model.table("tk_tab").where("id=1").select(); 
        //          sql=>from tk_tab  where  id = 1 

        //     (5.2):object
        //          var res = await Model.table("tk_tab").where({id:1}).select(); 
        //          sql=>from tk_tab  where  id = 1 

        //     (5.3):array (数组第三个数："or"|“and"),数组第一，二个：string|object
        //          var res = await Model.table("tk_tab").where([{id:1},{id:3},"or"]).select(); 
        //          sql=>:select * from tk_tab  where  (  id = 1   )  or  (  id = 3   ) 

        //     (5.4):option.__logic   or=>或者,and =>且
        //          var res = await Model.table("tk_tab").where({id:1,status:1,_logic:"or"}).select(); 
        //          sql=>:select * from tk_tab  where  (  id = 1   )  or  (  status = 1  ) 

        //     (5.5):option.__complex   复合查询
        //          var res = await Model.table("tk_article").where({title:"ai","_logic":"OR",__complex:{"title":"1212","id":["!=","2"]}}).select();
        //          res=>sql -: select * from tk_article  where ( title = 'ai') or ( title = '1212' and   id  != '2' )

        //     (5.6): like,notlike
        //          var res = await Model.table("tk_tab").where({name:["like",["%美%","%音%"]]}).select(); 
        //          res=>sql：select * from tk_tab  where  ( name like '%美%' or name like '%音%' ) 

        //     (5.7):BETWEEN,NOT BETWEEN
        //          var res = await Model.table("tk_tab").where({id:["NOT BETWEEN",["1","3"]]}).select(); 
        //          res=>sql： select * from tk_tab  where  ( id  between '1' and '3' );

        //      (5.7):IN,NOTIN
        //              var res = await Model.table("tk_tab").where({id:["IN",["1",2,"3"]]}).select(); 
        //          res=>sql：select * from tk_tab  where  id in ( '1',2,'3' ) ;
        //     (5.8): =,!= ,>,>=,<,<= ;
        //              var res = await Model.table("tk_tab").where({id:["!=",2]}).select(); 
        //           res=>sql：select * from tk_tab  where  id in ( '1',2,'3' ) ;   

        //  6、order(val):string|object:array; 排序：
        //         string=>"name desc",object=>{"name":'desc',id:"asc"}，array=>['name desc","id asc"]
        //         var res = await Model.table("tk_tab").order("id desc").select();
        //          res=>sql：select * from tk_tab  order by id desc;

        //  7、limit(val)：{string|object|arrAry}  查询指定限制个数,page:从第page+1 条开始，查 offset 条
        //         string:"2,10";object:{"page":0,"offset":10};array:[1,]
        //         var res = await Model.table("tk_tab").limit("2,3").select();
        //         res=>sql：select * from tk_tab  limit 3,3 

        //  8.group(va;):string;分组
        //         var res = await Model.table("tk_tab").group("status").select();
        //         res=>sql：select * from tk_tab  group by status ; 

        //  8.hvaing(va;):结合group 方法一起，用法和 where一样 
        //         var res = await Model.table("tk_tab").group("status").having({status:1}).select();
        //         res=>sql：select * from tk_tab  group by status  having  status = 1 
         
        // 9.join(option):string|object|array;连接查询:分为左右连接，内连接
        //      string： "right join tk_cate as c on a.cid=c.id"
        //      object：{table,join,on}=>{table:"tk_cate as c",join:"right",on:"a.cid=c.id"}
        //      array:[string|object],多个join ,可用数组

        //      (9.1) var res = await Model.table("tk_article as a").join({table:"tk_cate as c",join:"right",on:"a.cid=c.id"}).select();
        //      (9.1)var res = await Model.table("tk_article_tab as at").join([
        //          {table:"tk_article as a",join:"right",on:"at.a_id=a.id"},
        //          {table:"tk_tab as c",join:"right",on:["at.t_id","t.id"]}]).select();
             
        //      res=>sql：select * from tk_article as a right join tk_cate as c on a.cid=c.id; 
        // 10.distinct(val):string,去重字段
        //      var res= await Model.table("tk_article").distinct("cid").field("id,cid").select()

        //11.add(val)：string|object|array ,添加数据，单条、批量


        //  console.log(res)
    } catch (error) {
        console.log(error)
    }
    
   
    
})()