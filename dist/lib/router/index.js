'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Controller = undefined;
exports.POST = POST;
exports.GET = GET;
exports.PUT = PUT;
exports.DEL = DEL;
exports.ALL = ALL;

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _koaRouter2.default();

const RequestMethod = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
    ALL: "all"
};

function Controller(prefix) {
    router.prefixed = _config.routerPrefix + (prefix ? prefix.replace(/\/+$/g, "") : '');
    return target => {
        target.router = router;
        let obj = new target();
        let actionList = Object.getOwnPropertyDescriptors(target.prototype);
        for (let key in actionList) {
            if (key !== "constructor") {
                var fn = actionList[key].value;
                if (typeof fn == "function" && fn.name != "__before") {
                    fn.call(obj, router, obj);
                }
            }
        }
    };
}

function Request(option = { url, method }) {
    return function (target, value, dec) {
        let fn = dec.value;
        dec.value = (routers, target) => {
            routers[option.method](routers.prefixed + option.url, async (ctx, next) => {
                if (target.__before && typeof target.__before == "function") {
                    // 如果class 有__before 前置函数，
                    var beforeRes = await target.__before(ctx, next, target);
                    if (!beforeRes) {
                        return await fn.call(target, ctx, next, target);
                    } else {
                        return ctx.body = await beforeRes;
                    }
                } else {
                    await fn.call(target, ctx, next, target);
                }
            });
        };
    };
}

var Controller = exports.Controller = Controller;

function POST(url) {
    return Request({ url, method: RequestMethod.POST });
}

function GET(url) {
    return Request({ url, method: RequestMethod.GET });
}

function PUT(url) {
    return Request({ url, method: RequestMethod.PUT });
}

function DEL(url) {
    return Request({ url, method: RequestMethod.DELETE });
}

function ALL(url) {
    return Request({ url, method: RequestMethod.ALL });
}