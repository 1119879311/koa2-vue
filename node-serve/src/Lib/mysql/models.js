let sqlParse = require("./dbParse");
const mysql = require("mysql");
class connect{
    constructor(dbconfig={}){
        this.pool = mysql.createPool({
            "host": dbconfig.host ||'127.0.0.1',
            "user": dbconfig.user||'root',
            "password": dbconfig.password,
            "port": dbconfig.port||'3306',//端口
            "database": dbconfig.database
        })
        this.sqlParse = sqlParse;

    }
    execsql(sql,option=[]){
        var nowData = new Date().getTime();
        var _this = this;
        if(!sql) return {};
        return new Promise((solve,reject)=>{
            _this.pool.getConnection((err,coms)=>{
                if(err){
                    console.log(err)
                    reject("connect fail " +err);
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
                // console.log("["+new Date().toLocaleString()+"] : sql -: " + resComs.sql + '; --time--: after ' + parseFloat(new Date().getTime()-nowData)+" ms ");
            })
        })
    }
    escape(val){
        return  mysql.escape(val)
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
                    
                    var resSQL = sqlArr.map( val =>  {
                        return new Promise((resolve,reject)=>{   
                            if(sqlParse.isString(val)){
                                
                                coms.query(val,(err,res,fields)=>{
                                    if(err) {
                                    return  coms.rollback(()=>{ reject(err) })
                                    };
                                    resolve(res);
                                })
                             
                            }else if(sqlParse.isArray(val)){

                                coms.query(val[0],val[1],(err,res,fields)=>{
                                    if(err) {
                                    return  coms.rollback(()=>{ reject(err) })
                                    };
                                    resolve(res);
                                })

                           
                            }else if(sqlParse.isObject(val)){
                                coms.query(val['sql'],val['value'],(err,res,fields)=>{
                                    if(err) {
                                    return  coms.rollback(()=>{ reject(err) })
                                    };
                                    resolve(res);
                                })
                               
                            }
                        })
                    })
                   
                    Promise.all(resSQL).then(res=>{
                        coms.commit(err=>{
                            if(err){
                                coms.rollback(()=>{reject(err)})
                            }else{
                                console.log("Transaction complete")
                                resolve("Transaction complete")
                            }
                        })
                    }).catch(err=>{
                        console.log(err)
                        coms.rollback(()=>{ reject(err) })
                    })   
                   
                   coms.release();
                })
            })
        })
    }
}

class model extends connect{
    constructor(dbconfig){
        super(dbconfig)
    }
    error(err){
        console.log(err)
        return  {code:-101,mssage:JSON.stringify(err),status:false}
    }
    clone(option){
        return JSON.parse(JSON.stringify(option));
    }
  /**
     * @param {object} options 
     * @param {string} options.table
     * @param {object} options.where  更新的条件 {id:"1"}  
     * @return {promise} string
     */
    async select(options={}){
        if(sqlParse.objLen(options)==0){
            return  Promise.reject(this.error("sql is miss options"))
        }
        try {
            var sql = await sqlParse.parseSelectSql(options);
            if(options.build){
                return await sql;
            }
            return await this.execsql(sql);
        } catch (error) {
            return  Promise.reject(this.error(error))
        }
    }

    async findOne(options={}){
        try {
            options.limit=1;
            var res =await this.select(options);
            if(options.build){
                return await res;
            }
            return res[0]?res[0]:null
       
        } catch (error) {
            return await error;
        }
    }

    /**
     * @param {object} options
     * @param {string} options.table
     * @param {string|object|array} options.values 
     * @return {promise} string
     */
    async add(options={},replace){ 
        try {
            var sql = await sqlParse.parseInsertSql(options,replace);
            if(options.build) return await sql;
            var res = await this.execsql(sql);
            return await res.insertId?res.insertId:0;
        } catch (error) {
            return  Promise.reject(this.error(error))
        } 
    }

     /**
     * @param {object} options 
     * @param {string} options.table
     * @param {object} options.values  更新的数据 {name:"updateName"}
     * @param {object} options.where  更新的条件 {id:"1"}  
     * @return {promise} string
     */
    async update(options={}){
        try {
            if(!options.where){
                return  Promise.reject(this.error("update miss where or if all update where  parameter  is true"))
            }
            if(!sqlParse.isObject(options.values)){   
                return Promise.reject(this.error("updata data is must object"))
            }
            var sql= await sqlParse.parseUpdateSql(options)
            if(options.build) return await sql;
            var res = await this.execsql(sql); 
            return res.affectedRows?res.affectedRows:0;
            
        } catch (error) {
            return  Promise.reject(this.error(error))
        }
    }
      /**
     *批量更新
     * @param {object} options
     * @param {array} options.values 更新的数据（包含条件字段内） 如： [{name:"updateName1",id:1},{name:"updateName2",id:2}]
     * @param {object} options.where (必填)条件参数字段 如： {key:"id"} ;id 字段将作为更新条件
     * @return {promise} string
     * 示例：
     * sql：update tk_table SET status = case id where 1 then 2 where 2 then 1 end where id in (1,2);
     */
     async updateMany(options={}){
        try {
            if(!sqlParse.isArray(options.values)||!options.values.length){
                return  Promise.reject(this.error("updata data is must Array"));
            } 
            var arrKey =  Object.keys(options.values[0]);//获取所有字段（包含更新字段和条件字段）
            if(!options.where||arrKey.indexOf(options.where.key)<0){
                return  Promise.reject(await this.error("update data miss where in field key"));
            }
            var optArr = {};
            var whereArr = [];
            var values=options.values;
            var where= options.where;
            values.forEach((itme,index)=>{
                for (var key in itme) {
                    if (key ==where.key) {
                    whereArr.push(this.escape(itme[key]))
                    }else{
                    if(optArr[key]){
                        if(index==values.length-1){
                            optArr[key].push([`when ${itme[where.key]} then  ${this.escape(itme[key])} end`]);
                        }else{
                            optArr[key].push([`when ${itme[where.key]} then  ${this.escape(itme[key])}`]);
                        }
                        
                    }else{
                        if(index==values.length-1){
                            optArr[key] = [`${key} = case ${where.key} when ${itme[where.key]} then  ${this.escape(itme[key])} end`];
                        }else{
                            optArr[key] = [`${key} = case ${where.key} when ${itme[where.key]} then  ${this.escape(itme[key])}`];
                        }
                    }

                    }
                }
            })
            var whenArr = [];
           
            for (var keys in optArr) {
            whenArr.push(`${optArr[keys].join(" ")}`);
            }
            var sqlStr=`update ${options.table} set ${whenArr.join(',')} where id in (${whereArr.join(",")})`;
            if(options.build) return await sqlStr;
           return   await this.execsql(sqlStr);

        } catch (error) {
            return  Promise.reject(this.error(error))
        }
  
    }
   
