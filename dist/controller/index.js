"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _dec, _dec2, _class, _desc, _value, _class2;

var _router_decorator = require("../util/router_decorator");

var _tk_user_role = require("../model/tk_user_role");

var _tk_user_role2 = _interopRequireDefault(_tk_user_role);

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

let _default = (_dec = (0, _router_decorator.Controller)("/api/index"), _dec2 = (0, _router_decorator.GET)("/"), _dec(_class = (_class2 = class _default {
    async index(ctx, next) {
        let resRole = await _tk_user_role2.default.getRole();
        ctx.body = await resRole;
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "index"), _class2.prototype)), _class2)) || _class);

exports.default = _default;