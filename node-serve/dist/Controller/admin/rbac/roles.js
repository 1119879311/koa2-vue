var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _desc, _value, _class2;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

const { Controller, POST, GET } = imports("Lib/router");
const roleModel = imports("models/role");
const roleLogic = imports("logic/role");
const roleBase = imports("Controller/admin/role_base");

// 该模块属于权限管理的角色模块，所有请求需要授权

let index = (_dec = Controller("/role"), _dec2 = GET("/"), _dec3 = POST("/add"), _dec4 = POST("/update"), _dec5 = POST("/delete"), _dec6 = POST("/swtich"), _dec7 = POST("/assginAuth"), _dec(_class = (_class2 = class index extends roleBase {
    async findUser(ctx, next) {
        let { id, status } = ctx.request.query;
        ctx.body = await ctx.send((await roleModel.findUser(id, status)));
    }

    /**添加 角色
     * @param POST /role/add
     * @param body {  name,title,status=1,pid=1,sort}
    * @param return {code,mssage/errmsg,data,status}
     **/

    async add(ctx, next) {
        var { name, title } = ctx.request.body;
        // 验证数据
        var validRes = await roleLogic.veryRole({ name, title });
        if (validRes) return ctx.body = await ctx.error(validRes);
        ctx.body = await ctx.send((await roleModel.add(ctx.request.body)));
    }
    /**修改角色
     * @param POST /role/update
     * @param body { id, name,title,status=1,pid=1,sort}
     * @param return {code,mssage/errmsg,data,status}
     **/

    async update(ctx, next) {
        var { id, name, title, status = 1, pid = 1, sort } = ctx.request.body;
        // 数据验证
        if (!id) return ctx.body = await ctx.error("id is must required");
        var validRes = await roleLogic.veryRole({ name, title });
        if (validRes) return ctx.body = await ctx.error(validRes);
        ctx.body = await ctx.send((await roleModel.update(ctx.request.body)));
    }
    /**删除角色
     * @param POST /role/del
     * @param body { id}
     * @param return {code,mssage/errmsg,data,status}
     **/
    //删除role
    async delete(ctx, next) {
        let { id } = ctx.request.body;
        if (!id) return ctx.body = await ctx.error("id  is required");
        ctx.body = await ctx.send((await roleModel.delete(id)));
    }

    /**单个/批量修改状态
     * @param {object} ctx.request.body 
     * @param {array} data =>[{id:1,status:1}]
     * @param return {code,mssage/errmsg,data,status}    
     * */

    async swtich(ctx, next) {
        var { data } = ctx.request.body;
        ctx.body = await ctx.send((await roleModel.switch(data)));
    }

    /**给角色分配权限行为
    * @param POST /manager/assginRole
    * @param {number} id 
    * @param {array} authArrId [1,2] or [{id,1,id:2}]
    * @param return {code,mssage/errmsg,data,status}   
    **/

    async assginAuth(ctx, next) {
        var { id, authArrId } = ctx.request.body;
        if (Object.prototype.toString.call(authArrId) == "[object Object]") {
            authArrId = Object.values(authArrId);
        }
        if (!id || !Array.isArray(authArrId)) {
            return ctx.body = await ctx.error("id  is required or authArrId type is array");
        }
        ctx.body = await ctx.send((await roleModel.assginAuth(id, authArrId)));
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "findUser", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "findUser"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "delete"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swtich", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "swtich"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "assginAuth", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "assginAuth"), _class2.prototype)), _class2)) || _class);

module.exports = index;