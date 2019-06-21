const https = require("https");
let request = class request {
    get(url, opt = {}) {
        return this.rq("get", url, opt);
    }
    post(url, opt) {
        return this.rq("post", url, opt);
    }
    rq(type = "get", url, opt = {}) {
        return new Promise((resolve, reject) => {
            https[type](url, res => {
                var bufferStr = [],
                    result = '';
                res.on("data", chunk => {
                    bufferStr.push(chunk);
                });
                res.on("end", () => {
                    result = Buffer.concat(bufferStr).toString("utf-8");
                    resolve(result);
                });
            }).on("error", () => {
                reject(err);
            });
        });
    }

};


module.exports = new request();