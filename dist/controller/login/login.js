"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _dec, _dec2, _class, _desc, _value, _class2;

var _router_decorator = require("../../util/router_decorator");

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

let _default = (_dec = (0, _router_decorator.Controller)("/login"), _dec2 = (0, _router_decorator.POST)("/"), _dec(_class = (_class2 = class _default {
    async login(ctx, next) {
        let { name, password } = ctx.request.body;
        let logicRes = await _user2.default.login({ name, password });
        if (logicRes) return ctx.body = await logicRes;
        try {
            let userInfo = await ctx.model.table("tk_user").where({ name: name, password: password }).findOne();
            if (!userInfo) return ctx.body = await { code: -101, status: false, mssage: "username or password is error" };
            if (userInfo.status !== 1) return ctx.body = await { code: -101, status: false, mssage: "you number is forbidden login" };
            let token = await ctx.heper.jwtSign({ name, uid: userInfo.id });
            ctx.body = await { token: token, username: name, uid: userInfo.id, status: true };
        } catch (error) {
            ctx.body = await { status: false, mssage: "login is fail", code: -101 };
        }
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "login", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "login"), _class2.prototype)), _class2)) || _class);

exports.default = _default;