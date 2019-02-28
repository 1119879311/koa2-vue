"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _desc, _value, _class2;

var _router_decorator = require("../../util/router_decorator");

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

let _default = (_dec = (0, _router_decorator.Controller)("/rbac/user"), _dec2 = (0, _router_decorator.GET)("/"), _dec3 = (0, _router_decorator.GET)("/search"), _dec4 = (0, _router_decorator.POST)("/add"), _dec5 = (0, _router_decorator.POST)("/put"), _dec6 = (0, _router_decorator.POST)("/switch"), _dec(_class = (_class2 = class _default extends _base2.default {
    constructor() {
        super();
    }

    async index(ctx, next) {
        var { id, pageNum, pageSize } = ctx.request.query;
        if (id) {
            var res = await ctx.model.table("tk_user").noField("password").where({ id }).findOne();

            res ? res["user_role"] = await _tk_user_role2.default.getRole(id) : res;

            ctx.body = await { code: 200, state: true, mssage: "select add success", result: res };
        } else {
            ctx.body = await ctx.model.table("tk_user").noField("password").pageSelect(pageNum, pageSize);
        }
    }

    async search(ctx, next) {}

    async add(ctx, next) {
        var { name, password, status, contact, roleArr } = ctx.request.body;
        var validRes = await _user2.default.addUser({ name, password, contact });
        if (validRes) return ctx.body = await validRes;
        var options = {
            name: name,
            password: password,
            contact: contact,
            token: ctx.heper.signRonder(48),
            status: status || 1,
            create_time: new Date().getTime(),
            updata_time: new Date().getTime()
        };

        var resInsert = await ctx.model.table("tk_user").thenAdd(options, { name, contact, _logic: 'OR' });
        // if name or contac is exits ,then add is fail...
        if (resInsert.type == "exist") {
            return ctx.body = await { code: -101, state: false, mssage: "name or contact  is exist", result: "" };
        }
        await _tk_user_role2.default.addRole(resInsert.id, roleArr || []);
        return ctx.body = await { code: 200, state: true, mssage: "add is success", result: resInsert.id };
    }

    async put(ctx, next) {
        var { id, name, password, contact, status, roleArr } = ctx.request.body;
        if (!id) return ctx.body = await { code: -101, mssage: "id is must required" };
        var validRes = await _user2.default.editUser({ name, password, contact });
        if (validRes) return ctx.body = await validRes;
        var options = {
            name, contact,
            status: status || 1, updata_time: new Date().getTime()
            //Prevent password is empty to Be modified;
        };if (password && password.trim()) {
            options["password"] = ctx.heper.md5(password);
        }
        //find userid if exist
        var userid = await ctx.model.table("tk_user").field("id").where({ id }).findOne();
        if (!userid || !userid.id) return ctx.body = await { code: -101, state: false, mssage: "no user", result: "" };

        var userInfo = await ctx.model.table("tk_user").where({ id: ["!=", id], __complex: { name: name, contact: contact, _logic: 'OR' } }).findOne();
        if (userInfo && userInfo.id) return ctx.body = await { code: -101, state: false, mssage: "name or contact  is exist", result: "" };

        var updataUserRes = await ctx.model.table("tk_user").update(options, { where: { id } });
        roleArr = roleArr.length ? roleArr : [''];
        await _tk_user_role2.default.addRole(userid.id, roleArr);
        ctx.body = await { code: 200, state: true, mssage: "edit is success", result: [] };
    }

    async delete(ctx, next) {
        //1:open,2:off,0:del;
        var { status, switchdata } = ctx.request.body;
        var statusFlag = ["0", "1", "2"].indexOf(status) == -1 ? false : true;

        if (!Array.isArray(switchdata) && switchdata) {
            var switchdata = [{ id: switchdata }];
        } else if (!Array.isArray(switchdata) || !switchdata.length || !statusFlag) {
            return ctx.body = await { code: -104, mssage: "miss options or options is error" };
        }
        switchdata = switchdata.filter(itme => {
            return itme.id;
        }).map(itme => itme.id);
        switch (status) {
            case "0":
                var idArrs = await ctx.model.table("tk_user").field('id').where({ name: ["!=", "root"], id: ["in", switchdata], status: 0 }).select();
                if (!idArrs || !idArrs.length) return ctx.body = await { code: 200, state: true, mssage: "" };
                idArrs = idArrs.map(itme => itme.id);
                console.log(idArrs);
                var useRole = await ctx.model.table("tk_user_role").where({ u_id: ["in", idArrs] }).delete();
                var res = await ctx.model.table("tk_user").where({ name: ["!=", "root"], id: ["in", idArrs], status: 0 }).delete();
                return ctx.body = await { code: 200, state: true, mssage: res };
                break;
            case "1":
            case "2":
                status = status == "1" ? 1 : 0;
                console.log(status);
                switchdata = switchdata.map(itme => {
                    return { id: itme, status: status };
                });
                console.log(switchdata);
                var res = await ctx.model.table("tk_user").updateMany(switchdata, { "key": "id" });
                return ctx.body = await { code: 200, state: true, mssage: res };
        }
        return ctx.body = await { code: -104, mssage: "miss options or options is error" };
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "search", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "search"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "put", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "put"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "delete"), _class2.prototype)), _class2)) || _class);

exports.default = _default;