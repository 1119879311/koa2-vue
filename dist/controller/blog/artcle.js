"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

<<<<<<< HEAD
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _desc, _value, _class2;

var _router = require("../../lib/router");
=======
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _desc, _value, _class2;

var _router_decorator = require("../../util/router_decorator");
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2

var _tk_cate = require("../../model/tk_cate");

var _tk_cate2 = _interopRequireDefault(_tk_cate);

var _tk_article = require("../../model/tk_article");

var _tk_article2 = _interopRequireDefault(_tk_article);

var _tk_tab = require("../../model/tk_tab");

var _tk_tab2 = _interopRequireDefault(_tk_tab);

var _article = require("../../logic/article");

var _article2 = _interopRequireDefault(_article);

<<<<<<< HEAD
var _auth_decorator = require("../../util/auth_decorator");

var _auth_decorator2 = _interopRequireDefault(_auth_decorator);

=======
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
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

<<<<<<< HEAD
let _default = (_dec = (0, _router.Controller)("/blog/artcle"), _dec2 = (0, _router.GET)('/'), _dec3 = (0, _router.GET)("/groupType"), _dec4 = (0, _router.POST)("/add"), _dec5 = _auth_decorator2.default.isRoleAuth(), _dec6 = _auth_decorator2.default.isUser(), _dec7 = (0, _router.POST)("/swtich"), _dec8 = _auth_decorator2.default.isUser(), _dec9 = _auth_decorator2.default.isRoleAuth(), _dec10 = (0, _router.POST)("/update"), _dec11 = _auth_decorator2.default.isUser(), _dec12 = _auth_decorator2.default.isRoleAuth(), _dec13 = (0, _router.POST)("/delete"), _dec14 = _auth_decorator2.default.isUser(), _dec15 = _auth_decorator2.default.isRoleAuth(), _dec16 = (0, _router.GET)("/search"), _dec(_class = (_class2 = class _default {
=======
let _default = (_dec = (0, _router_decorator.Controller)("/blog/artcle"), _dec2 = (0, _router_decorator.GET)('/'), _dec3 = (0, _router_decorator.GET)("/groupType"), _dec4 = (0, _router_decorator.POST)("/add"), _dec5 = (0, _router_decorator.POST)("/swtich"), _dec6 = (0, _router_decorator.POST)("/update"), _dec7 = (0, _router_decorator.POST)("/delete"), _dec(_class = (_class2 = class _default {
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
    async index(ctx, next) {

        var option = ctx.request.query || {};
        // 查单条article
        if (option.id) {
<<<<<<< HEAD
            var res = await _tk_article2.default.getArticleId(option);
            if (option.addRead && res.status) {
                await ctx.model.table("tk_article").where({ id: option.id }).update({ "readcount": res.data.readcount + 1 });
            }
            return ctx.body = res;
=======
            return ctx.body = await _tk_article2.default.getArticleId(option);
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
        }
        //查询 tab 下的所有 article    
        if (option.tabId) {
            return ctx.body = await _tk_article2.default.getArticleTabId(option);
        }
        //查询 cate 下(包括子集)的所有 article    
        if (option.cateId) {
            var cidArr = await ctx.model.table("tk_cate").field("id,pid").where({ status: 1, id: [">=", option.cateId] }).select();
            option["cid"] = [...(await ctx.heper.filterChrildId(cidArr, "id", "pid", option.cateId)), option.cateId];
            return ctx.body = await _tk_article2.default.getArticle(option);
        }
<<<<<<< HEAD
        //搜索 article    
        if (option.search) {
            var res = await ctx.model.table("tk_article as a").noField("content").field("c.name as cname,c.status as cstatus").join({ join: 'left', table: "tk_cate as c", on: "c.id = a.cid" }).where([{ "a.title|a.remark|c.name": ["like", `%${option.search}%`] }, { "a.status": 1 }, "and"]).order({ id: "desc" }).pageSelect();
            res["status"] = true;
            return ctx.body = await res;
        }
=======
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
        //默认查所有 article    
        return ctx.body = await _tk_article2.default.getArticle(option);
    }

    // 统计分组article(根据cate|tab)

    async type(ctx, next) {
        var option = ctx.request.query || {};
        try {
            var status = true;
            var mssage = "select is success";
            var data = [];
            switch (option.type) {
                case "cate":
                    var data = await ctx.heper.diGuiAdd((await _tk_cate2.default.getGroup(option)));
                    break;
                case "tab":
                    var data = await _tk_tab2.default.getGroup(option);
                    break;
                default:
                    status = false, mssage = "miss type ,no data";
                    break;
            }
<<<<<<< HEAD
            return ctx.body = await ctx.success({ status, data, mssage });
        } catch (error) {
            return ctx.body = await ctx.error(error);
=======
            return ctx.body = { status, data, mssage };
        } catch (error) {
            ctx.body = await Object.assign({ status: false }, error || { error: "serve is error" });
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
        }
    }

    async add(ctx, next) {
        // 数据校验
        var { title, content, cid, thumimg, remark, status = 1, sort = 100, tabList = [] } = ctx.request.body;
        var resVery = await _article2.default.veryAtricle({ title, content, thumimg, remark, tabList });
<<<<<<< HEAD
        if (resVery) return ctx.body = await ctx.error(resVery);
        // 写入article数据 
        try {

=======
        if (resVery) return ctx.body = await resVery;
        // 写入article数据 
        try {
            console.log(content);
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
            var resInsert = await ctx.model.table("tk_article").thenAdd({
                title, content: content, cid, thumimg, remark, readcount: 100, status, sort, createtime: new Date().getTime()
            }, { title });

            if (resInsert.type == "exist") {
<<<<<<< HEAD
                return ctx.body = await ctx.error("title is exist");
=======
                return ctx.body = await { code: -101, status: false, mssage: "title is exist", data: "" };
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
            } else if (resInsert.type == "add") {
                // 写入tab数据 
                var resTab = await ctx.model.table("tk_tab").field("id").where({ "id": ["in", tabList], status: 1 }).select();
                var resTabId = resTab.map(itme => {
                    return { t_id: itme.id, a_id: resInsert.id };
                });
                if (resTabId.length) {
                    await ctx.model.table("tk_tab_article").add(resTabId);
                }
<<<<<<< HEAD
                return ctx.body = await ctx.success({ mssage: "add is success", data: resInsert.id });
            }
            return ctx.body = await ctx.error("add is fail");
        } catch (error) {
            return ctx.body = await ctx.error(error);
=======
                return ctx.body = await { code: 200, status: true, mssage: "add is success", data: resInsert.id };
            }
            return ctx.body = await { code: -101, status: false, mssage: "add is fail", data: "" };
        } catch (error) {
            ctx.body = await { code: -101, status: false, mssage: "server is error" };
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
        }
    }

    //单个/批量修改状态

    async swtich(ctx, next) {
        var { data = [] } = ctx.request.body;
        try {
            var res = await ctx.model.table("tk_article").updateMany(data, { key: "id" });
<<<<<<< HEAD
            return ctx.body = await ctx.success("update is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
=======
            return ctx.body = await { code: 200, status: true, mssage: "update is success", data: res };
        } catch (error) {
            return ctx.body = await { code: -101, status: false, mssage: error };
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
        }
    }

    //更新 

    async update(ctx, next) {
        var { id, title, content, cid, thumimg, remark, sort, status = 1, tabList = [] } = ctx.request.body;
<<<<<<< HEAD
        if (!id) return ctx.body = await ctx.error("id is required");
        var resVery = await _article2.default.veryAtricle({ title, content, thumimg, remark, tabList });
        if (resVery) return ctx.body = await ctx.error(resVery);

=======
        if (!id) {
            return ctx.body = await { status: false, code: 401, msg: "id is required" };
        }
        var resVery = await _article2.default.veryAtricle({ title, content, thumimg, remark, tabList });
        if (resVery) return ctx.body = await resVery;
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
        try {
            var res = await ctx.model.table("tk_article").where({ id }).thenUpdate({ title, content, cid, thumimg, remark, status }, { id: ["!=", id], title });

            if (res.type == "exist") {
<<<<<<< HEAD
                return ctx.body = await ctx.error("title is exist");
=======
                return ctx.body = await { code: -101, status: false, mssage: "title is exist", data: "" };
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
            } else if (res.type == "update") {
                //先删除再添加.l;
                var sqlArr = [];
                var delSql = await ctx.model.table("tk_tab_article").where({ a_id: id }).buildSql().delete();
                sqlArr.push(delSql);
                if (tabList && tabList.length) {
                    var addData = tabList.map(itme => {
                        return { a_id: id, t_id: itme };
                    });
                    var addSql = await ctx.model.table("tk_tab_article").buildSql().add(addData);
                    sqlArr.push(addSql);
                }
                // 执行事务（原子性）：
                await ctx.model.transaction(sqlArr);
<<<<<<< HEAD
                return ctx.body = await ctx.success("update is success");
            }
            return ctx.body = await ctx.error(error);
        } catch (error) {
            return ctx.body = await ctx.error(error);
=======
                return ctx.body = await { code: 200, status: true, mssage: "updata is success", data: "" };
            } else {
                return ctx.body = await { code: -101, status: false, mssage: "updata is fail", data: "" };
            }
        } catch (error) {
            return ctx.body = await { code: -101, status: false, mssage: "server is error,updata is fail", data: "" };
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
        }
    }
    //删除

    async delete(ctx, next) {
        var { id } = ctx.request.body;
        if (!id) {
            return ctx.body = await { status: false, code: 401, msg: "id  is required" };
        }
<<<<<<< HEAD

        try {
            //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
            var resfind = await ctx.model.table("tk_article").where({ id, status: 2 }).findOne();
            if (!resfind) return ctx.body = await ctx.error("detele is fail");
            // 先删除中间表tk_tab_article
            var resR = await ctx.model.table("tk_tab_article").where({ "a_id": id }).buildSql().delete();
            var resT = await ctx.model.table("tk_article").where({ id }).buildSql().delete();
            //执行事务
            await ctx.model.transaction([resR, resT]);
            return ctx.body = await ctx.success("detele is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }
    //  搜索

    async search(ctx, next) {
        let { q } = ctx.request.query;
        if (!q) return ctx.body = await ctx.error("miss search key");
        var res = await ctx.model.table("tk_article as a").noField("content").field("c.name as cname,c.status as cstatus").join({ join: 'left', table: "tk_cate as c", on: "c.id = a.cid" }).where([{ "a.title|a.remark|c.name": ["like", `%${q}%`] }, { "a.status": 1 }, "and"]).order({ id: "desc" }).pageSelect();
        return ctx.body = await ctx.success(res);
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "type", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "type"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec4, _dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swtich", [_dec7, _dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "swtich"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec10, _dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec13, _dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "delete"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "search", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "search"), _class2.prototype)), _class2)) || _class);
=======
        //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
        var resfind = await ctx.model.table("tk_article").where({ id, status: 2 }).findOne();
        if (!resfind) return ctx.body = await { code: -101, status: false, mssage: "正常状态无法删除", data: "" };
        if (resfind && resfind.error) return ctx.body = await resfind;
        // 先删除中间表tk_tab_article
        try {
            var resR = await ctx.model.table("tk_tab_article").where({ "a_id": id }).delete();
            var resT = await ctx.model.table("tk_article").where({ id }).delete();
            return ctx.body = await { code: 200, status: true, mssage: "detele is success", data: "" };
        } catch (error) {
            return ctx.body = await { code: -101, status: false, mssage: "server is error", data: "" };
        }
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "type", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "type"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swtich", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "swtich"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "delete"), _class2.prototype)), _class2)) || _class);
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2

exports.default = _default;