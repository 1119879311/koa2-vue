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
const { expiresIn } = imports("Config");
const TOKENS = imports("util/utilToken");

let index = (_dec = Controller(), _dec2 = POST("/login"), _dec(_class = (_class2 = class index {
    async findUser(ctx, next) {
        var { name, password } = ctx.request.body;
        if (!name || !password) return ctx.body = await ctx.error("name or passord is must require");
        var res = await ctx.Model.findOne({ table: "tk_user", where: { name, password: md5(password) } });
        if (!res) {
            //用户是否存在
            return ctx.body = await ctx.error("no user");
        }
        if (res.status != 1 && res.isRoot != 1) {
            //用户是否启用(超级用户除外)
            return ctx.body = await ctx.error("your number is forbbin is login");
        }
        //签发token
        var data = { isRoot: res.isRoot, username: res.name, userId: res.id, expiresIn: new Date().getTime() + expiresIn };
        var token = await TOKENS.Set(data);
        data["token"] = token;
        ctx.body = await ctx.success({ data });
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "findUser", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "findUser"), _class2.prototype)), _class2)) || _class);

module.exports = index;