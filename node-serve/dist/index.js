"use strict";

const http = require("http");
const koa = require("koa");
const App = new koa();
const path = require("path");
const { port, entryPath } = require("./Config");
const { logsError, logs } = require("./Middleware/logs");

// 简化载入函数
global.imports = dir => {
    return require(path.resolve(entryPath, dir));
};
// 捕获错误
App.on("error", logsError);

// 加载中间件
require("./Middleware")(App);

// 加载路由
require("./router")(App);

// 测试mysql
// require("./test.mysql");

// 启动服务
var httpApp = http.createServer(App.callback()).listen(port, '0.0.0.0'); //获取ip 为ip4 格式(192.168.5.109)，默认是ip6 格式(::ffff:192.168.5.109);
httpApp.on("listening", () => {
    logs.info(`http server start runing in port ${port}...`);
});