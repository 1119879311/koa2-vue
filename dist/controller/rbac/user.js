"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _desc, _value, _class2;

var _router = require("../../lib/router");

var _base = require("../base");

var _base2 = _interopRequireDefault(_base);

var _tk_user_role = require("../../model/tk_user_role");

var _tk_user_role2 = _interopRequireDefault(_tk_user_role);

var _user = require("../../logic/user");

var _user2 = _interopRequireDefault(_user);

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

let _default = (_dec = (0, _router.Controller)("/rbac/user"), _dec2 = (0, _router.GET)("/"), _dec3 = (0, _router.POST)("/add"), _dec4 = (0, _router.POST)("/update"), _dec5 = (0, _router.POST)("/swtich"), _dec6 = (0, _router.POST)("/delete"), _dec7 = (0, _router.POST)("/assginRole"), _dec(_class = (_class2 = class _default extends _base2.default {
    constructor() {
        super();
    }

    async index(ctx, next) {
        var { id, pageNum, pageSize } = ctx.request.query;
        try {
            if (id) {
                var res = await ctx.model.table("tk_user as u").noField("password").where({ "u.id": id }).findOne();
                console.log((await _tk_user_role2.default.getRole(id)));
                if (res) {
                    res["user_role"] = await _tk_user_role2.default.getRole(id);
                }
                return ctx.body = await ctx.success({ data: res });
            } else {
                var res = await ctx.model.table("tk_user as u").noField("password").field("group_concat(concat_ws('-',r.title,r.status) separator '，') as role").join(["left join tk_user_role ur on ur.u_id =u.id", "left join tk_role as r  on r.id = ur.r_id"]).group("u.id").limit([pageNum, pageSize]).select();

                var resCout = await ctx.model.table("tk_user").count();
                // 对用户的角色进行数组对象处理
                if (res && res.length) {
                    res.forEach(element => {
                        if (!element["role"]) return element["role"] = [];
                        element["role"] = element["role"].split('，').map(itme => {
                            var val = itme.split("-");
                            return { name: val[0], status: val[1] };
                        });
                    });
                }
                return ctx.body = await ctx.success({ count: resCout[0]['count'], data: res });
            }
        } catch (error) {
            console.log(error);
            return ctx.body = await ctx.error(error);
        }
    }

    async add(ctx, next) {
        var { name, password, status = 1, contact } = ctx.request.body;
        // 数据验证
        var validRes = await _user2.default.addUser({ name, password, contact });
        if (validRes) return ctx.body = await ctx.error(validRes);

        var options = { name, status, contact,
            password: ctx.heper.md5(password),
            token: ctx.heper.signRonder(48) + new Date().getTime(),
            createtime: new Date().getTime(),
            updatatime: new Date().getTime()
        };
        try {
            var resInsert = await ctx.model.table("tk_user").thenAdd(options, { name, contact, _logic: 'OR' });
            // if name or contac is exits ,then add is fail...
            if (resInsert.type == "exist") {
                return ctx.body = await ctx.error("name or contact  is exist");
            }
            return ctx.body = await ctx.success("add is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }

    async put(ctx, next) {
        var { id, name, password, contact, status } = ctx.request.body;
        // 数据验证
        if (!id) return ctx.body = await ctx.error("id is must required");
        var validRes = await _user2.default.editUser({ name, password, contact, status });
        if (validRes) return ctx.body = await ctx.error(validRes);

        var options = { name, contact, status: status, updatatime: new Date().getTime() };
        //Prevent password is empty to Be modified;
        if (password && password.trim()) {
            options["password"] = ctx.heper.md5(password);
        }

        try {
            var res = await ctx.model.table("tk_user").where({ id }).thenUpdate(options, { id: ["!=", id], __complex: { name, contact, _logic: 'OR' } });

            if (res.type == "exist") {
                return ctx.body = await ctx.error("name or contact  is exist");
            }
            return ctx.body = await ctx.success("update is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }

    async swtich(ctx, next) {
        var { data = [] } = ctx.request.body;
        try {
            await ctx.model.table("tk_user").updateMany(data, { key: "id" });
            return ctx.body = await ctx.success("update is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }
    //删除

    async delete(ctx, next) {
        var { id } = ctx.request.body;
        if (!id) return ctx.body = await ctx.error("id  is required");

        try {
            //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
            var resfind = await ctx.model.table("tk_user").where({ id, status: 2 }).findOne();
            if (!resfind) return ctx.body = await { code: -101, status: false, mssage: "正常状态无法删除", data: "" };

            var resR = await ctx.model.table("tk_user_role").where({ "u_id": id }).delete();
            var resT = await ctx.model.table("tk_user").where({ id }).delete();
            // 执行事务（原子性）：
            await ctx.model.transaction([resR, resT]);
            return ctx.body = await ctx.success("detele is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }
    //分配角色

    async assginRole(ctx, next) {
        var { id, roleArrId } = ctx.request.body;
        if (Object.prototype.toString.call(roleArrId) == "[object Object]") {
            roleArrId = Object.values(roleArrId);
        }
        if (!id || !Array.isArray(roleArrId)) {
            return ctx.body = await ctx.error("id  is required or roleArrId type is array");
        }
        try {
            // 先删除原来的role
            var sqlArr = [await ctx.model.table("tk_user_role").where({ u_id: id }).buildSql().delete()];
            // 如果有添加role
            if (roleArrId && roleArrId.length) {
                var addData = roleArrId.map(itme => {
                    return { r_id: itme, u_id: id };
                });
                var addSql = await ctx.model.table("tk_user_role").buildSql().add(addData);
                sqlArr.push(addSql);
            }
            // 执行事务（原子性）：
            await ctx.model.transaction(sqlArr);
            return ctx.body = await ctx.success("分配成功");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "put", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "put"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swtich", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "swtich"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "delete"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "assginRole", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "assginRole"), _class2.prototype)), _class2)) || _class);

exports.default = _default;