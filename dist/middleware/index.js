"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

var _heper = require("../util/heper");

var _heper2 = _interopRequireDefault(_heper);

var _setConfig = require("./setConfig");

var _setConfig2 = _interopRequireDefault(_setConfig);

var _model = require("./model");

var _model2 = _interopRequireDefault(_model);

var _koaBodyparser = require("koa-bodyparser");

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaStatic = require("koa-static");

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import isAuthUser from "./isUserAuth";
// Object.assign(heper,{jwtSign:isAuthUser.siger})
//数据库model中间件
//辅助工具方法 中间件
const __rootDir = process.cwd(); //配置文件中间件
//打印日志中间件

exports.default = app => {
    app.use(_setConfig2.default).use(_logger2.default).use(_model2.default).use((0, _koaBodyparser2.default)()).use((0, _koaStatic2.default)(__rootDir + _config.staticPath)).use(async (ctx, next) => {
        ctx.heper = _heper2.default;
        await next();
    });
    // .use(isAuthUser.verifyHeader({GET:['*'],POST:["/api/v1/admin/login"]}))
};