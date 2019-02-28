"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _model = require("../lib/mysql/model");

var _model2 = _interopRequireDefault(_model);

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let model = class model extends _model2.default {
    constructor() {
        super(_config.db.mysql);
    }
    static instances() {
        if (!this.instance) {
            this.instance = new model();
        }
        return this.instance;
    }
};
exports.default = model.instances();