"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _desc, _value, _class2;

var _router = require("../../lib/router");

var _base = require("../base");

var _base2 = _interopRequireDefault(_base);

var _auth = require("../../logic/auth");

var _auth2 = _interopRequireDefault(_auth);

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

let auth = (_dec = (0, _router.Controller)("/rbac/auth"), _dec2 = (0, _router.GET)("/"), _dec3 = (0, _router.POST)("/add"), _dec4 = (0, _router.POST)("/update"), _dec5 = (0, _router.POST)("/swtich"), _dec6 = (0, _router.POST)("/delete"), _dec(_class = (_class2 = class auth extends _base2.default {
    async get(ctx, next) {
        /**
         * status {Nnmber} 1 or 2 状态
         * id {Nnmber} auth 的id
         * roleId {array} 角色的ID 查 一个角色的权限
         */
        var { status, id, roleId } = ctx.request.query;
        var where = status ? { status } : {};
        try {
            if (id) {
                var res = await ctx.model.table("tk_auth").where([where, { id }]).order("groupName").findOne();
                return ctx.body = await ctx.success({ data: res });
            }
            var res = await ctx.model.table("tk_auth as a").where({ status }).order("groupName desc,id desc").select();

            if (res && roleId) {
                var resrole = await ctx.model.table("tk_role_auth as ra").field("a.groupName,ra.a_id").where({ "a.status": 1, "ra.r_id": roleId }).join({ table: "tk_auth as a", join: "left", on: "a.id=ra.a_id" }).select();
            }
            return ctx.body = await ctx.success({ data: res, roleAuth: resrole });
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }
    // 添加auth

    async add(ctx, next) {
        var { name, identName, url, status = 1, groupName = "" } = ctx.request.body;
        var validRes = await _auth2.default.veryAuth({ name, url, identName });
        if (validRes) return ctx.body = await ctx.error(validRes);
        var options = {
            name, identName, url, status, groupName,
            createtime: new Date().getTime(),
            updatetime: new Date().getTime()
        };
        try {
            var resInsert = await ctx.model.table("tk_auth").thenAdd(options, { name, identName, url, _logic: 'OR' });

            if (resInsert.type == "exist") {
                return ctx.body = await ctx.error("name or identName or url  is exist");
            }
            return ctx.body = await ctx.success("add is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }

    //编辑

    async update(ctx, next) {
        var { id, name, identName, url, status, groupName } = ctx.request.body;

        if (!id) {
            return ctx.body = await { status: false, code: 401, msg: "id  is required" };
        }
        // 数据验证
        var validRes = await _auth2.default.veryAuth({ name, url, identName, groupName });
        if (validRes) return ctx.body = await ctx.error(validRes);

        try {
            var res = await ctx.model.table("tk_auth").where({ id }).thenUpdate({ name, identName, url, status, groupName, updatetime: new Date().getTime() }, { id: ["!=", id], __complex: { name, identName, url, _logic: 'OR' } });

            if (res.type == "exist") {
                return ctx.body = await ctx.error("name or identName or url  is exist");
            }
            return ctx.body = await ctx.success("update is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }
    // 更新状态

    async switch(ctx, next) {
        /**
         * data {array} [a_id];
         */
        var { data = [] } = ctx.request.body;
        try {
            var res = await ctx.model.table("tk_auth").updateMany(data, { key: "id" });
            return ctx.body = await ctx.success({ mssage: "update is success", data: res });
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }
    //删除

    async delete(ctx, next) {
        var { id } = ctx.request.body;
        if (!id) {
            return ctx.body = await ctx.error("id  is required");
        }
        try {
            //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
            var resfind = await ctx.model.table("tk_auth").where({ id, status: 2 }).findOne();
            if (!resfind) return ctx.body = await ctx.error("detele is fail");

            var resR = await ctx.model.table("tk_role_auth").where({ "t_id": id }).buildSql().delete();
            var resT = await ctx.model.table("tk_auth").where({ id }).buildSql().delete();
            // 执行事务（原子性）：
            await ctx.model.transaction([resR, resT]);
            return ctx.body = await ctx.success({ mssage: "detele is success", data: res });
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "get", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "get"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "switch", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "switch"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "delete"), _class2.prototype)), _class2)) || _class);
exports.default = auth;