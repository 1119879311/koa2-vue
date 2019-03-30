"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

<<<<<<< HEAD
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _desc, _value, _class2;

var _router = require("../../lib/router");
=======
var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2;

var _router_decorator = require("../../util/router_decorator");
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2

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

<<<<<<< HEAD
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
=======
let auth = (_dec = (0, _router_decorator.Controller)("/rbac/auths"), _dec2 = (0, _router_decorator.GET)("/"), _dec3 = (0, _router_decorator.POST)("/add"), _dec4 = (0, _router_decorator.POST)("/edit"), _dec(_class = (_class2 = class auth extends _base2.default {
    async get(ctx, next) {
        var { status, id } = ctx.request.query;
        var where = status ? { status } : {};
        if (id) {
            var res = await ctx.model.table("tk_auth").where([where, { id }]).findOne();
            var authGrup = await ctx.model.table("tk_auth").where(where).field("g_name").group("g_name").select();
            res ? res["authGrup"] = authGrup : '';
            return ctx.body = await { code: 200, status: true, mssage: "find is success", result: res };
        }
        var res = await ctx.model.table("tk_auth as a").where(where).select();
        var resObj = [];
        res.forEach(element => {
            var resItme = resObj.filter(itme => itme.nameGroup == element.g_name);
            if (!resItme.length) {
                resObj.push({ "nameGroup": element.g_name, data: [element] });
                return;
            };
            resItme[0]["data"].push(element);
        });
        ctx.body = await { code: 200, status: true, mssage: "find is success", result: resObj };
    }

    async add(ctx, next) {
        var { name, url, status = 1, g_name = "默认分组", pid = 1 } = ctx.request.body;
        // var res=g_id==1?1: await ctx.model.table("tk_auth_group").where({"gid":g_id}).findOne();
        // if(!res) return ctx.body = await {code:"-1",status:false,mssage:"no auth group",result:""}
        var validRes = await _auth2.default.addAuth({ name, url, g_name });
        if (validRes) return ctx.body = await validRes;
        var options = {
            name, url, status, g_name,
            create_time: new Date().getTime(),
            update_time: new Date().getTime()
        };
        var resInsert = await ctx.model.table("tk_auth").thenAdd(options, { name, url, _logic: 'OR' });
        if (resInsert.type == "exist") {
            return ctx.body = await { code: -101, state: false, mssage: "name or url  is exist", result: "" };
        }
        return ctx.body = await { code: 200, state: true, mssage: "add is success", result: "" };
    }

    async edit(ctx, next) {
        var { name, url, status = 1, g_name = "默认分组", pid = 1 } = ctx.request.body;
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "get", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "get"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "edit", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "edit"), _class2.prototype)), _class2)) || _class);
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
exports.default = auth;