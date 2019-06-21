var _dec, _dec2, _class, _desc, _value, _class2;

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

const { Controller, POST } = imports("Lib/router");
const { md5 } = imports("util/heper");
const userAuth = imports("Controller/admin/user_base");

let index = (_dec = Controller("/userCenter"), _dec2 = POST("/modifypwd"), _dec(_class = (_class2 = class index extends userAuth {
    //修改当前登录用户的信息
    async modifypwd(ctx, next) {
        let { password, checkPass } = ctx.request.body;
        let { userId } = ctx.state.userInfo;
        if (!password || password != checkPass) return ctx.body = ctx.send({ errmsg: "Two passwords are different" });
        var data = { password: md5(password) };
        try {
            await ctx.Model.update({ table: "tk_user", where: { id: userId }, values: data });
            ctx.body = await ctx.success("update is success");
        } catch (error) {
            return ctx.body = ctx.error('server is error');
        }
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "modifypwd", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "modifypwd"), _class2.prototype)), _class2)) || _class);

module.exports = index;