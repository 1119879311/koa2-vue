"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
let ENV = exports.ENV = process.env.NODE_ENV === "production" ? true : false;
let port = exports.port = 3000;
let sessionTime = exports.sessionTime = 1000 * 60 * 60 * 24; //签名有限时间
let routerPrefix = exports.routerPrefix = "/api"; //路由前缀
let signed = exports.signed = "jJkK37aAbBcCdDeEXy89Y45Z_-6sStfFgGhHiIlLmMoOpPqQurRTuUvVwWxz";
let uploadHost = exports.uploadHost = ENV ? "http://127.0.0.1:3000" : "";
<<<<<<< HEAD
let staticPath = exports.staticPath = "/theme"; //静态资源根目录;
let isStatic = exports.isStatic = true;
=======
let staticPath = exports.staticPath = "/theme"; //静态资源根目录
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
let db = exports.db = {
    type: "mysql",
    "mysql": {
        "host": "localhost", //主机名/ip
        "user": "root", //用户名
<<<<<<< HEAD
        "password": "root", //密码
=======
        "password": "", //密码
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
        "port": 3306, //端口
        "database": "thinkjs" //连接的库
    }
};