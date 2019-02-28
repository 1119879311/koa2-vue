"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2;

var _router_decorator = require("../../util/router_decorator");

var _base = require("../base");

var _base2 = _interopRequireDefault(_base);

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

let auth = (_dec = (0, _router_decorator.Controller)("/rbac/auth"), _dec2 = (0, _router_decorator.GET)("/"), _dec3 = (0, _router_decorator.POST)("/add"), _dec4 = (0, _router_decorator.POST)("/del"), _dec(_class = (_class2 = class auth extends _base2.default {
    async index(ctx, next) {
        var res = ctx.model.table("tk_auth_muen").select();
        ctx.body = await [{ id: 1, componet: "systemPage", is_muen: 2, parent_id: 0 }, { id: 2, componet: "userPage", is_muen: 2, parent_id: 1 }, { id: 3, componet: "rolePage", is_muen: 2, parent_id: 1 }, { id: 4, componet: "authPage", is_muen: 2, parent_id: 1 }];
    }

    async add() {
        var { name, componet, title, url, is_muen = 1, is_state = 1, parent_id = 0 } = ctx.request.body;
        ctx.model.table("tk_auth_muen").where().thenAdd({});
    }

    async del(ctx, next) {}
}, (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "del", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "del"), _class2.prototype)), _class2)) || _class);
exports.default = auth;