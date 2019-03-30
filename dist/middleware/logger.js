"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async (ctx, next) => {
  await console.log(`\u001b[32m[${new Date().toLocaleString()}] : ${ctx.request.method} ${ctx.request.url} ${ctx.protocol}://${ctx.host}  \u001b[32m`);
  await next();
};