'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koa2Cors = require('koa2-cors');

var _koa2Cors2 = _interopRequireDefault(_koa2Cors);

var _ctxbody = require('./util/ctxbody');

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa2.default();
const cluster = require("cluster");
const nunCpus = require("os").cpus().length;
const http = require("http");

app.context.success = _ctxbody.success;
app.context.error = _ctxbody.error;

app.use((0, _koa2Cors2.default)());
// app.use(async (ctx,next)=>{
//     // 允许来自所有域名请求
//     ctx.set("Access-Control-Allow-Origin", "*");
//     // 设置所允许的HTTP请求方法
//     ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");

//     // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
//     ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");

//     // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。

//     // Content-Type表示具体请求中的媒体类型信息
//     // ctx.set("Content-Type", "application/json;charset=utf-8");
//     await next();
//     if (ctx.request.method == "OPTIONS") {
//         ctx.response.status = 200
//     }
// })
app.use(async (ctx, next) => {

    console.log(ctx.headers.authorization);
    process.on('uncaughtException', async error => {
        //捕获进程错误
        console.log('call uncaughtException handle');
        ctx.status = 500;
        ctx.body = await { status: false, error: "server error", code: 500 };
    });
    await next();
});

(0, _middleware2.default)(app); //加载中间间

(0, _router2.default)(app); //加载路由

// import "./test"


if (cluster.isMaster) {
    console.log(`主进程${process.pid}正在运行`);
    for (let i = 0; i < 2; i++) {
        cluster.fork();
    }
    cluster.on("exit", (work, code, sign) => {
        console.log(`工作进程${work.process.pid}退出`);
    });
} else {
    app.on("close", () => {
        console.log("http server alearly close");
    });
    app.on('error', async (err, ctx) => {
        console.error('server error', err, ctx);
        ctx.body = await { status: 500, error: "server error" };
    });
    var httpApp = http.createServer(app.callback()).listen(3000);
    httpApp.on("close", function () {
        console.log("http server alearly close");
    });
    httpApp.on("error", function (err) {
        httpApp.close();
    });
    httpApp.on("listening", function () {
        console.log("http server start runing in port 3000...");
    });
    console.log(`工作进程 ${process.pid} 已启动`);
}