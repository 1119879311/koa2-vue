"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _model = require("./model");

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let _default = class _default {

    static async getRole(uid = "") {
<<<<<<< HEAD
        var where = uid ? { "u.id": uid, "r.status": 1 } : "";
        var resRole = _model2.default.table("tk_user_role ur").field("u.id as user_id,r.id as role_id,r.name as role_name,r.title as role_title,r.pid as role_pid,r.status as role_staus").join([{ table: "tK_role r", join: "right", on: "r.id=ur.r_id" }, { table: "tK_user u", join: "left", on: "u.id=.ur.u_id" }]).where(where).select();
        return await resRole;
    }

    static async getAuth() {}
=======
        var where = uid ? { "u.id": uid } : "";
        var resRole = _model2.default.table("tk_user_role ur").field("u.id as user_id,r.id as role_id,r.name as role_name,r.title as role_title,r.pid as role_pid").join([{ table: "tK_role r", join: "right", on: "r.id=ur.r_id" }, { table: "tK_user u", join: "left", on: "u.id=.ur.u_id" }]).where(where).pageSelect();
        return await resRole;
    }
    static async addRole(u_id = "", role_id = ['']) {
        // 找出是否存在roleid
        if (!u_id || Object.prototype.toString.call(role_id) !== '[object Array]') {
            return false;
        };
        var userid = await _model2.default.table("tk_user").field("id").where({ id: u_id }).findOne();
        if (!userid || !userid.id) {
            return false;
        };
        var roleId = await _model2.default.table("tk_role").field("id").where({ id: ["in", role_id] }).select();
        var user_role = await _model2.default.table("tk_user_role").where({ u_id: u_id }).select();
        user_role = user_role.map(itme => itme.r_id);
        roleId = roleId.map(itme => itme.id);
        //找出新添加的role
        var addRoleId = [];
        roleId.map(x => {
            if (user_role.indexOf(x) == -1) {
                addRoleId.push({ u_id: u_id, r_id: x });
            }
        });

        // 找出要删除的role
        var deleteRoleId = user_role.filter(x => {
            if (roleId.indexOf(x) == -1) return x;
        });
        if (addRoleId.length > 0) {
            var resAddRole = await _model2.default.table("tk_user_role").add(addRoleId);
        }

        if (deleteRoleId.length > 0) {
            var reDelRole = await _model2.default.table("tk_user_role").where({ u_id: u_id, r_id: ["in", deleteRoleId] }).delete();
        }
        return { roleId: roleId, user_role: user_role, addRoleId: addRoleId, deleteRoleId: deleteRoleId };
    }
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2

};

exports.default = _default;