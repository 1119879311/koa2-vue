import koa from 'koa'
const app = new koa()
import middleware from "./middleware"
middleware(app);
import model from "./model/model";



(async ()=>{
    // console.log( await model.table("tk_user").noField("password").findOne())
    //  console.log( await model.table("tK_article as a").field("a.*,c.name").join({table:"tk_cate as c",join:"left",on:["c.id","a.cid"]}).select())
    //  console.log( await model.table("tk_cate").where({"name":["like",["%name%",2,12]]}).select())
    // console.log(  await model.table("tk_cate").add([{name:"amdin",pid:0,sort:0},{name:"amdins",pid:0,sort:0}]));
    // console.log( await model.table("tk_cate").where(['id=21','id=22']).updateMany([{name:"name12s"},{name:"admin"}]))
    // console.log( await model.table("tk_cate").where({id:'21'}).delete() );
    // console.log( await model.table("tk_cate").avg("id"))
})()





// import parse from "./model/dbParse";
// console.log(parse.parseUpdateSql({table:"user",values:{"id":undefined,"password":"11245"},where:{id:undefined}}))
// console.log(parse.parseInsertSql({table:"user",fields:"id,use",values:[[1,"name"],[1,"name"]]}))
// console.log(parse.parseSelectSql({table:"user as u",where:"id=1"}))
// console.log(parse.parseWhere([{name:"ma","id|AGE":["like",["asd",2]],"_logic":"OR",__complex:{"lal":"1212","id":["!=","2"]}},{usernaem:"admin"}]))
// console.log(parse.parseWhere({__complex:{name:"ma"},"lal":"1212","id":["!=","2"]}))
// console.log(parse.parseHaving({"admin":["IN",["ll",2,3]]}))
// console.log(parse.parseWhere({"admin":{">":1,"<":0,"_logic":"or"}}))

// console.log(parse.parseWhereItme("admin|age","name"))

// var c = require("./class").default;
// // console.log(c.router)
// // var ins = new c();
// app.use(c.router.routes())
import allRouter from "./router";
allRouter(app);
app.listen(3000);
console.log("app run in port 3000..")


