import sqlParse from "./dbParse";
import mysql from "mysql";
import { db as config} from '../config';
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
                    reject("connect fail");
                    throw new Error("cannot connectError"+err);
                }
               var resComs = coms.query(sql,option,(err,res,fields)=>{
                    coms.release();
                    if(err) throw new Error("query is error: "+ sql+ '  '+ err);
                    solve(res)
                })
                console.log("["+new Date().toLocaleString()+"] : sql -: " + resComs.sql + '; --time--: after ' + parseFloat(new Date().getTime()-nowData)+" ms ");
            })
        })
    }
}


class model extends connect{
    constructor(){
        super(dbconfig)
        this.options = {};
    }
    static instances(){
        if (!this.instance) {
            this.instance = new model();
        }
        return this.instance;
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
    async buildSql(){
        await this.getNoField();
        var sql =  await sqlParse.parseSelectSql(this.options);
        this.options = {};
        return sql
    }
    async getNoField(){
        if(sqlParse.isString(this.options.field)) this.options.field = this.options.field.split(',');
        if(!sqlParse.isArray(this.options.field)) this.options.field = [];
        if(this.options.noField&&sqlParse.isString(this.options.noField)){
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
        var res = await this.execsql(sqlParse.parseSelectSql(this.options))
        this.options = {};
        return await res ;
    }
    async findOne(){
        var res =await this.select();
        this.options = {};
        return await res[0]?res[0]:null;
    }
    /**
     * 
     * @param {string|object|array} opt 
     * @return {promise} string
     */
    async add(opt,replace){
        this.options.values = opt;
        var res = await this.execsql(sqlParse.parseInsertSql(this.options,replace));
        this.options = {};
        return await res.insertId?res.insertId:0;
    }
    async update(val,options){
        this.options.values = val;
        if(sqlParse.isObject(options))  this.options = Object.assign(this.options,options||{});
        if(!this.options.where){
            return await new Error("update miss where or if all update where  parameter  is true");

        }
        if(!sqlParse.isObject(val)){   
            return await new Error("updata data is must object"); 
        }
       
        var res = await this.execsql(sqlParse.parseUpdateSql(this.options));
        this.options = {};
        return await res.affectedRows?res.affectedRows:0;
    }
    async updateMany(opt,options={key:"id"}){
        if(!sqlParse.isArray(opt)||!opt.length) return await new Error("updata data is must Array");
        var arrKey =  Object.keys(opt[0])
        if(arrKey.indexOf(options.key)<0) return await new Error("update data miss key")
        arrKey.splice(arrKey.indexOf(options.key),1);
        var reskey = arrKey.map((itme)=>{
            return `${itme} = values(${itme})`
        })
        this.options.where = "";
        this.options.values = opt;
        var sql = sqlParse.parseInsertSql(this.options) + "on duplicate key update " +reskey.join(",");
        var res = await this.execsql(sql);
        this.options = {};
        return true;
    }
    /**
     * 
     * @param {*} Boolean 
     */
    async delete(){
        if(!this.options.where) return await new Error("delete miss where or if all delete where  parameter  is true");
        var res = await this.execsql(sqlParse.parseDeleteSql(this.options));
        this.options = {};
        return await res.affectedRows?res.affectedRows:0;
    }
    async polyType({type,typeVal,flag}){
        this.options.type = type;
        this.options.typeVal = typeVal;
        if(flag){
            var options =  JSON.parse(JSON.stringify(this.options));
            var inSql = sqlParse.parseFindTypeSql(Object.assign(options,{field:""}));
            this.options.where = `${this.options.typeVal} in (${inSql})`;
            var res = await this.execsql(sqlParse.parseSelectSql(this.options));
        }else{
            var res = await this.execsql(sqlParse.parseFindTypeSql(this.options));
        }
        this.options = {};
        return await res.length?res:{};
    }
    async min(val){
        return this.polyType({type:"min",typeVal:val,flag:true});
    }
    async max(val){
        return this.polyType({type:"max",typeVal:val,flag:true});
    }
    async count(val){
        return this.polyType({type:"count",typeVal:val});
    }
    async sum(val){
        return this.polyType({type:"sum",typeVal:val});
    }

    async avg(val){
        return this.polyType({type:"avg",typeVal:val});
    }
    /**
     *
     * @param {page} Number
     * @param {limit} Number
     */
    async pageSelect(page=1,limit=10){
        await this.getNoField();
        this.options.limit =[page,limit];
        var res = await this.execsql(sqlParse.parseSelectSql(this.options));
        this.options.group = "";
        this.options.limit = await '';
        this.options.field = await this.options.field?this.options.field:"*";
        var count = await this.count();
        count = count.length?count[0].count:0;
        this.options = {};
        return await{code:200,msg:"success",count:count,data:res};
    }
    /**
     * @param {data} Ojbect
     * */
    async thenAdd(data,options){
        var table = this.options.table;
        this.options.where = options || this.options.where;
        var resfind = await this.findOne();
      
        if(resfind){
            return await {type:"exist",id:""};
        }
        this.options.table = table;
        var resAdd = await this.add(data);
        this.options = {}
        return await {type:"add",id:resAdd};
    }

    async relation(option = {type:"OEN-TO-OEN",}){
        var typeArr = ["OEN-TO-OEN","OEN-TO-MORE","MORE-TO-MORE"];
    }
  
    async MormToMorm(options = {middleTable:"",relateTable:"",rkey:"",fkey:"",rfkey:""}){
        this.table(options.relateTable);
        this.join({table:options.middleTable,join:"right",on:`${options.rkey} = ${options.rfkey}`
        })
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
    }

}
export default model.instances();
