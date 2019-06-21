const { expiresIn, signed } = imports("Config");
const jwt = require("jsonwebtoken");
let TOKEN = class TOKEN {
    // 设置token
    static async Set(data) {
        // 1.利用jwt 生成token 
        var token = await jwt.sign({ data: data }, signed, { expiresIn });
        return await token;
    }
    // 获取token
    static Get(token) {
        // 1.
        try {
            return Promise.resolve(jwt.verify(token, signed));
        } catch (error) {
            return Promise.reject(null);
        }
    }
};


module.exports = TOKEN;