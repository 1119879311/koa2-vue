import sqlParse from "./dbParse";
import mysql from "mysql";
import { db as config} from '../config';
import { resolve } from "dns";
var dbconfig = config[config["type"]]
class connect{
    constructor(dbconfig){
        this.pool = mysql.createPool({
            "host": dbconfig.host ||'127.0.0.1',
            "user": dbconfig.user||'root',
            "password": dbconfig.password||'',
            "port": dbconfig.port||'3306',//端口
            "database": dbconfig.database
        })

    }
    execsql(sql,option=[]){
        var nowData = new Date().getTime();
        var _this = this;
        if(!sql) return {};
        return new Promise((solve,reject)=>{
            _this.pool.getConnection((err,coms)=>{
                if(err){
                    console.log(err)
                    reject("connect fail" +err);
                    return 
                }
               var resComs = coms.query(sql,option,(err,res,fields)=>{
                    coms.release();
                    if(err) {
                        console.log(err)
                        return  reject("query is error: "+ sql+ '  '+ err);

                    };
                    solve(res)
                })
                console.log("["+new Date().toLocaleString()+"] : sql -: " + resComs.sql + '; --time--: after ' + parseFloat(new Date().getTime()-nowData)+" ms ");
            })
        })
    }
    // 事务
    transaction(sqlArr){
        var _this = this;
        return new Promise((resolve,reject)=>{
            _this.pool.getConnection((err,coms)=>{
                if(err){
                    reject("connect fail" +err);
                    return 
                }
                coms.beginTransaction(err=>{
                    if(err){
                        reject("connect fail" +err);
                        return 
                    }
                   for(let i =0;i<sqlArr.length;i++){
                        _this.execsql(sqlArr[i]).catch(err=>{
                            coms.rollback(()=>{ reject(err) })
                        })
                   }
                   coms.commit(err=>{
                       if(err){
                           coms.rollback(()=>{reject(err)})
                       }
                   })
                   console.log("Transaction");
                   resolve("Transaction complete")
                   coms.release();
                })
            })
        })
    }
}


