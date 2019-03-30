"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _model = require("./model");

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let index = class index {
  // 查一个用户的所有权限
  static async getPower(uid = "") {
    var res = null;
    var roleId = await _model2.default.table("tk_role as r").field("r.id").where({ "r.status": 1, "ur.u_id": uid }).join({ table: "tk_user_role as ur", join: "right", on: "r.id=ur.r_id" }).select();
    if (roleId && roleId.length) {
      res = await _model2.default.table("tk_auth as r").field("identName").where({ "r.status": 1, "ra.id": ["in", roleId] }).join({
        table: "tk_role_auth as ra", join: "right", on: "r.id=ra.r_id"
      }).select();
    }
    return res;
  }

};
exports.default = index;