    /**
     * @param {object} options 
     * @param {string} options.table 
     * @param {object} options.where  delete的条件 {id:"1"} 
     * @return {promise} Booleam
     */
    async delete(options={}){
            try {
                if(!options.where){
                    return  Promise.reject( await  this.error("delete miss where or if all delete where  parameter  is true"));
                };
                var sqlStr = sqlParse.parseDeleteSql(options);
                if(options.build) return await sqlStr;
                var res = await this.execsql(sqlStr);
                return await res.affectedRows?res.affectedRows:0;
            } catch (error) {
                return  Promise.reject(this.error(error))
            }
    }
    /**
     * 
    * @return {promise} 
     */
    async polyType(options,{type,flag}){
        var data = this.clone(options);
            try {
                data.type = type;
                data.typeVal = options.values;
                if(flag){
                    var inSql = sqlParse.parseFindTypeSql(Object.assign(options,{field:""}));
                    data.where = `${data.typeVal} in (${inSql})`;
                    var  sqlStr = sqlParse.parseSelectSql(data);
                }else{
                   var  sqlStr = sqlParse.parseFindTypeSql(data);
                }
                if(options.build) return await sqlStr;
                var res = await this.execsql(sqlStr);
                return await res.length?res:{};
            } catch (error) {
                return  Promise.reject(this.error(error))
            }
    }
     /**
     * @param {object} options 
     * @param {string} options.table 
     * @param {object} options.values  聚合字段 默认（*）
     * @param {object} options.where  delete的条件 {id:"1"} 
     * @return {promise} Booleam
     */

    async min(options={}){
        return await this.polyType(options,{type:"min",flag:true});
    }
    async max(options={}){
        return await this.polyType(options,{type:"max",flag:true});
    }
    async count(options={}){
        return await this.polyType(options,{type:"count"});
    }
    async sum(options={}){
        return await this.polyType(options,{type:"sum"});
    }

    async avg(options={}){
        return await this.polyType(options,{type:"avg"});
    }
    /**
     * @param {object} options 
     * @param {string} options.table 
     * @param {page} Number
     * @param {limit} Number
     * @return {promise} 
     */
    async pageSelect(options,page=1,limit=10){
        var data = this.clone(options);       
        try {
            if(sqlParse.objLen(options)==0){
                return  Promise.reject(await this.error("sql is miss option"))
            }
            // data.field = await this.getNoFields(data.table,data.field,data.noField);               
            options.limit = options.limit?options.limit:[page,limit];
            var res = await this.execsql(await sqlParse.parseSelectSql(options));
            delete data.group;
            delete data.having;
            delete data.limit;
            data.field = data.field?data.field:"*";
            var count = await this.count(data);
            count = count.length?count[0].count:0;
            return await {code:200,mssage:"success",count:count,data:res};
        } catch (error) {
            return  Promise.reject(error)
        }
        
    }

     /**
     * @param {object} options 
     * @param {string} options.table 
     * @return {promise} 
     */
    async thenAdd(options={},findWhere={}){
        try {
            var data = this.clone(options);
            data.where = findWhere;
            var resfind = await this.findOne(data);
            if(resfind) return await {type:"exist",id:""};
            var resAdd = await this.add(options);
            return await {type:"add",id:resAdd}
        } catch (error) {
            return  Promise.reject(error)
        }
    }

     /**
     * @param {object} options 
     * @param {string} options.table 
     * @param {object} findWhere  
     * @return {promise} 
     */
    async thenUpdate(options={},findWhere={}){
        try {
            var data = this.clone(options);
            data.where = findWhere;
            var resfind = await this.findOne(data);
            if(resfind) return await {type:"exist",id:""};
            await this.update(options);
            return await {type:"update",id:""};
        } catch (error) {
            return  Promise.reject(error)
            
        }
    }

     /**
     * @param {object} options ;
     * @return {promise} 
     */
    async MormToMorm(options = {middleTable:"",relateTable:"",rkey:"",fkey:"",rfkey:""}){
        try {
            var data = {};
            data.table = options.relateTable;
            data.join = {table:options.middleTable,join:"right",on:`${options.rkey} = ${options.rfkey}`};
            var res = await this.execsql(sqlParse.parseSelectSql(data));
            var objRes = {};
            if(res&&res.length){
                res.forEach(itme=>{
                    if(objRes[itme[options.fkey]]){
                        objRes[itme[options.fkey]].push(itme)
                    }else{
                        objRes[itme[options.fkey]] = [itme];
                    }
                })
            }
            return await objRes
        } catch (error) {
            return  Promise.reject(error)            
        }
    }
}

module.exports = model;
