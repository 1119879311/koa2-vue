const model = imports("models/model");
let {filterChrildId,diGuiAdd} = imports("util/heper")
module.exports = class {
    
     /**获取 all cate
         * @param {String|Number} status default 1 
     */
    static async findAll(status=1){
        try {
            var where = status!=0?{status}:'';
            return {data:await model.select({table:"tk_cate",where})};
        } catch (error) {
            return await {errmsg:"server is error"}
        }
    }


     /**add cate
         * @param {object} options 
         * @param {string} name 
         * @param {string|Number}  pid 
         * @param {string|Number}  sort 
         * @param {string|Number}  status 
     */
    static async add(options={}){
        var {name,pid=0,sort=100,status = 1} = options;
        if(!name) return {errmsg:"name is required"};
        try {
            var values ={name,pid,sort,status,createtime:new Date().getTime()}
            var resInsert = await model.thenAdd({table:"tk_cate",values},{name});
            if(resInsert.type=="exist"){
               return {errmsg:"name is exist"};
            }else if(resInsert.type=="add"){  
                return  {data:resInsert.id,mssage:"add is success"};
            }
            return  await {errmsg:"add is fail"};
        } catch (error) {
            return await {errmsg:"server is error"}           
        }

    }



     /**swtich cate
      * 数据存在上下级关系，更新状态需要同步上下级
         * @param {object} options 
         * @param {Array} data  [ {id:1,status:2} )}] status: 1=>启用 2=>禁用
         * 
     */
    static async swtich(options={}) {
        var {data=[]} = options;
        if(!Array.isArray(data)||!data.length) return {errmsg:"data type is Array and required"}
        try {
            // 1.单个/批量禁用(status=2)：其所有的子级，孙级都要禁用(status=2)，无需关联上级
            // 2.单个/批量开启(status=1)：如果上级处于禁用状态并且不在开启队列里面，不允许开启 , 无需处理其所有的子级孙级
            var status =  data[0]['status'];
            var resCate = await model.select({table:"tk_cate",field:"id,status,pid"});
      
            //如果是更新全部数据，不需要筛选
            if(resCate&&resCate.length==data.length){ 
                await model.updateMany({table:"tk_cate",values:data,where:{key:"id"}})
                return await {mssage:"update is success"}
            }

            if(status==1){ //开启 ：主要是找上级
                // 开启条件  一： 上级存在： 1. 上级属于开启状态，2. 上级在开启的队列  二：没有上级：直接开启
                var resArr = [];
                data.forEach(itme=>{
                    // 找上级
                    var resFilter = filterChrildId(resCate,"pid","id",itme["id"],true);
                    if(resFilter&&resFilter.length) {//存在上级
                        // 迭代上级....
                        var InFlag = true;
                        resFilter.forEach(val=>{
                            // 先判断是在更新队列
                            var flagIn = data.some(v=>v.id==val.id);
                            if(val.status==2&&!flagIn){
                                // 不在更新队列
                                InFlag = false;
                            }
                        })
                        if(InFlag){ //满足开启条件，加入更新队列
                            resArr.push(itme)
                        }
                        
                    }else{ //不存直接加入更新队列
                        resArr.push(itme)
                    }
                })
            
                // 更新的数据又一个不满足更新，不更新，直接  return
                if(resArr&&resArr.length!=data.length){
                    return await {errmsg:"update is fail ,The parent is disabled and  the child  cannot be updated"}
                }   
                await model.updateMany({table:"tk_cate",values:resArr,where:{key:"id"}});
                return await {mssage:"updata is success"}
            
  
            }else if(status==2){ //禁用 ：主要是找子孙级，一起禁用
                var resArr = [];
                data.forEach(itme=>{
                     var idIn = resArr.some(id=>id==itme.id);
                     if(!idIn) resArr = [itme.id,...resArr,...filterChrildId(resCate,"id", "pid",itme['id'])];
                }) 
                resArr = [...new Set(resArr)].map(id=>{ return {id,status}});
  
                await model.updateMany({table:"tk_cate",values:resArr,where:{key:"id"}});
                return await {mssage:"updata is success"}
            }
            return await {errmsg:"updata is fail"} 
        } catch (error) {
            console.log(error)
            return await {errmsg:"server is error"} 
        }
    }


      /**update cate
         * @param {object} options 
         * @param {string|Number}  id 
         * @param {string} name 
         * @param {string|Number}  pid 
         * @param {string|Number}  sort 
     */
    static async update(options={}){
        let {id,name,pid,sort} = options;
        try {
           var res = await model.thenUpdate({table:"tk_cate",where:{id},values:{name,pid,sort}},{id:["!=",id],name});
           if(res.type=="exist") return await {errmsg:"name is exist"};
           if(res.type=="update") return await {data:res.id,mssage:"update is success"}
           return await {errmsg:"udpate is fail"}
        } catch (error) {
            return await {errmsg:"server is error"}
        }

    }
     /**delete cate
       * 数据存在上下级关系，删除cate,如果当前cate存在子级，需要把子级的父级pid 修改为自己的pid(顶级为pid=0)
         * @param {string|Number}  id 
     */
    static async del(id=""){
        if(!id) return await {errmsg:"id is required"};
        try {
            // 根据id 查 是否存在status==2 的数据
            var findRes = await model.findOne({table:"tk_cate",where:{id}});
            if(!findRes) return await {errmsg:"delete is fail ,no data"}
            if(findRes.status!=2) return {errmsg:"delete is fail ,data is activation state"};
            // 找子集
            var childRes = await model.select({table:"tk_cate",field:"id",where:{pid:id}});
            // 存在子集，对pid进行升级
            if(childRes&&childRes.length){
                var pid = findRes.pid?findRes.pid:0;
                var updateData =  childRes.map(val=>{ if(val.id!=id){ return {id:val.id,pid} } });
                await model.updateMany({table:"tk_cate",values:updateData,where:{key:"id"}})
            }
            await model.delete({table:"tk_cate",where:{id}});
            return  await {mssage:"update is success"}; 
        } catch (error) {
            console.log(error)
            return await {errmsg:"server is error"}            
        }
    }



    // 分组统计分类 (根据article)
     /**
     * @param {String|Number} c_status default 1 cate 状态
     * @param {String|Number} a_status default 1  post 状态
     * 
     */
    static async groupCate(option){
        var {c_status=1,a_status=1} = option;
         // 默认是1， 全部是0, 开启是1，禁用是2
        var postWhere= a_status!=0? ["a.cid=c.id",{"a.status":a_status},"and"]:["a.cid=c.id"];
        var coutSql = await model.count({table:"tk_article as a",values:"a.id",where:postWhere,build:true});
         // 默认是1， 全部是0, 开启是1，禁用是2
        var cateWhere = c_status!=0?{"c.status":c_status}:"";
        try {
            var res =  await model.select({table:"tk_cate as c",field:`c.*,(${coutSql}) as count`,where:cateWhere,group:"c.id"});
            return await {data: diGuiAdd(res)}
        } catch (error) {
          
            return await {errmsg:"server is error"}
        }
    }











}