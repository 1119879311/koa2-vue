"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = require("../config");

var config = _interopRequireWildcard(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var proxyConf = new Proxy(config, {
    set: function (target, property, value, receiver) {
        target[property] = value;
        return true;
    },
    get: function (target, key, dec) {
        return target[key];
    }
});

exports.default = async (ctx, next) => {
    ctx.config = (...values) => {
        if (values.length == 0) return proxyConf;
        if (values.length == 1) return proxyConf[values[0]];
        if (values.length == 2) {
            var val = proxyConf[values[0]];
            return val ? val[values[1]] : val;
        }
    };
    await next();
};