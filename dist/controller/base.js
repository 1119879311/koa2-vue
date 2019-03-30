"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _auth_decorator = require("../util/auth_decorator");

var _auth_decorator2 = _interopRequireDefault(_auth_decorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let _default = class _default {
<<<<<<< HEAD

    async __before(ctx, next) {
        var isUser = await _auth_decorator2.default.utilUser(ctx);
        if (isUser) return isUser;
        var isRole = await _auth_decorator2.default.utilRole(ctx);
        if (isRole) return isRole;
        return null;
    }
=======
    // @userAuth.isUser()
    async __before(ctx, next) {}
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
};

exports.default = _default;