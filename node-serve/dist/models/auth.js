const model = imports("models/model");

module.exports = class {

    // 根据一个角色查它的有效权限(status=1)
    static async findRoleAuth(r_id = '') {
        return model.select({ table: "tk_role_auth as ra", field: "a.groupName,ra.a_id",
            where: { "a.status": 1, "ra.r_id": r_id }, join: { table: "tk_auth as a", join: "left", on: "a.id=ra.a_id" } });
        table("tk_role_auth as ra");
    }
    // 根据状态查所有权限行为
    static async findAll(status) {
        return await model.select({ table: "tk_auth", where: { status } });
    }
    //添加
    static async add(options = {}) {
        let { name, identName, url, status = 1, groupName = "" } = options;
        var values = { name, identName, url, status, groupName,
            createtime: new Date().getTime(),
            updatetime: new Date().getTime()
        };
        try {
            var resInsert = await model.thenAdd({ table: "tk_auth", values }, { name, identName, url, _logic: 'OR' });
            if (resInsert.type == "exist") return { errmsg: "name or identName or url is already exist" };
            if (resInsert.type == "add") return { data: resInsert.id, mssage: "add is success" };
            return await { errmsg: "add is fail" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    // 更新
    static async update(options = {}) {
        var { id, name, identName, url, status, groupName } = options;
        var values = { name, identName, url, status, groupName, updatetime: new Date().getTime() };
        try {
            var resInsert = await model.thenUpdate({ table: "tk_auth", where: { id }, values }, { id: ["!=", id], __complex: { name, identName, url, _logic: 'OR' } });
            if (resInsert.type == "exist") return { errmsg: "name or identName or url  is exist" };
            if (resInsert.type == "update") return { data: resInsert.id, mssage: "update is success" };
            return await { errmsg: "update is fail" };
        } catch (error) {
            console.log(error);
            return await { errmsg: "server is error" };
        }
    }
    // 删除一个权限行为
    static async delete(id) {
        try {
            //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
            var resfind = await model.findOne({ table: "tk_auth", where: { id } });
            if (!resfind) return await { errmsg: "find no data" };
            if (resfind.status != 2) return await { errmsg: "处于正常状态无法删除" };
            var resR = await model.delete({ table: "tk_role_auth", where: { "a_id": id }, build: true });
            var resT = await model.delete({ table: "tk_auth", where: { id }, build: true });
            // 执行事务（原子性）：
            await model.transaction([resR, resT]);
            return await { mssage: "detele is success" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    /**update switch 开启，禁用权限行为
        * @param {array} data [{id:1,status:1}]
    */
    static async switch(data = []) {
        if (!Array.isArray(data) || !data.length) return { errmsg: "data type is Array and required" };
        try {
            await model.updateMany({ table: "tk_auth", values: data, where: { key: "id" } });
            return await { mssage: "update is success" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

};