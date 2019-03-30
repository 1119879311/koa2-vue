"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _model = require("./model");

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let index = class index {
    // 分组统计分类 (根据article)
    static async getGroup(option = {}) {
<<<<<<< HEAD
        var { c_status = 1, a_status = 1 } = option;
        var arrWhere = ["a.cid=c.id", { "a.status": a_status }, "and"];
        // 默认是1， 全部是0
        // a_status==0?arrWhere:arrWhere.push({"a.status":a_status});
=======
        var { c_status, a_status } = option;
        var arrWhere = ["a.cid=c.id"];
        // 默认是1， 全部是0
        a_status == 0 ? arrWhere : a_status ? arrWhere.push({ "a.status": a_status }) : arrWhere.push({ "a.status": 1 });
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
        var coutSql = await _model2.default.table("tk_article as a").where(arrWhere).buildSql().count("a.id");
        // 默认是1， 全部是0
        var cateWhere = c_status == 0 ? {} : c_status ? { "c.status": c_status } : { "c.status": 1 };

        return await _model2.default.table("tk_cate as c").field(`c.*,(${coutSql}) as count`).where(cateWhere).group("c.id").select();
    }

};
exports.default = index;