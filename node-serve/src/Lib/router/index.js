const koaRouter = require("koa-router");
const {routerPrefix} = imports("Config") 
const router = new koaRouter();

const RequestMethod = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
    ALL: "all"
}

function Controller(prefix) {
    router.prefixed =routerPrefix+(prefix ? prefix.replace(/\/+$/g, "") : '');
    return (target) => {
        target.router = router;
        let obj = new target;
        let actionList = Object.getOwnPropertyDescriptors(target.prototype);
        for (let key in actionList) {
            if (key !== "constructor") {
                var fn = actionList[key].value;
                if (typeof fn == "function" && fn.name != "__before") {
                    fn.call(obj, router, obj);
                }

            }
        }
    }
}

function Request(option = {url, method}) {
    return function (target, value, dec) {
        let fn = dec.value;
        dec.value = (routers, targets) => {
            routers[option.method](routers.prefixed + option.url, async (ctx, next) => {
                if (target.__before && typeof target.__before == "function") {
                    // 如果class 有__before 前置函数，//再默认装饰一次
                    var beforeRes = await target.__before.call(target,ctx, next, target);
                    if (!beforeRes) {
                       return await fn.call(target, ctx, next, target)
                    }else{
                        return  ctx.body = await beforeRes
                    }
                } else {
                    await fn.call(target, ctx, next, target)
                }
            })
        }

    }
}



 function POST(url) {
    return Request({url, method: RequestMethod.POST})
}

 function GET(url) {
    return Request({url, method: RequestMethod.GET})
}

 function PUT(url) {
    return Request({url, method: RequestMethod.PUT})
}

 function DEL(url) {
    return Request({url, method: RequestMethod.DELETE})
}

 function ALL(url) {
    return Request({url, method: RequestMethod.ALL})
}

module.exports = {
    Controller,POST,GET,PUT,DEL,ALL
}
