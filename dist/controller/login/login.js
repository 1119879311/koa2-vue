"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _dec, _dec2, _class, _desc, _value, _class2;

var _router = require("../../lib/router");

var _user = require("../../logic/user");

var _user2 = _interopRequireDefault(_user);

var _auth_decorator = require("../../util/auth_decorator");

var _auth_decorator2 = _interopRequireDefault(_auth_decorator);

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

let _default = (_dec = (0, _router.Controller)("/login"), _dec2 = (0, _router.POST)("/"), _dec(_class = (_class2 = class _default {
    async login(ctx, next) {
        let { name, password } = ctx.request.body;
        let logicRes = await _user2.default.login({ name, password });
        if (logicRes) return ctx.body = await logicRes;
        try {
            let userInfo = await ctx.model.table("tk_user").where({ name, password: ctx.heper.md5(password) }).findOne();
            if (!userInfo) return ctx.body = await { code: -101, status: false, mssage: "username or password is error" };
            //超级用户无限制    
            if (userInfo.isAdmin != 1) {
                if (userInfo.status !== 1) {
                    return ctx.body = await ctx.error("you number is forbidden login");
                }
            }
            let token = await _auth_decorator2.default.jwtSign({ name, uid: userInfo.id, isAdmin: userInfo.isAdmin });
            return ctx.body = await ctx.success({ mssage: "login is success", data: { token, username: name, userId: userInfo.id } });
        } catch (error) {
            return ctx.body = await ctx.error("login is fail");
        }
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "login", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "login"), _class2.prototype)), _class2)) || _class);

exports.default = _default;