class model extends connect{
    constructor(){
        super(dbconfig)
        this.build =false;
        this.options = {};
    }
    static instances(){
        if (!this.instance) {
            this.instance = new model();
        }
        return this.instance;
    }
    async error(err){
         return await {code:500,error:err,status:false}
    }
    setInit(){
        this.options = {};
        this.build = false;
        return this
    }
    buildSql(){
        this.build =true;
        return this;
    }
    clearOtions(){
        this.options = {};
        return this;
    }
    table(val){
        this.options.table = val;
        return this;
    }
     noField(val){
        this.options.noField = val;
        return  this;
    }
    field(val){
        this.options.field = val;
        return this
    }
    where(val){
        this.options.where =  sqlParse.isString(val)?val.trim():val;
        return this;
    }
    join(val){
        this.options.join = val;
        return this;
    }
    limit(val){
        this.options.limit = val;
        return this;
    }
    group(val){
        this.options.group = val;
        return this;
    }
    having(val){
        this.options.having = val;
        return this;
    }
    order(val){
        this.options.order = val;
        return this;
    }
    union(val){
        this.options.union = val;
        return this
    }
    // async buildSql(){
    //     await this.getNoField();
    //     var sql =  await sqlParse.parseSelectSql(this.options);
    //     await this.clearOtions();
    //     return sql
    // }
    async getNoField(){
        if(!this.options.noField) return '';
        if(sqlParse.isString(this.options.field)) this.options.field = this.options.field.split(',');
        if(!sqlParse.isArray(this.options.field)) this.options.field = [];
        if(sqlParse.isString(this.options.noField)){
            this.options.noField =  this.options.noField.split(",");
        }
        if(sqlParse.isArray(this.options.noField)&&this.options.noField.length){
            var reg = /as(.)+$/;
            var tables = this.options.table.replace(reg,"");
            var resField = await  this.execsql(sqlParse.parseDescSql(tables));
            resField = resField.map(itme=>itme.Field).filter(itme=>this.options.noField.indexOf(itme)==-1);
            var avias = this.options.table.match(reg);
            avias = avias?avias[1]:"";
            if(avias){
                resField = resField.map(itme=>`${avias}.${itme}`);
            }
            this.options.field = [...new Set(resField),...new Set(this.options.field)];
            var index = this.options.field.indexOf("*");
            if(index > -1){this.options.field.splice(index,1);}   
        }
    }
    /**
     *  @param return string
     * */
    async select(){
        await this.getNoField();
        var sql = await sqlParse.parseSelectSql(this.options);
        if(this.build){
           await this.setInit();
            return await sql;
        }
        await this.setInit();
        try {
            var res = await this.execsql(sql);
            return await res ;
        } catch (error) {
            return await  this.error(error);
        }
    }
    async findOne(){
        var res =await this.select();
        if(res&&res.error){
            return await error;
        }
        return await res[0]?res[0]:null;
    }
    /**
     * 
     * @param {string|object|array} opt 
     * @return {promise} string
     */
    async add(opt,replace){  
        this.options.values = opt; 
        var sql = await sqlParse.parseInsertSql(this.options,replace)
        if(this.build){
            await this.setInit();
            return await sql;
        }
        await this.setInit();
        try {
            var res = await this.execsql(sql);
            return await res.insertId?res.insertId:0;
        } catch (error) {
            return await  this.error(error);            
        }
       
    }
    async update(val,options,isBuild=true){
        this.options.values = val;
        if(sqlParse.isObject(options))  this.options = Object.assign(this.options,options||{});
        if(!this.options.where){
            console.error(new Error("update miss where or if all update where  parameter  is true"));
            return await  this.error("update miss where or if all update where  parameter  is true")
        }
        if(!sqlParse.isObject(val)){   
            console.error(new Error("updata data is must object"));
            return await  this.error("updata data is must object")
        }
        var sql = sqlParse.parseUpdateSql(this.options);
        if(this.build){
            await this.setInit();
            return await sql;
        }
        await this.setInit();
        try {
            var res = await this.execsql(sql);           
            return await res.affectedRows?res.affectedRows:0;
        } catch (error) {
            return await  this.error(error); 
        }
        
    }
    async updateMany(opt,options={key:"id"}){
        // [{id:1,status:2}]
        // update tk_table SET
          // status = case id where 1 then 2 where 2 then 1 end,....end where id in (1,2);
        // 第一种：
        if(!sqlParse.isArray(opt)||!opt.length){
            console.error(new Error("updata data is must Array"));
            return await  this.error("updata data is must Array")
        } 
        var arrKey =  Object.keys(opt[0])
        if(arrKey.indexOf(options.key)<0){
            console.error(new Error("update data miss key"));
            return await  this.error("update data miss key")
        }
          var optArr = {};
          var whereArr = [];
          opt.forEach((itme,index)=>{
              for (var key in itme) {
                  if (key ==options.key) {
                    whereArr.push(itme[key])
                  }else{
                    if(optArr[key]){
                        if(index==opt.length-1){
                            optArr[key].push([`when ${itme[options.key]} then  ${itme[key]} end`]);
                        }else{
                            optArr[key].push([`when ${itme[options.key]} then  ${itme[key]}`]);
                        }
                       
                    }else{
                        if(index==opt.length-1){
                            optArr[key] = [`${key} = case ${options.key} when ${itme[options.key]} then  ${itme[key]} end`];
                        }else{
                            optArr[key] = [`${key} = case ${options.key} when ${itme[options.key]} then  ${itme[key]}`];
                        }
                    }

                  }
              }
          })
        var whenArr = [];
        for (var keys in optArr) {
        whenArr.push(`${optArr[keys].join(" ")}`);
        }
        var sqlStr=`update ${this.options.table} set ${whenArr.join(',')} where id in (${whereArr.join(",")})`;
        if(this.build){
            await this.setInit();
            return await sqlStr;
        }
        await this.setInit();
        try {
            var res = await this.execsql(sqlStr);
            return true;
        } catch (error) {   
            return  await this.error(error)
             
        }
        return false;
        // 第二种：(需要转入所有字段的值,不同原来的才更新，字段不全会报错)
        // if(!sqlParse.isArray(opt)||!opt.length){
        //     console.error(new Error("updata data is must Array"));
        //     return await  this.error("updata data is must Array")
        // } 
        // var arrKey =  Object.keys(opt[0])
        // if(arrKey.indexOf(options.key)<0){
        //     console.error(new Error("update data miss key"));
        //     return await  this.error("update data miss key")
        // }
        // arrKey.splice(arrKey.indexOf(options.key),1);
        // var reskey = arrKey.map((itme)=>{
        //     return `${itme} = values(${itme})`
        // })
        // this.options.where = "";
        // this.options.values = opt;
        // var sql = sqlParse.parseInsertSql(this.options) + "on duplicate key update " +reskey.join(",");
        // this.options = {};        
        // try {
        //     var res = await this.execsql(sql);
        //     return true;
        // } catch (error) {   
        //     return await this.error(error)
             
        // }
        
    }
    /**
     * 
     * @param {*} Boolean 
     */
    async delete(isBuild=true){
      
        if(!this.options.where){
            console.error(new Error("delete miss where or if all delete where  parameter  is true"));
            return await  this.error("delete miss where or if all delete where  parameter  is true")
        };
        var sql = sqlParse.parseDeleteSql(this.options);
        if(this.build){
            await this.setInit();
            return await sql;
        }
        await this.setInit();
        var res = await this.execsql(sql);
        return await res.affectedRows?res.affectedRows:0;
    }
    async polyType({type,typeVal,flag}){
        this.options.type = type;
        this.options.typeVal = typeVal;
        var sql = "";
        if(flag){
            var options =  JSON.parse(JSON.stringify(this.options));
            var inSql = sqlParse.parseFindTypeSql(Object.assign(options,{field:""}));
            this.options.where = `${this.options.typeVal} in (${inSql})`;
            sql = sqlParse.parseSelectSql(this.options);
        }else{
            sql = sqlParse.parseFindTypeSql(this.options);
        }
        if(this.build){
            await this.setInit();
            return await sql;
        }
        await this.setInit();
        try {
            var res = await this.execsql(sql);
            return await res.length?res:{};
        } catch (error) {
            return await this.error(error)
        }
        // this.options = {};
        // if(sql&&isBuild){
        //     try {
        //         var res = await this.execsql(sql);
        //         return await res.length?res:{};
        //     } catch (error) {
        //         return await this.error(error)
        //     }
        // }else{
        //     return sql;
        // }
      
    }
    async min(val,isBuild = true){
        return this.polyType({type:"min",typeVal:val,flag:true},isBuild);
    }
    async max(val,isBuild = true){
        return this.polyType({type:"max",typeVal:val,flag:true},isBuild);
    }
    async count(val,isBuild = true){
        return this.polyType({type:"count",typeVal:val},isBuild);
    }
    async sum(val,isBuild = true){
        return this.polyType({type:"sum",typeVal:val},isBuild);
    }

