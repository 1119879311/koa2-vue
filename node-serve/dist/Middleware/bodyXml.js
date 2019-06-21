const querystring = require("querystring");
module.exports = (option = {}) => {
    return async (ctx, next) => {
        let buffer = [];
        await new Promise((resolve, reject) => {
            ctx.req.on("data", chunk => {
                buffer.push(chunk);
            });
            ctx.req.on("end", async () => {
                let contentType = ctx.get("Content-Type");
                let result = Buffer.concat(buffer).toString('utf-8');
                switch (contentType) {
                    case "text/xml":
                        resolve(result);
                        ctx.request.body = {};
                        break;
                    case "application/x-www-form-urlencoded":
                        resolve(querystring.parse(result));
                        ctx.request.body = querystring.parse(result);
                        break;
                    case "application/json":
                    case "application/json;charset=UTF-8":
                        resolve(result);
                        ctx.request.body = result ? JSON.parse(result) : {};
                        break;
                    default:
                        resolve({});
                        ctx.request.body = {};
                        break;
                }
            });
        });

        await next();
    };
};