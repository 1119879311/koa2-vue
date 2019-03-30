"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require("path");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

<<<<<<< HEAD
let entryPath = process.env.NODE_ENV === "development" ? "src" : "dist";
console.log(process.env.NODE_ENV + "环境:执行目录" + entryPath);
let ctrPath = (0, _path.resolve)(entryPath, 'controller');

exports.default = app => {
    let loadCtr = rootPaths => {
=======
let rootPath = process.cwd();
let entryPath = process.env.NODE_ENV === "development" ? "src" : "dist";
console.log(entryPath);
let ctrPath = (0, _path.resolve)(entryPath, 'controller');

exports.default = app => {
    function loadCtr(rootPaths) {
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
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
<<<<<<< HEAD
    };
=======
    }
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
    loadCtr(ctrPath);
};