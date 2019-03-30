"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

<<<<<<< HEAD
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class, _desc, _value, _class2;

var _router = require("../../lib/router");
=======
var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _desc, _value, _class2;

var _router_decorator = require("../../util/router_decorator");
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2

var _auth_decorator = require("../../util/auth_decorator");

var _auth_decorator2 = _interopRequireDefault(_auth_decorator);

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
let _default = (_dec = (0, _router.Controller)("/blog/cate"), _dec2 = (0, _router.GET)("/"), _dec3 = (0, _router.POST)("/add"), _dec4 = _auth_decorator2.default.isUser(), _dec5 = _auth_decorator2.default.isRoleAuth(), _dec6 = (0, _router.POST)("/update"), _dec7 = _auth_decorator2.default.isUser(), _dec8 = _auth_decorator2.default.isRoleAuth(), _dec9 = (0, _router.POST)("/swtich"), _dec10 = _auth_decorator2.default.isUser(), _dec11 = _auth_decorator2.default.isRoleAuth(), _dec12 = (0, _router.POST)("/delete"), _dec13 = _auth_decorator2.default.isUser(), _dec14 = _auth_decorator2.default.isRoleAuth(), _dec(_class = (_class2 = class _default {
    async index(ctx, next) {
        var { status } = ctx.request.query;
        var res = await ctx.model.clearOtions().table("tk_cate").where({ status }).select();
        return ctx.body = await ctx.success({ data: res, mssage: "select is success" });
=======
let _default = (_dec = (0, _router_decorator.Controller)("/blog/cate"), _dec2 = (0, _router_decorator.GET)("/"), _dec3 = (0, _router_decorator.POST)("/add"), _dec4 = (0, _router_decorator.POST)("/update"), _dec5 = (0, _router_decorator.POST)("/swtich"), _dec6 = (0, _router_decorator.POST)("/delete"), _dec(_class = (_class2 = class _default {
    async index(ctx, next) {
        var { status } = ctx.request.query;
        var where = {};

        if (status) where["status"] = status;
        var res = await ctx.model.clearOtions().table("tk_cate").where(where).select();
        if (res.error) {
            return ctx.body = await res;
        }
        ctx.body = await { status: true, data: res, mssage: "select is success" };
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
    }

    async add(ctx, next) {
        var { name, pid = 0, sort = 100, status = 1 } = ctx.request.body;
<<<<<<< HEAD
        if (!name) return ctx.body = await ctx.error("name is required");
        try {
            var resInsert = await ctx.model.table("tk_cate").thenAdd({
                name, pid, sort, status, createtime: new Date().getTime()
            }, { name });

            if (resInsert.type == "exist") {
                return ctx.body = await ctx.error("name is exist");
            } else if (resInsert.type == "add") {
                return ctx.body = await ctx.success({ data: resInsert.id, mssage: "add is success" });
            }
            return ctx.body = await ctx.error("add is fail");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
=======

        if (!name) {
            return ctx.body = await { status: false, code: 401, msg: "name is required" };
        }

        var resInsert = await ctx.model.table("tk_cate").thenAdd({
            name, pid, sort, status, createtime: new Date().getTime()
        }, { name });

        if (resInsert.type == "exist") {
            return ctx.body = await { code: -101, status: false, mssage: "name is exist", data: "" };
        } else if (resInsert.type == "add") {
            return ctx.body = await { code: 200, status: true, mssage: "add is success", data: resInsert.id };
        }
        ctx.body = await resInsert;
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
    }
    //更新

    async update(ctx, next) {
        var { id, name, pid = 0, sort = 100 } = ctx.request.body;
<<<<<<< HEAD
        if (!id || !name) return ctx.body = await ctx.error("id or name is required");
=======

        if (!id || !name) return ctx.body = await { status: false, code: 401, msg: "id or name is required" };
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2

        try {
            var res = await ctx.model.table("tk_cate").where({ id }).thenUpdate({ name, pid, sort }, { id: ["!=", id], name });

            if (res.type == "exist") {
<<<<<<< HEAD
                return ctx.body = await ctx.error("name is exist");
            } else if (res.type == "update") {
                return ctx.body = await ctx.success({ data: resInsert.id, mssage: "update is success" });
            }
            return ctx.body = await ctx.error("update is fail");
        } catch (error) {
            return ctx.body = await ctx.error(error);
=======
                return ctx.body = await { code: -101, status: false, mssage: "name is exist", data: "" };
            } else if (res.type == "update") {
                return ctx.body = await { code: 200, status: true, mssage: "update is success", data: "" };
            }
        } catch (error) {
            return await { status: false, error };
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
        }
    }

    //单个/批量修改状态

    async swtich(ctx, next) {
        var { data = [] } = ctx.request.body;

        if (!ctx.heper.isArray(data) || !data.length) {
<<<<<<< HEAD
            return ctx.body = await ctx.error("data is array required");
        };
        try {
            if (data.length == 1) {
                //单个(存在父子关系，切换父级，子级也要切换)
                var status = data[0]['status'];
                var res = await ctx.model.table("tk_cate").field("id,status,pid").select();

                // 1.更新正常状态，需要检查是否有父级,且要为正常状态，如果处于禁用状态，子级无法更新为正常状态
                if (status == 1) {
                    //切换正常状态
                    // 找父级
                    var resPartFilter = ctx.heper.filterChrildId(res, "pid", "id", data[0]['pid'], true);

                    var resSome = resPartFilter.some(itme => itme.status == 2);

                    if (resSome) {
                        return ctx.body = await ctx.error("无法更新,父级处于禁用状态，子级无法开启正常");
                    }
                }

                // 找子级
                var resFilter = ctx.heper.filterChrildId(res, "id", "pid", data[0]['id']);

                var resMap = resFilter.map(itme => {
                    return { id: itme, status };
                });

                data = [...resMap, { id: data[0].id, status }];
            }
            // 批量更新
            await ctx.model.table("tk_cate").updateMany(data, { key: "id" });
            return ctx.body = await ctx.success("update is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
=======
            return ctx.body = await { code: -101, status: false, mssage: "data is array required", data: "" };
        };

        if (data.length == 1) {
            //单个(存在父子关系，切换父级，子级也要切换)
            var status = data[0]['status'];
            var res = await ctx.model.table("tk_cate").field("id,status,pid").select();

            // 1.更新正常状态，需要检查是否有父级,且要为正常状态，如果处于禁用状态，子级无法更新为正常状态
            if (status == 1) {
                //切换正常状态
                // 找父级
                var resPartFilter = ctx.heper.filterChrildId(res, "pid", "id", data[0]['pid'], true);

                var resSome = resPartFilter.some(itme => itme.status == 2);

                if (resSome) {
                    return ctx.body = await { code: -101, status: false, mssage: "无法更新,父级处于禁用状态，子级无法开启正常", data: "" };
                }
            }

            // 找子级
            var resFilter = ctx.heper.filterChrildId(res, "id", "pid", data[0]['id']);

            var resMap = resFilter.map(itme => {
                return { id: itme, status };
            });

            data = [...resMap, { id: data[0].id, status }];
        }
        // 批量更新
        var res = await ctx.model.table("tk_cate").updateMany(data, { key: "id" });
        if (res && res.error) {
            return ctx.body = await res;
        }
        return ctx.body = await { code: 200, status: true, mssage: "update is success", data: "" };
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
    }
    //删除

    async del(ctx, next) {
        var { id } = ctx.request.body;
<<<<<<< HEAD
        if (!id) return ctx.body = await ctx.error("id  is required");
        try {
            //先查是否存在适合的删除数据 (id,status = 2|停用状态)    
            var resfind = await ctx.model.table("tk_cate").where({ id, status: 2 }).findOne();
            if (!resfind) return ctx.body = await ctx.error("delete is fail");
            var resChild = await ctx.model.table("tk_cate").field("id").where({ pid: id, id, "_logic": "OR" }).select();

            if (resChild && resChild.length > 1) {

                var delRRow = resChild.filter(itme => itme.id == id);

                var pid = delRRow[0].pid ? delRRow[0].pid : 0;

                var updateData = resChild.map(val => {
                    if (itme.id != id) {
                        return { id: val.id, pid };
                    }
                });
                // 批量更新子级

                await ctx.model.table("tk_cate").updateMany(updateData, { key: "id" });
            }
            await ctx.model.table("tk_cate").where({ id }).delete();
            return ctx.body = await ctx.success("detele is success");
        } catch (error) {
            return ctx.body = await ctx.error(error);
        }
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3, _dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec6, _dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swtich", [_dec9, _dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "swtich"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "del", [_dec12, _dec13, _dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "del"), _class2.prototype)), _class2)) || _class);
=======
        if (!id) {
            return ctx.body = await { status: false, code: 401, msg: "id  is required" };
        }
        //先查是否存在适合的删除数据 (id,status = 2|停用状态)    
        var resfind = await ctx.model.table("tk_cate").where({ id, status: 2 }).findOne();
        if (resfind) return ctx.body = await { code: -101, status: false, mssage: "删除失败,正常状态无法删除", data: "" };

        var resChild = await ctx.model.table("tk_cate").field("id").where({ pid: id, id, "_logic": "OR" }).select();

        if (resChild && resChild.length > 1) {

            var delRRow = resChild.filter(itme => itme.id == id);

            var pid = delRRow[0].pid ? delRRow[0].pid : 0;

            var updateData = resChild.map(val => {
                if (itme.id != id) {
                    return { id: val.id, pid };
                }
            });
            // 批量更新子级

            var res = await ctx.model.table("tk_cate").updateMany(updateData, { key: "id" });
            if (res && res.error) {
                return ctx.body = await res;
            }
        }
        // 删除

        var resDel = await ctx.model.table("tk_cate").where({ id }).delete();

        if (resDel && resDel.error) {
            return ctx.body = await { code: -101, status: false, mssage: "detele is fail", data: "" };
        }
        return ctx.body = await { code: 200, status: true, mssage: "detele is success", data: "" };
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "index", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "index"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swtich", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "swtich"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "del", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "del"), _class2.prototype)), _class2)) || _class);
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2

exports.default = _default;