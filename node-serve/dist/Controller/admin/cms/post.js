var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _class, _desc, _value, _class2;

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

const { Controller, POST, GET } = imports("Lib/router");
const postModel = imports("models/post");
const cateModel = imports("models/cate");
const tabModel = imports("models/tab");
const logicPost = imports("logic/post");
const { userAuth, roleAuth } = imports("Lib/permission");

let index = (_dec = Controller("/post"), _dec2 = GET("/"), _dec3 = GET("/detail"), _dec4 = GET("/groupType"), _dec5 = POST("/add"), _dec6 = userAuth(), _dec7 = roleAuth(), _dec8 = POST("/swtich"), _dec9 = userAuth(), _dec10 = roleAuth(), _dec11 = POST("/update"), _dec12 = userAuth(), _dec13 = roleAuth(), _dec14 = POST("/delete"), _dec15 = POST("/uploadThum"), _dec16 = userAuth(), _dec17 = roleAuth(), _dec18 = POST("/uploadueimg"), _dec19 = userAuth(), _dec20 = roleAuth(), _dec(_class = (_class2 = class index {
    async getAll(ctx, next) {
        let option = ctx.request.query;
        // 分类下的
        if (option.cateId) {
            return ctx.body = await ctx.send((await postModel.findCateAll(option)));
        }
        // 标签下的
        if (option.tabId) {
            return ctx.body = await ctx.send((await postModel.findTabAll(option)));
        }
        // 搜索下的
        if (option.search) {
            return ctx.body = await ctx.send((await postModel.findSearchAll(option)));
        }
        // 所有的
        ctx.body = await ctx.send((await postModel.findAll(option)));
    }

    /**
    * @param {object} options 
    * @param {string|unmber} id post 
    * @param {string|unmber} a_status post状态,0:忽略状态查询(查所有) 1：正常，2：禁用
    * @param {string|unmber} is_tab post的tab状态 0:忽略状态查询 1：正常，2：禁用
    * @param {Booleam} addRead 
    * 
    */

    async findOne(ctx, next) {
        var option = ctx.request.query || {};
        // 数据校验
        // ......
        var res = await postModel.findId(option);
        return ctx.body = ctx.send(res);
    }

    // 统计分组article(根据cate|tab)

    async type(ctx, next) {
        var { type } = ctx.request.query;
        switch (type) {
            case "cate":
                ctx.body = await ctx.send((await cateModel.groupCate(ctx.request.query)));
                break;
            case "tab":
                ctx.body = await ctx.send((await tabModel.groupTab(ctx.request.query)));
                break;
            case "all":
                ctx.body = await ctx.send({ data: { cate: (await cateModel.groupCate(ctx.request.query)).data, tab: (await tabModel.groupTab(ctx.request.query)).data } });
                break;
            default:
                ctx.body = await ctx.error("type is require");
                break;
        }
    }

    async add(ctx, next) {
        // 数据校验
        var { title, content, cid, thumimg, remark, tabList = [] } = ctx.request.body;
        var resVery = await logicPost.veryAtricle({ title, content, thumimg, remark, tabList });
        if (resVery) return ctx.body = await ctx.error(resVery);
        ctx.body = await ctx.send((await postModel.addPost(ctx.request.body)));
    }

    /**单个/批量修改状态
     * @param {object} ctx.request.body 
     * @param {array} data =>[{id:1,status:1}]
     * */

    async swtich(ctx, next) {
        var { data = [] } = ctx.request.body;
        ctx.body = await ctx.send((await postModel.updateSwitch(data)));
    }
    //单个更新所有

    async update(ctx, next) {
        // 数据校验
        var { id, title, content, thumimg, remark, tabList = [] } = ctx.request.body;
        if (!id) return ctx.body = await ctx.error("id is required");
        var resVery = await logicPost.veryAtricle({ title, content, thumimg, remark, tabList });
        if (resVery) return ctx.body = await ctx.error(resVery);
        ctx.body = await ctx.send((await postModel.updateAll(ctx.request.body)));
    }

    // 删除一个post

    async del(ctx, next) {
        var { id } = ctx.request.body;
        ctx.body = await ctx.send((await postModel.delete(id)));
    }

    /**post 上传缩略图
    * */

    async uploadThum(ctx, next) {
        ctx.body = await postModel.uploadThum(ctx);
    }

    /**post 上传富文本编辑器的图片/文件
     * */

    async uploadUeImg(ctx, next) {
        ctx.body = await postModel.uploadUeImg(ctx);
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "getAll", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "getAll"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "findOne", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "findOne"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "type", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "type"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec5, _dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swtich", [_dec8, _dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "swtich"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec11, _dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "del", [_dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "del"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "uploadThum", [_dec15, _dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "uploadThum"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "uploadUeImg", [_dec18, _dec19, _dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "uploadUeImg"), _class2.prototype)), _class2)) || _class);

module.exports = index;