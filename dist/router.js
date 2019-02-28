"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require("path");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let rootPath = process.cwd();
let entryPath = process.env.NODE_ENV === "development" ? "src" : "dist";
console.log(entryPath);
let ctrPath = (0, _path.resolve)(entryPath, 'controller');

exports.default = app => {
    function loadCtr(rootPaths) {
        try {
            var allfile = _fs2.default.readdirSync(rootPaths);
            allfile.forEach(file => {
                var filePath = (0, _path.resolve)(rootPaths, file);
                if (_fs2.default.lstatSync(filePath).isDirectory()) {
                    loadCtr(filePath);
                } else {
                    let r = require(filePath).default;
                    if (r && r.router && r.router.routes) {
                        try {
                            app.use(r.router.routes());
                        } catch (error) {
                            console.log(filePath);
                        }
                    } else {
                        // console.log("miss routes:--filename:"+filePath)
                    }
                }
            });
        } catch (error) {
            console.log(error);
            console.log("no such file or dir :---- " + rootPaths);
        }
    }
    loadCtr(ctrPath);
};