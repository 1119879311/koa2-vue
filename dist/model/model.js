"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = require("../config");

// import modelMysql from "../lib/mysql/model";
const modelMysql = require("mysql-model-orm");
let model = class model extends modelMysql {
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