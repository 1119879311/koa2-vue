"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// 自定义状态
const code = {
    "Error": -101,
    "NoToken": -401,
    "NoAuth": -404,
    "Success": 200
};

let success = exports.success = (option = {}) => {
    var res = { status: true, code: code["Success"], mssage: "handle is success", data: "" };
    if (typeof option == "string") {
        res['mssage'] = option;
        return res;
    }
    return Object.assign(res, option || {});
};
let error = exports.error = (option = {}) => {
    var res = { status: false, code: code["Error"], mssage: "handle is fail", data: "" };
    if (typeof option == "string") {
        res['mssage'] = option;
        return res;
    }
    return Object.assign(res, option || {});
};