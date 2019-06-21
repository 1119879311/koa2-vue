var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class, _desc, _value, _class2;

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
const tabModel = imports("models/tab");
const { userAuth, roleAuth } = imports("Lib/permission");

let index = (_dec = Controller("/tab"), _dec2 = GET("/"), _dec3 = POST("/add"), _dec4 = userAuth(), _dec5 = roleAuth(), _dec6 = POST("/swtich"), _dec7 = userAuth(), _dec8 = roleAuth(), _dec9 = POST("/update"), _dec10 = userAuth(), _dec11 = roleAuth(), _dec12 = POST("/delete"), _dec13 = userAuth(), _dec14 = roleAuth(), _dec(_class = (_class2 = class index {
    async getAll(ctx, next) {
        var { status } = ctx.request.query;
        ctx.body = await ctx.send((await tabModel.findAll(status)));
    }

    async add(ctx, next) {
        ctx.body = await ctx.send((await tabModel.add(ctx.request.body)));
    }

    //单个/批量修改状态
    /**
     * @param {object} ctx.request.body 
     * @param {array} data =>[{id:1,status:1}]
     * */

    async swtich(ctx, next) {
        var { data } = ctx.request.body;
        ctx.body = await ctx.send((await tabModel.switch(data)));
    }

    //单个更新所有

    async update(ctx, next) {
        ctx.body = await ctx.send((await tabModel.update(ctx.request.body)));
    }

    // 删除一个

    async del(ctx, next) {
        var { id } = ctx.request.body;
        ctx.body = await ctx.send((await tabModel.del(id)));
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "getAll", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "getAll"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3, _dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swtich", [_dec6, _dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "swtich"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec9, _dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "del", [_dec12, _dec13, _dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "del"), _class2.prototype)), _class2)) || _class);

module.exports = index;