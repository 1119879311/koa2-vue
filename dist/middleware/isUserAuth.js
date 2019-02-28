"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require("../config");

var _heper = require("../util/heper");

var _heper2 = _interopRequireDefault(_heper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    siger(data = {}, signeds = _config.signed) {
        Object.assign(data, { _timeOut_: new Date().getTime() + 1000 * 60 * 60 * 24, signRonder: _heper2.default.signRonder(30) + new Date().getTime() });
        var token = _jsonwebtoken2.default.sign(data, signeds);
        return token;
    },
    verifyHeader(option = {}) {
        /**
         *{GET:['*'],"CHECK":{}} 
         */
        return async (ctx, next) => {
            function isCheck(opt) {
                if (opt && opt == "*") {
                    var isCheckRes = true;
                }
                if (opt && Array.isArray(opt)) {
                    var isCheckRes = opt.some(itme => {
                        if (itme == "*") return true;
                        return ctx.path.match(itme);
                    });
                }
                return isCheckRes;
            }
            var methond = ctx.method.toUpperCase(); //转大写
            var isCheckOpt = option[methond];
            var isCheckRes = isCheck(isCheckOpt);
            var token = ctx.header.authorization;

            if (isCheckRes) {
                var checkOpt = option['CHECK'] ? option['CHECK'][methond] : false;
                var checkRes = isCheck(checkOpt);
                if (!checkRes) return await next();
            }
            var token = ctx.header.authorization;

            if (!token) return ctx.body = await { code: -101, msg: "miss is token" };
            try {
                var res = await _jsonwebtoken2.default.verify(token, ctx.config("signed"));
                if (res._timeOut_ - new Date().getTime() < 0) return ctx.body = await { code: -104, msg: "miss is invalid" };
                ctx.state['userInfo'] = res;
            } catch (error) {
                return ctx.body = await { code: -104, msg: "miss is error" };
            }

            await next();
        };
    }

};