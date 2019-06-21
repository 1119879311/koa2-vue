const model = imports("models/model");
const roleModel = imports("models/role");
const { signRonder, md5 } = imports("util/heper");

module.exports = class {

    // 查所有用户
    static async findAllUser(options = {}) {
        let { pageNum, pageSize } = options;
        try {
            var res = await model.select({ table: "tk_user as u", group: "u.id", limit: [pageNum, pageSize],
                field: "u.id,u.name,u.contact,u.isRoot,u.status,u.createtime,group_concat(concat_ws('-',r.id,r.title,r.status) separator '，') as role",
                join: ["left join tk_user_role ur on ur.u_id =u.id", "left join tk_role as r  on r.id = ur.r_id"]
            });
            var resCout = await model.count({ table: "tk_user" });
            // 对用户的角色进行数组对象处理
            if (res && res.length) {
                res.forEach(element => {
                    if (!element["role"]) return element["role"] = [];
                    element["role"] = element["role"].split('，').map(itme => {
                        var val = itme.split("-");
                        return { id: val[0], name: val[1], status: val[2] };
                    });
                });
            }
            return await { count: resCout[0]['count'], data: res };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    //查一个用户(包含它的角色) 
    static async findOneUser(id = "") {
        if (!id) return await { errmsg: "id is required" };
        // 查用户
        try {
            var res = await model.findOne({ table: "tk_user as u", field: "u.id,u.name,u.contact,u.isRoot,u.status,u.createtime", where: { id } });
            if (!res) return await { errmsg: "no user" };
            res["user_role"] = await roleModel.getUserRole(id);
            return await { data: res };
        } catch (error) {

            return await { errmsg: "server is error" };
        }
    }
    //添加一个管理员用户
    static async add(options = {}) {
        let { name, password, status = 1, contact } = options;
        var values = { name, status, contact,
            password: md5(password),
            token: signRonder(48) + new Date().getTime(),
            createtime: new Date().getTime(),
            updatatime: new Date().getTime()
        };
        try {
            var resInsert = await model.thenAdd({ table: "tk_user", values }, { name, contact, _logic: 'OR' });
            if (resInsert.type == "exist") return { errmsg: "name or contact is already exist" };
            if (resInsert.type == "add") return { data: resInsert.id, mssage: "add is success" };
            return await { errmsg: "add is fail" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    // 更新一个管理员用户
    static async update(options = {}) {
        var { id, name, password, contact, status } = options;
        var values = { name, contact, status: status, updatatime: new Date().getTime() };
        //Prevent password is empty to Be modified;
        if (password && password.trim()) values["password"] = md5(password);

        try {
            var resInsert = await model.thenUpdate({ table: "tk_user", where: { id }, values }, { id: ["!=", id], __complex: { name, contact, _logic: 'OR' } });

            if (resInsert.type == "exist") return { errmsg: "name or contact is already exist" };
            if (resInsert.type == "update") return { data: resInsert.id, mssage: "update is success" };
            return await { errmsg: "update is fail" };
        } catch (error) {
            console.log(error);
            return await { errmsg: "server is error" };
        }
    }
    // 删除一个管理员(如果是超级管理不可删除)
    static async delete(id) {
        try {
            //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
            var resfind = await model.findOne({ table: "tk_user", where: { id } });
            if (!resfind) return await { errmsg: "管理员不存在" };
            if (resfind.isAdmin == 1) return await { errmsg: "超级管理员无法删除" };
            if (resfind.status != 2) return await { errmsg: "管理员处于正常状态无法删除" };
            var resR = await model.delete({ table: "tk_user_role", where: { "u_id": id }, build: true });
            var resT = await model.delete({ table: "tk_user", where: { id }, build: true });
            // 执行事务（原子性）：
            await model.transaction([resR, resT]);
            return await { mssage: "detele is success" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    /**update switch 开启，禁用管理员
        * @param {array} data [{id:1,status:1}]
    */
    static async switch(data = []) {
        if (!Array.isArray(data) || !data.length) return { errmsg: "data type is Array and required" };
        try {
            await model.updateMany({ table: "tk_user", values: data, where: { key: "id" } });
            return await { mssage: "update is success" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    // 给管理员分配角色
    static async assginRole(u_id, roleArrId = []) {
        try {
            // 先删除原来的role
            var sqlArr = [await model.delete({ table: "tk_user_role", where: { u_id }, build: true })];
            // 如果有添加role
            if (roleArrId && roleArrId.length) {
                var values = roleArrId.map(itme => {
                    return { r_id: itme, u_id };
                });
                sqlArr.push((await model.add({ table: "tk_user_role", values, build: true })));
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