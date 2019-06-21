const fs = require("fs");
const path = require("path");
const model = imports("models/model");
let {filterChrildId} = imports("util/heper")
let uploadFile = imports("Lib/upload");
const {stactPath} = imports("Config");

module.exports = class {
     // 获取一条article
     /**
     * @param {object} options 
     * @param {string|unmber} id 帖子id
     * @param {string|unmber} a_status 帖子状态,0:忽略状态查询(查所有) 1：正常，2：禁用
     * @param {string|unmber} is_tab 帖子的标签状态 0:忽略状态查询 1：正常，2：禁用
     * @param {Booleam} addRead 
     * 
     */
    static async findId(options={}){
        var {id,a_status=1,is_tab=1,addRead=false} = options;
        if(!id) return await {errmsg:"id is reqiure"};
        var wheres = {"a.id":id};
        a_status!=0? wheres[`a.status`] = a_status:null;
        try {
            // 查一个数据
            var resInfo = await model.findOne({
                table:"tk_article as a",
                field:"a.*,c.name as c_name,c.status as c_status",
                join:{join:'left',table:"tk_cate as c",on:"c.id = a.cid"},
                where:wheres
            })
            if(resInfo){ //如果数据存在
                var tabWhere = is_tab==0?{a_id:id}:{a_id:id,status:is_tab};
                resInfo["tab"]=await model.select({
                    table:"tk_tab",
                    field:"id,name,status",
                    join:{table:"tk_tab_article",join:"right",on:" id = t_id "},
                    where:tabWhere
                })
                // 找上一条 
                resInfo['nextInfo']= await model.findOne({
                    table:"tk_article",
                    field:"id,title,status",
                    where:{id:[">",id],status:1},
                    limit:"0,1",
                    order:{id:"desc"}
                });
                // 找下一条 
                resInfo['prevInfo'] = await  model.findOne({
                    table:"tk_article",
                    field:"id,title,status",
                    where:{id:["<",id],status:1},
                    limit:"0,1",
                    order:{id:"desc"}
                });
                // 访问量加+1
                if(addRead){
                    await model.update({
                        table:"tk_article",
                        where:{id},
                        values:{"readcount":resInfo.readcount+1}
                    });
                }
               
            }
            return  await {data:resInfo};
        } catch (error) {
            return await {errmsg:"server is error"}
        }
    }
    /**find all post
     * @param {object} options 
     * @param {string|unmber} 
     * @param {string|unmber} a_status post 状态,0:忽略状态查询(查所有) 1：正常，2：禁用
     * @param {object} sort post 排序
     * @param {Booleam}  page 
     * @param {Booleam}  limit
     * 
     * 
     */
    static async findAll(options={}){
        var {a_status=1,sort,page=1,limit=10} = options;
        var where = {};
        a_status!=0? (where[`a.status`] = a_status):'';
        try {
            return await this.findCommon({where,order:sort,limit:[page,limit]});
        } catch (error) {
            return await {errmsg:"server is error"}
        }

    }
    /**find cate belong for  post
         * @param {object} options 
         * @param {string|unmber}  cateId
         * @param {string|unmber} a_status post 状态;0:忽略状态查询(查所有); 1：正常;2：禁用
         * @param {string|unmber} c_status cate 状态;0:忽略状态查询(查所有); 1：正常;2：禁用c_status
         * @param {object} sort post 排序
         * @param {Booleam}  page 
         * @param {Booleam}  limit
         * 
         * 
     */
    static async findCateAll(options={}){
        var {cateId="",a_status=1,c_status=1,sort,page=1,limit=10} = options;
        if(!cateId) return await {status:false,mssage:"id is required"};
        // 找cate子集
        var cidArr = await model.select({ table:"tk_cate",field:"id,pid",where:{status:1,id:[">=",cateId]}});
        cidArr = [...filterChrildId(cidArr, "id", "pid", options.cateId),cateId];
        var where = {};
        a_status!=0? (where[`a.status`] = a_status):'';
        where[`a.cid`] = ["in",cidArr];
        where[`c.status`] = c_status;
        try {
            return await this.findCommon({where,order:sort,limit:[page,limit]}); 
        } catch (error) {
           
            return await {errmsg:"server is error"}
        }

    }

     /**find tabs belong for  post
         * @param {object} options 
         * @param {string|unmber} tabId 
         * @param {string|unmber} t_status post 状态,0:忽略状态查询(查所有);1：正常;2：禁用
         * @param {string|unmber} a_status post 状态,0:忽略状态查询(查所有);1：正常;2：禁用
         * @param {object} sort post 排序
         * @param {Booleam}  page 页数
         * @param {Booleam}  limit 单页数
         * 
         * 
     */
    static async findTabAll(options={}){
         let {tabId="",t_status=1,a_status=1,sort,page=1,limit=10} = options;
         if(!tabId) return await {status:false,mssage:"id is required"};
         //tk_tab_article（中间表） 根据tabid查对应的postid  
         var tabWhere = {"t_id":tabId};
         if(t_status)  tabWhere[`status`] = t_status;
         try {
            var tabRes = await model.select({
                table:"tk_tab",
                join:{join:'right',table:"tk_tab_article as ta",on:"id = t_id"},
                where:tabWhere
            })
            // 筛选出tab下所有的postId
            let artId = tabRes.map(itme=>itme.a_id);
            var artWhere = {"a.id":["in",artId]};
            a_status!=0? artWhere[`a.status`] = a_status:'';
            return await this.findCommon({where:artWhere,order:sort,limit:[page,limit]}); 
         } catch (error) {
            return await {errmsg:"server is error"}
         }
    }
     /**find search belong for  post
         * @param {object} options 
         * @param {string|unmber} search 搜索关键词
         * @param {Booleam}  page 页数
         * @param {Booleam}  limit 单页数
         * 
         * 
     */
    static async findSearchAll(options={}){
        let {search="",page=1,limit=10} = options;
        if(!search) return await {status:false,mssage:"search key is required"};
        var where = [{"a.title|a.remark|c.name":["like",`%${search}%`]},{"a.status":1},"and"];
        try {
            return await this.findCommon({where,limit:[page,limit]}); 
        } catch (error) {
            return await {errmsg:"server is error"}
        }
    }

    static async findCommon(option = {where:"",order:{id:"desc"},limit:""}){
        var order =  option.order==undefined ?{[`a.sort`]:"asc",[`a.id`]:"desc"}:option.order;
        return  model.pageSelect({
            table:"tk_article as a",
            field:"a.id,a.title,a.cid,a.thumimg,a.remark,a.readcount,a.status,a.createtime,c.name as cname,c.status as cstatus",
            join:[{join:'left',table:"tk_cate as c",on:"c.id = a.cid"} ],
            order:order,
            limit:option.limit,
            where:option.where
        })
    }
     /**add post
         * @param {object} options 
         * @param {string} title 
         * @param {string}  content 
         * @param {string|Number}  cid 
         * @param {string}  thumimg 
         * @param {string}  remark 
         * @param {string|Booleam}  status 
         * @param {string|Booleam}  sort 
         * 
     */
    static async addPost(options={}){
        try {
            var {title,content,cid='',thumimg,remark,status=1,sort=100,tabList=[]} = options;
            var resInsert = await model.thenAdd({
                    table:"tk_article", 
                    values:{title,content:content,cid,thumimg,remark,readcount:100,status,sort,createtime:(new Date().getTime())}},
                {title});
            
            if(resInsert.type=="exist"){
                return await {errmsg:"title is exist"}
            }else if(resInsert.type=="add"){
                if(tabList&&tabList.length){
                    var resTab =await model.select({table:"tk_tab",field:"id",where:{"id":["in",tabList],status:1}});
                    var resTabId = resTab.map(itme=> {return {t_id:itme.id,a_id:resInsert.id}});
                    if(resTabId.length) await model.add({table:"tk_tab_article",values:resTabId})
                }
                return await {mssage:"add is success",data:resInsert.id}
            }
        } catch (error) {
            return await {errmsg:"server is error"};    
        }   
    }

     /**update switch post
         * @param {array} all 
         * 
     */ 
    static async updateSwitch (arr=[]) {
        if(!Array.isArray(arr)||!arr.length) return await {status:false,errmsg:"arr type is Array and required"}; 
        try {
            await model.updateMany({ table:"tk_article",values:arr, where:{key:"id"}});
            return await {mssage:"update is success"}
          } catch (error) {
            return await {errmsg:"update is fail"};  
        }
    }

     /**update all post
         * @param {object}  options
     */ 
    static async updateAll(options={}){
        let {id,title,content,cid,thumimg,remark,sort,status,tabList=[]} =options;
        try {
            var res = await model.thenUpdate(
                { table:"tk_article",where:{id},values:{title,content,cid,sort,thumimg,remark,status}},
                {id:["!=",id],title});
                // 如果title 存在 提示 
                if(res.type=="exist") return await {errmsg:"title is already exist"};  
                // tk_article 更新成功
                if(res.type=="update"){  
                    // 更新关联表 tk_tab_article
                    var delSql =await model.delete({table:"tk_tab_article",where:{a_id:id},build:true})
                    var sqlArr = [delSql];
                    if(tabList&&tabList.length){
                        var addData = tabList.map(itme=>{ return { a_id:id,t_id:itme } });
                        var addSql =await model.add({table:"tk_tab_article",values:addData,build:true})
                        sqlArr.push(addSql);
                    }
                    // 执行事务（原子性）：
                    await model.transaction(sqlArr);
                    return  await {mssage:"update is success"};
                }
                return  await {mssage:"update is fail"};
        } catch (error) {
            return await {errmsg:"server is error"};
        }
    }

    /**delete one  post
        * @param {string|number}  id 
     */ 
    static  async delete(id=""){
        if(!id) return await {errmsg:"id  is required"}
        try {
             //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
           var resfind = await model.findOne({table:"tk_article",where:{id} });
           if(!resfind) return await {errmsg:"node data,delete is fail"};
           if(resfind.status!=2) return await {errmsg:"删除失败,处于正常状态无法删除"};

            // 先删除中间表tk_tab_article
           var resR =  await model.delete({table:"tk_tab_article",where:{"a_id":id},build:true});
           var resT =  await model.delete({table:"tk_article",where:{id},build:true});
          await model.transaction([resR,resT]);  
          return await {mssage:"detele is success"}        
        } catch (error) {
            console.log(error)
            return await {errmsg:"server is fail"};
        }
    }
    /**上传缩略图
     * * @param {object}  res 
     * * @param {array}  res.files  文件集合
     * * @param {object}  res.fields  字段对象
     * */ 
    static async uploadThum(ctx){
        var dir = await getFileName('/upload/thum');
       
        var res = await uploadFile(ctx,{ maxFieldsSize: 3 * 1024},{dir});
        try {
            var files = res.files;
            var fields = res.fields;
            if (fields && fields.id && files[0].url){
                var res = await model.findOne({table:"tk_article",field:"thumimg",where:{id:fields.id}})
                if(res){ 
                     //修改
                    if(res.thumimg){
                        var filePath = path.join(process.cwd(), stactPath, res.thumimg);
                        if(fs.existsSync(filePath)&&fs.lstatSync(filePath).isFile()){
                            await fs.unlinkSync(filePath); //删除原来的img
                         }
                    }
                    // 更新图片
                    await model.update({table:"tk_article",where:{id:fields.id},values:{ thumimg:files[0].url}})
                }
                // 新增
                var resArr = [{ name: files[0].filename, url: files[0].url }];
            }else{
                var resArr= [];
            }
            return await resArr;
        } catch (error) {
            console.log(error)
            return await [];
        }
    }
    /**上传富文本编辑器的图片
     * */ 
    static async uploadUeImg(ctx){
        try {
            var dir = await getFileName('/upload/thum');
            var res = await uploadFile(ctx,{},{dir});
            var files = res.files;
            var resUrl = files.map((ele)=>{
                return ele.url
            })
            return await  { "errno": 0, "data": resUrl } 
        } catch (error) {
            console.log(error)
            return await  { "code":500, "errno": 1,"data": []} 
        }
    }
}

function getFileName(prex=""){
    const date = new Date();
    let month = Number.parseInt(date.getMonth()) + 1;
    month = month.toString().length > 1 ? month : `0${month}`;
    var dir = `${prex}/${date.getFullYear()}${month}`;
    return dir;
}