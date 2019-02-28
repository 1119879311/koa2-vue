"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2;

var _router_decorator = require("../../util/router_decorator");

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
exports.default = auth;