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
        this.veryurl = _joi2.default.string().required().error(new Error("url is must required"));
        this.verygname = _joi2.default.string().error(new Error("g_name type is string"));
    }
    async addAuth(data = {}) {
        var _this = this;
        var schema = _joi2.default.object().keys({
            name: _this.veryname,
            url: _this.veryurl,
            g_name: _this.verygname

        });

        var resVali = _joi2.default.validate(data, schema, { allowUnknown: true });
        if (resVali.error) return await { code: -101, mssage: resVali.error.message };
        return null;
    }
}();