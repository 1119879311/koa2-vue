"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

<<<<<<< HEAD
var _config = require("../config");

// import modelMysql from "../lib/mysql/model";
const modelMysql = require("mysql-model-orm");
let model = class model extends modelMysql {
=======
var _model = require("../lib/mysql/model");

var _model2 = _interopRequireDefault(_model);

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let model = class model extends _model2.default {
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
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