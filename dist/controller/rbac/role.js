"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2;

var _router_decorator = require("../../util/router_decorator");

var _base = require("../base");

var _base2 = _interopRequireDefault(_base);

var _role = require("../../logic/role");

var _role2 = _interopRequireDefault(_role);

var _tk_role_auth = require("../../model/tk_role_auth");

var _tk_role_auth2 = _interopRequireDefault(_tk_role_auth);

var _tk_role = require("../../model/tk_role");

var _tk_role2 = _interopRequireDefault(_tk_role);

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

let _default = (_dec = (0, _router_decorator.Controller)("/rbac/role"), _dec2 = (0, _router_decorator.GET)("/"), _dec3 = (0, _router_decorator.POST)("/add"), _dec4 = (0, _router_decorator.POST)("/edit"), _dec5 = (0, _router_decorator.POST)("/switch"), _dec(_class = (_class2 = class _default extends _base2.default {
    constructor() {
        super();
    }

    async index(ctx, next) {
        var { id, pageNum, pageSize } = ctx.request.query;
        if (id) {
            var res = await ctx.model.table("tk_role").where({ id }).findOne();
            // res?res["user_role"]=await URModel.getRole(id):res;
            ctx.body = await { code: 200, state: true, mssage: "select add success", result: res };
        } else {
            ctx.body = await ctx.model.table("tk_role").pageSelect(pageNum, pageSize);
        }
    }

    async add(ctx, next) {
        var { name, title, status = 1, sort = 100, pid = 1, authArr = [] } = ctx.request.body;
        var validRes = await _role2.default.addRole({ name, title });
        if (validRes) return ctx.body = await validRes;
        var options = {
            name, title, status, sort, pid,
            create_time: new Date().getTime(),
            update_time: new Date().getTime()
        };
        var resInsert = await ctx.model.table("tk_role").thenAdd(options, { name, title, _logic: 'OR' });
        // if name or title is exits ,then add is fail...
        if (resInsert.type == "exist") {
            return ctx.body = await { code: -101, state: false, mssage: "name or title  is exist", result: "" };
        }
        //add role handleAction
        await _tk_role_auth2.default.addAuth(resInsert.id, authArr || []);
        return this.body = await { code: 200, state: true, mssage: "resInsert", result: "" };
    }

    async edit(ctx, next) {
        var { id, name, title, status = 1, sort = 100, pid = 1, authArr = [] } = ctx.request.body;
        var options = {
            id, name, title, status,
            sort: data.sort || 100,
            pid: pid || 1,
            create_time: new Date().getTime(),
            update_time: new Date().getTime()
        };
        options.pid = options.pid == 0 ? 1 : options.pid;

        var roleid = await ctx.model.table("tk_role").field("id").where({ id: id }).findOne();
        if (!roleid.id) return ctx.body = await { code: -101, state: false, mssage: "no exist role", result: "" };

        var roleInfo = await ctx.model.table("tk_role").where({ id: ["!=", id], __complex: { name: name, title: title, _logic: 'OR' } }).findOne();
        if (roleInfo.id) return ctx.body = await { code: -101, state: false, mssage: "name or title  is exist", result: "" };
        var updataRes = await ctx.model.table("tk_role").where({ id }).update(options);

        await _tk_role_auth2.default.addAuth(roleInfo.id, authArr || []);
        this.body = await { code: 200, state: true, mssage: "edit is success", result: updataRes };
    }

    async switch(ctx, next) {
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
                var idArrs = await ctx.model.table("tk_role").field('id').where({ name: ["!=", "superAdmin"], id: ["in", switchdata], status: 0 }).select();
                if (!idArrs || !idArrs.length) return ctx.body = await { code: 200, state: true, mssage: "" };
                idArrs = idArrs.map(itme => itme.id);
                console.log(idArrs);
                var res = await _tk_role2.default.delRole(idArrs);
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
                var res = await ctx.model.table("tk_role").updateMany(switchdata, { "key": "id" });
                return ctx.body = await { code: 200, state: true, mssage: res };
        }
        return ctx.body = await { code: -104, mssage: "miss options or options is error" };
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "edit", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "edit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "switch", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "switch"), _class2.prototype)), _class2)) || _class);

exports.default = _default;