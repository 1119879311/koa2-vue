"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new class {
    constructor() {
        this.veryname = _joi2.default.string().required().error(new Error("name is must required"));
        this.veryurl = _joi2.default.string().required().regex(/^(\/[a-zA-Z]{1,}){1,}\/$/).error(new Error("格式不对，如：/abc/,/ab/dc/"));
        this.veryIdentName = _joi2.default.string().required().regex(/^[a-zA-Z]{4,}$/).error(new Error("一定是字母，不区分大小写，且最少4位"));
        // this.veryGroupName = Joi.string().error(new Error("groupName type is string"));
    }
    async veryAuth(data = {}) {
        var _this = this;
        var schema = _joi2.default.object().keys({
            name: _this.veryname,
            url: _this.veryurl,
            identName: _this.veryIdentName
            // groupName: _this.veryGroupName,

        });

        var resVali = _joi2.default.validate(data, schema, { allowUnknown: true });
        if (resVali.error) return await { code: -101, mssage: resVali.error.message };
        return null;
    }
}();