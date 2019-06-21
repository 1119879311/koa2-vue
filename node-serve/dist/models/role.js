const model = imports("models/model");
module.exports = class {
    // 根据用户id 查角色
    static async getUserRole(uid = "") {
        try {
            var where = { "r.status": 1, "ur.u_id": uid };
            return await model.select({ table: "tk_user_role ur", where,
                field: "r.id as role_id,r.name as role_name,r.title as role_title,r.pid as role_pid,r.status as role_staus",
                join: [{ table: "tK_role r", join: "right", on: "r.id=ur.r_id" }] });
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    //查一个或者所有的角色 
    static async findUser(id, status) {
        try {
            if (id) return await { data: await model.select({ table: "tk_role", where: { id, status } }) };
            return await { data: await model.select({ table: "tk_role", where: { status } }) };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }
    /**添加角色
        * @param {object} options 
        * @param {string} name 
        * @param {string}  title 
        * @param {string|Number}  status 
        * @param {string}  sort 
        * @param {string}  pid 
        * 
    */
    static async add(options = {}) {
        var { name, title, status = 1, sort = 100 } = options;
        var values = { name, title, status, sort, pid: 1, createtime: new Date().getTime(), updatetime: new Date().getTime() };
        try {
            var resInsert = await model.thenAdd({ table: "tk_role", values }, { name, title, _logic: 'OR' });
            if (resInsert.type == "exist") return await { errmsg: "name or title is already exist" };
            if (resInsert.type == "add") return await { data: resInsert.id, mssage: "add is success" };
            return await { errmsg: "add is fail" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    /**修改角色信息
         * @param {object} options 
         * @param {string|Number}  id          * 
         * @param {string} name 
         * @param {string}  title 
         * @param {string|Number}  status 
         * @param {string}  sort  
     */
    static async update(options = {}) {
        var { id, name, title, status, sort } = options;
        var values = { id, name, title, status, sort, updatetime: new Date().getTime() };
        try {
            var resInsert = await model.thenUpdate({ table: "tk_role", where: { id }, values }, { id: ["!=", id], __complex: { name: name, title: title, _logic: 'OR' } });
            if (resInsert.type == "exist") return { errmsg: "name or contact is already exist" };
            if (resInsert.type == "update") return { data: resInsert.id, mssage: "update is success" };
            return await { errmsg: "update is fail" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    /**update switch 开启，禁用角色
        * @param {array} data [{id:1,status:1}]
     */
    static async switch(data = []) {
        if (!Array.isArray(data) || !data.length) return { errmsg: "data type is Array and required" };
        try {
            await model.updateMany({ table: "tk_role", values: data, where: { key: "id" } });
            return await { mssage: "update is success" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    // 删除一个角色
    static async delete(id) {
        try {
            //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
            var resfind = await model.findOne({ table: "tk_role", where: { id } });
            if (!resfind) return await { errmsg: "角色不存在" };
            if (resfind.status != 2) return await { errmsg: "角色处于正常状态无法删除" };
            var resU = await model.delete({ table: "tk_user_role", where: { r_id: id }, build: true });
            var resR = await model.delete({ table: "tk_role_auth", where: { r_id: id }, build: true });
            var resT = await model.delete({ table: "tk_role", where: { id }, build: true });
            // 执行事务（原子性）：
            await model.transaction([resU, resR, resT]);;
            return await { mssage: "detele is success" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    // 
    /**给角色分配权限
       * @param {string|Number} r_id 角色id
       * @param {array} authArrId 行为id  [1,2,3]
    */
    static async assginAuth(r_id, authArrId = []) {
        try {
            // 先删除原来的auth
            var sqlArr = [await model.delete({ table: "tk_role_auth", where: { r_id }, build: true })];
            // 如果有添加auth
            if (authArrId && authArrId.length) {
                var values = authArrId.map(itme => {
                    return { a_id: itme, r_id };
                });
                sqlArr.push((await model.add({ table: "tk_role_auth", values, build: true })));
            }
            // 执行事务（原子性）：
            await model.transaction(sqlArr);
            return await { mssage: "分配成功" };
        } catch (error) {
            console.log(error);
            return await { errmsg: "server is error" };
        }
    }

};