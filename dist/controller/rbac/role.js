"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _desc, _value, _class2;

var _router = require("../../lib/router");

var _base = require("../base");

var _base2 = _interopRequireDefault(_base);

var _role = require("../../logic/role");

var _role2 = _interopRequireDefault(_role);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

let _default = (_dec = (0, _router.Controller)("/rbac/role"), _dec2 = (0, _router.GET)("/"), _dec3 = (0, _router.POST)("/add"), _dec4 = (0, _router.POST)("/update"), _dec5 = (0, _router.POST)("/delete"), _dec6 = (0, _router.POST)("/swtich"), _dec7 = (0, _router.POST)("/assginAuth"), _dec(_class = (_class2 = class _default extends _base2.default {
    constructor() {
        super();
    }

    async index(ctx, next) {
        var { id, status } = ctx.request.query;
        try {
            if (id) {
                var res = await ctx.model.table("tk_role").where({ id, status }).findOne();
            } else {
                var res = await ctx.model.table("tk_role as r").where({ status }).select();
            }
            return ctx.body = await ctx.success({ mssage: "select is success", data: res });
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }

    async add(ctx, next) {
        var { name, title, status = 1, sort = 100, pid = 1 } = ctx.request.body;
        // 验证数据
        var validRes = await _role2.default.veryRole({ name, title });
        if (validRes) return ctx.body = await ctx.error(validRes);
        var options = {
            name, title, status, sort, pid,
            createtime: new Date().getTime(),
            updatetime: new Date().getTime()
        };

        try {
            var resInsert = await ctx.model.table("tk_role").thenAdd(options, { name, title, _logic: 'OR' });

            if (resInsert.type == "exist") {
                return ctx.body = await ctx.error("name or title  is exist");
            }
            return ctx.body = await ctx.success("add is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }

    async update(ctx, next) {
        var { id, name, title, status = 1, pid = 1, sort } = ctx.request.body;
        // 数据验证
        var validRes = await _role2.default.veryRole({ name, title });
        if (validRes) return ctx.body = await ctx.error(validRes);

        var options = { id, name, title, status, pid, sort, updatetime: new Date().getTime() };
        try {
            var res = await ctx.model.table("tk_role").where({ id }).thenUpdate(options, { id: ["!=", id], __complex: { name: name, title: title, _logic: 'OR' } });

            if (res.type == "exist") {
                return ctx.body = await ctx.error("name or title  is exist");
            }
            return ctx.body = await ctx.success("update is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }
    //删除

    async delete(ctx, next) {
        var { id } = ctx.request.body;
        if (!id) {
            return ctx.body = await { status: false, code: 401, msg: "roleId  is required" };
        }
        try {
            //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
            var resfind = await ctx.model.table("tk_role").where({ id, status: 2 }).findOne();
            if (!resfind) return ctx.body = await { code: -101, status: false, mssage: "正常状态无法删除", data: "" };

            var resU = await ctx.model.table("tk_user_role").where({ "r_id": id }).buildSql().delete();
            var resR = await ctx.model.table("tk_role_auth").where({ "r_id": id }).buildSql().delete();
            var resT = await ctx.model.table("tk_role").where({ id }).buildSql().delete();
            // 执行事务（原子性）：
            await ctx.model.transaction([resU, resR, resT]);
            return ctx.body = await ctx.success("detele is success");
        } catch (error) {
            return ctx.body = await { code: -101, status: false, mssage: error || "server is error" };
        }
    }

    //  更新状态

    async switch(ctx, next) {
        var { data = [] } = ctx.request.body;
        try {
            var res = await ctx.model.table("tk_role").updateMany(data, { key: "id" });
            return ctx.body = await ctx.success("update is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }
    //分配权限

    async assginRole(ctx, next) {
        var { id, authArrId = {} } = ctx.request.body;
        console.log(authArrId);
        if (Object.prototype.toString.call(authArrId) == "[object Object]") {
            authArrId = Object.values(authArrId);
        }
        if (!id || !Array.isArray(authArrId)) {
            return ctx.body = await ctx.error("roleid  is required or authArrId type is array");
        }

        try {
            // 先删除原来的auth
            var sqlArr = [await ctx.model.table("tk_role_auth").where({ r_id: id }).buildSql().delete()];
            // 如果有添加auth
            if (authArrId && authArrId.length) {
                var addData = authArrId.map(itme => {
                    return { a_id: itme, r_id: id };
                });
                var addSql = await ctx.model.table("tk_role_auth").buildSql().add(addData);
                sqlArr.push(addSql);
            }
            // 执行事务（原子性）：
            await ctx.model.transaction(sqlArr);
            return ctx.body = await ctx.success("分配成功");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "delete"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "switch", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "switch"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "assginRole", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "assginRole"), _class2.prototype)), _class2)) || _class);

exports.default = _default;