const model = imports("models/model");
module.exports = class {

    /**获取 all tab
        * @param {String|Number} status default 1 
    */
    static async findAll(status = 1) {
        try {
            var where = status != 0 ? { status } : '';
            return { data: await model.select({ table: "tk_tab", where }) };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    /**add tab
         * @param {object} options 
         * @param {string} name 
         * @param {string|Number}  status default 1 
     */
    static async add(options = {}) {
        let { name, status = 1 } = options;
        if (!name) return await { errmsg: "name is required" };
        try {
            var resInsert = await model.thenAdd({ table: "tk_tab", values: { name, status, createtime: new Date().getTime() } }, { name });
            if (resInsert.type == "exist") return await { errmsg: "name is exist" };
            if (resInsert.type == "add") return await { data: resInsert.id, mssage: "add is success" };
            return await { errmsg: "add is fail" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }
    /** update tab
        * @param {object} options 
        * @param {string} name 
        * @param {string|Number}  status default 1 
    */
    static async update(options = {}) {
        var { id, name, status = 1 } = options;
        if (!id || !name) return await { errmsg: "id or name is required" };
        try {
            var res = await model.thenUpdate({ table: "tk_tab", values: { name, status }, where: { id } }, { id: ["!=", id], name });
            if (res.type == "exist") return await { errmsg: "name is exist" };
            if (res.type == "update") return await { data: res.id, mssage: "update is success" };
            return await { errmsg: "udpate is fail" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    /**update switch post
         * @param {array} data 
     */
    static async switch(data = []) {
        if (!Array.isArray(data) || !data.length) return { errmsg: "data type is Array and required" };
        try {
            await model.updateMany({ table: "tk_tab", values: data, where: { key: "id" } });
            return await { mssage: "update is success" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    /**delete  tab
         * @param {string|number} id 
     */
    static async del(id = '') {
        if (!id) return await { errmsg: "id  is required" };
        //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
        var resfind = await model.findOne({ table: "tk_tab", where: { id } });
        if (!resfind) return await { errmsg: "delete is fail ,no data" };
        if (resfind.status != 2) return { errmsg: "delete is fail ,data is activation state"
            // 先删除中间表tk_tab_article
        };try {
            var resR = await model.delete({ table: "tk_tab_article", where: { "t_id": id }, build: true });
            var resT = await model.delete({ table: "tk_tab", where: { id }, build: true });
            await model.transaction([resR, resT]);
            return await { mssage: "detele is success" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    // 分组统计分类 (根据article)
    static async groupTab(option = {}) {
        var { a_status = 1, t_status = 1 } = option;
        // 默认是1， 全部是0, 开启是1，禁用是2
        var { t_status = 1, a_status = 1 } = option;
        var having = t_status != 0 ? { "t.status": t_status } : '';
        var where = a_status != 0 ? { "a.status": a_status } : '';
        try {
            var reTa = await model.select({ table: "tk_tab_article as ta", field: "ta.t_id,count(*) as count", where, group: "ta.t_id", join: { join: "left", table: "tk_article as a", on: "a.id=ta.a_id" }, build: true });
            var res = await model.select({ table: "tk_tab as t", field: "t.name,t.status,t.id,b.count", join: `left join (${reTa}) b on b.t_id=t.id`, where: having });
            res.forEach(ele => ele.count ? ele.count : ele.count = 0);
            return await { mssage: "select is success", data: res };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }
    // 实际 sql：
    //var c =  (select ta.t_id,count(*) as count from tk_tab_article as ta left join tk_article as a on a.id=ta.a_id where a.status=1 group by ta.t_id) b; 
    //select t.name,t.status,t.id,b.count from tk_tab as t left join (c) b on b.t_id=t.id;

};