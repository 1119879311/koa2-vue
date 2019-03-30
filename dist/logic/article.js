"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new class {
    constructor() {
        // title,content,thumimg,remark,tabList
        this.verytitle = _joi2.default.string().required().error(new Error("title is must required"));
        this.verycontent = _joi2.default.string().required().error(new Error("content is must required"));
        this.verythumimg = _joi2.default.string().required().error(new Error("thumimg  is must required"));
        this.veryremark = _joi2.default.string().required().error(new Error("remark  is must required"));
        this.verytabList = _joi2.default.array().error(new Error("tabList type is array"));
    }
    async veryAtricle(data = {}) {
        var _this = this;
        var schema = _joi2.default.object().keys({
            title: _this.verytitle,
            content: _this.verycontent,
            thumimg: _this.verythumimg,
            remark: _this.veryremark,
            tabList: _this.verytabList
        });
        var resVali = _joi2.default.validate(data, schema, { allowUnknown: true });
        if (resVali.error) return await { code: -101, mssage: resVali.error.message, status: false };
        return null;
    }
}();