    async avg(val,isBuild = true){
        return this.polyType({type:"avg",typeVal:val},isBuild);
    }
    /**
     *
     * @param {page} Number
     * @param {limit} Number
     */
    async pageSelect(page=1,limit=10){
        await this.getNoField();
        this.options.limit =[page,limit];
        try {
            var res = await this.execsql(sqlParse.parseSelectSql(this.options));
            this.options.group = "";
            this.options.limit = await '';
            this.options.field = await this.options.field?this.options.field:"*";
            var count = await this.count();
            if(count.error){
                return  await count ;
            }
            count = count.length?count[0].count:0;
            this.options = {};
            return await{code:200,msg:"success",count:count,data:res};
        } catch (error) {
            this.options = {};
            return await this.error(error)
        }
        
    }
    /**
     * @param {data} Ojbect
     * */
    async thenAdd(data,options){
        var table = this.options.table;
        this.options.where = options || this.options.where;
        var resfind = await this.findOne();
        if(resfind&&resfind.error){
            return await resfind;
        }
        if(resfind){
            return await {type:"exist",id:""};
        }
        this.options.table = table;
        var resAdd = await this.add(data);
        this.options = {}
        if(resAdd.error){
            return await resAdd;
        }
        return await {type:"add",id:resAdd};
    }
    async thenUpdate(data,options){
        var table = this.options.table;
        var where = this.options.where;
        this.options.where = options;
        var resfind = await this.findOne();
        if(resfind&&resfind.error){
            return await resfind;
        }
        if(resfind){
            return await {type:"exist",id:""};
        }
        this.options.table = table;
        this.options.where = where;
        var resuUdate = await this.update(data);
        this.options = {};
        if(resuUdate.error){
            return await resuUdate;
        }
        return await {type:"update",id:""};
    }
    
  
    async MormToMorm(options = {middleTable:"",relateTable:"",rkey:"",fkey:"",rfkey:""}){
        this.table(options.relateTable);
        this.join({table:options.middleTable,join:"right",on:`${options.rkey} = ${options.rfkey}`
        })
        try {
            var res = await this.execsql(sqlParse.parseSelectSql(this.options));
            var resObj = {};
            if(res&&res.length){
                res.forEach(itme=>{
                    if(resObj[itme[options.fkey]]){
                        resObj[itme[options.fkey]].push(itme)
                    }else{
                        resObj[itme[options.fkey]] = [itme];
                    }
                })
            }
            this.options = {};
            return await resObj;
        } catch (error) {
            this.options = {};
            return await this.error(error);
        }
       
    }

}
export default model.instances();
