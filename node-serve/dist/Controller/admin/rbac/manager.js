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
const userModel = imports("models/user");
const userLogic = imports("logic/user");
const roleBase = imports("Controller/admin/role_base");

// 该模块属于权限管理的用户模块，所有请求需要授权

let index = (_dec = Controller("/manager"), _dec2 = GET("/"), _dec3 = POST("/add"), _dec4 = POST("/update"), _dec5 = POST("/delete"), _dec6 = POST("/swtich"), _dec7 = POST("/assginRole"), _dec(_class = (_class2 = class index extends roleBase {
    async findUser(ctx, next) {
        let { id } = ctx.request.query;
        if (id) {
            ctx.body = await ctx.send((await userModel.findOneUser(id)));
        } else {
            ctx.body = await ctx.send((await userModel.findAllUser(ctx.request.query)));
        }
    }

    /**
     * @param POST /manager/add
     * @param option { username,password,state}
     * @parma return 
     **/

    //添加 user
    async add(ctx, next) {
        var { name, password, contact } = ctx.request.body;
        // 数据验证
        var validRes = await userLogic.addUser({ name, password, contact });
        if (validRes) return ctx.body = await ctx.error(validRes);
        ctx.body = await ctx.send((await userModel.add(ctx.request.body)));
    }

    //更新 user (改name,state状态,password)
    async update(ctx, next) {
        var { id, name, password, contact, status } = ctx.request.body;
        // 数据验证
        if (!id) return ctx.body = await ctx.error("id is must required");
        var validRes = await userLogic.editUser({ name, password, contact, status });
        if (validRes) return ctx.body = await ctx.error(validRes);
        ctx.body = await ctx.send((await userModel.update(ctx.request.body)));
    }

    //删除 user
    async delete(ctx, next) {
        let { id } = ctx.request.body;
        if (!id) return ctx.body = await ctx.error("id  is required");
        ctx.body = await ctx.send((await userModel.delete(id)));
    }
    /**单个/批量修改状态
     * @param {object} ctx.request.body 
     * @param {array} data =>[{id:1,status:1}]
     * */

    async swtich(ctx, next) {
        var { data } = ctx.request.body;
        ctx.body = await ctx.send((await userModel.switch(data)));
    }

    // 分配角色
    /**
    * @param POST /manager/assginRole
    * @param {number} id 
    * @param {array} roleArrId [1,2] or [{id,1,id:2}]
    **/

    async assginRole(ctx, next) {
        var { id, roleArrId } = ctx.request.body;
        if (Object.prototype.toString.call(roleArrId) == "[object Object]") {
            roleArrId = Object.values(roleArrId);
        }
        if (!id || !Array.isArray(roleArrId)) {
            return ctx.body = await ctx.error("id  is required or roleArrId type is array");
        }
        ctx.body = await ctx.send((await userModel.assginRole(id, roleArrId)));
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "findUser", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "findUser"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "delete"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swtich", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "swtich"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "assginRole", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "assginRole"), _class2.prototype)), _class2)) || _class);

module.exports = index;