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
        this.verytitle = _joi2.default.string().required().error(new Error("title is must required"));
    }
<<<<<<< HEAD
    async veryRole(data = {}) {
        var _this = this;
        var schema = _joi2.default.object().keys({
            name: _this.veryname,
            title: _this.verytitle
=======
    async addRole(data = {}) {
        var _this = this;
        var schema = _joi2.default.object().keys({
            name: _this.veryname,
            password: _this.verytitle
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
        });

        var resVali = _joi2.default.validate(data, schema, { allowUnknown: true });
        if (resVali.error) return await { code: -101, mssage: resVali.error.message };
        return null;
    }
}();