"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let index = class index {
    static utilUser(ctx) {
        let token = ctx.header.authorization;
        if (!token) return { code: -101, mssage: "miss is token", status: false };
        try {
            let res = _jsonwebtoken2.default.verify(token, ctx.config("signed"));
            if (res._timeOut_ - new Date().getTime() < 0) return { code: -104, mssage: "token is not invalid", status: false };
            ctx.state['userInfo'] = res;
        } catch (error) {
            return { code: -104, mssage: "token is error", status: false };
        }
        return null;
    }

    signed(data = {}, signed = signed) {
        Object.assign(data, { _timeOut_: new Date().getTime() + _config.sessionTime });
        return _jsonwebtoken2.default.sign(data, signed);
    }
    isUser() {
        let cthis = this;
        return (target, value, dec) => {
            let fn = dec.value;
            dec.value = async (ctx, next, _this) => {
                if (!ctx.request) return;
                let res = cthis.constructor.utilUser(ctx);
                if (res) return ctx.body = await res;
                await fn.call(_this, ctx, next, _this);
            };
        };
    }
    isRoleAuth() {
        let cthis = this;
        return (target, value, dec) => {
            let fn = dec.value;
            dec.value = async (ctx, next, _this) => {
                if (!ctx.request) return;
                var res = cthis.constructor.utilUser(ctx);
                if (res) return ctx.body = await res;
                await fn.call(_this, ctx, next, _this);
            };
        };
    }
};
exports.default = new index();