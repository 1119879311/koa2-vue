"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _tk_tab = require("./tk_tab");

var _tk_tab2 = _interopRequireDefault(_tk_tab);

var _model = require("./model");

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// select a.*,c.name as cname,group_concat(concat_ws('-',t.id,t.name)separator '(^|&)')as tab from tk_article a 
// left join tk_tab_article ta on a.id =ta.a_id 
// left join tk_tab t on t.id = ta.t_id
// left join tk_cate c on c.id = a.cid group by a.id ;
let index = class index {
    /**
     * @param {object} option 
     */
    static async getCommon(option = { where: "", order: { id: "desc" }, limit: "" }) {
        var { page, limit } = option.limit;
        option.order = option.order == undefined ? { id: "desc" } : option.order;
        return _model2.default.table("tk_article as a").noField("content").field("c.name as cname,c.status as cstatus").join([{ join: 'left', table: "tk_cate as c", on: "c.id = a.cid" }]).where(option.where).order(option.order).pageSelect(page, limit);
    }
    // 获取一条article
    /**
    * @param {object} option 
    * @param {string|unmber} id 帖子id
    * @param {string|unmber} a_status 帖子状态,0:忽略状态查询 1：正常，2：禁用
    * @param {string|unmber} is_tab 帖子的标签状态 0:忽略状态查询 1：正常，2：禁用
    */
    static async getArticleId(option = {}) {
        var { id, a_status = 1, is_tab = 1 } = option;
        var wheres = { "a.id": id };
        a_status != 0 ? wheres[`a.status`] = a_status : null;
        try {
            var resInfo = await _model2.default.table("tk_article as a").field("a.*,c.name as c_name,c.status as c_status").join({ join: 'left', table: "tk_cate as c", on: "c.id = a.cid" }).where(wheres).findOne();

            if (resInfo) {
                var tabWhere = is_tab == 0 ? { a_id: id } : { a_id: id, status: is_tab };
                resInfo["tab"] = resInfo["tab"] = await _model2.default.table("tk_tab").field("id,name,status").where(tabWhere).join({ table: "tk_tab_article", join: "right", on: " id = t_id " }).select();
                // 找上一条 
                var nextInfo = await _model2.default.table("tk_article").field("id,title,status").where({ id: [">", id], status: 1 }).limit("0,1").order({ id: "asc" }).findOne();
                var prevInfo = await _model2.default.table("tk_article").field("id,title,status").where({ id: ["<", id], status: 1 }).limit("0,1").order({ id: "desc" }).findOne();
                resInfo['prevInfo'] = prevInfo;
                resInfo['nextInfo'] = nextInfo;
                var status = true;
            } else {
                var status = false;
            }
            return await { status, code: 200, data: resInfo, mssage: "select is success" };
        } catch (error) {
            return await Object.assign({ status: false }, error);
        }
    }

    //获取all article
    static async getArticle(option = {}) {
        var { a_status = 1, c_status = 1, sort, is_tab, cid, page = 1, limit = 10 } = option;
        var where = {};
        a_status != 0 ? where[`a.status`] = a_status : null;
        if (cid) {
            //根据分类 id 获取所有的 
            where[`a.cid`] = ["in", cid];
            where[`c.status`] = c_status;
        };
        try {
            let resInfo = await this.getCommon({ where, order: sort, limit: { page, limit } });
            resInfo["status"] = true;
            if (is_tab && resInfo.data.length) {
                var tabWhere = is_tab == 0 ? {} : { status: is_tab };
                try {
                    var tabRes = await _tk_tab2.default.getGropUidTab(tabWhere);
                    resInfo.data.map(itme => {
                        if (itme) {
                            var tabArr = tabRes[itme.id];itme["tab"] = tabArr ? tabArr : [];
                        }
                    });
                } catch (error) {}
            }
            return resInfo;
        } catch (error) {
            return await Object.assign({ status: false }, error);
        }
    }

    // 根据tab id 获取 article
    static async getArticleTabId(option = {}) {
        //默认全部 ，1是正常，2是禁用
        var { tabId = "", t_status = 1, a_status = 1, sort, is_tab = false, page = 1, limit = 10 } = option;
        var tabWhere = {};
        if (!is_tab) tabWhere[`t_id`] = tabId;
        if (t_status) tabWhere[`status`] = t_status;
        try {
            var tabRes = await _model2.default.table("tk_tab").join({ join: 'right', table: "tk_tab_article as ta", on: "id = t_id" }).where(tabWhere).select();
            var [artId, resObj] = [[], {}];
            tabRes.forEach(itme => {
                //找出 tabID 对应的所有article Id
                if (tabId && itme.id == tabId) {
                    artId.push(itme.a_id);
                }

                // 找出每一个article 下的所有的tab
                if (resObj[itme["a_id"]]) {
                    resObj[itme["a_id"]].push(itme);
                } else {
                    resObj[itme["a_id"]] = [itme];
                }
            });

            var artWhere = { "a.id": ["in", artId] };
            a_status != 0 ? artWhere[`a.status`] = a_status : null;
            var result = await this.getCommon({ where: artWhere, order: sort, limit: { page, limit } });
            result["status"] = true;
            // 是否需要获取 article 下的 tab
            if (is_tab && result.data.length) {
                result.data.map(itme => {
                    if (itme) {
                        var tabArr = resObj[itme.id];itme["tab"] = tabArr ? tabArr : [];
                    }
                });
            }
            return await result;
        } catch (error) {
            return await Object.assign({ status: false }, error);
        }
    }
};
exports.default = index;