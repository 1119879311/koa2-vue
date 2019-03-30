"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _dec, _dec2, _dec3, _class, _desc, _value, _class2;

<<<<<<< HEAD
var _router = require("../../lib/router");
=======
var _router_decorator = require("../../util/router_decorator");
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2

var _upload = require("../../lib/upload");

var _upload2 = _interopRequireDefault(_upload);

<<<<<<< HEAD
var _base = require("../base");

var _base2 = _interopRequireDefault(_base);

=======
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

const fs = require("fs");
const path = require("path");
const stactPath = "/theme";

<<<<<<< HEAD
let _default = (_dec = (0, _router.Controller)("/upload"), _dec2 = (0, _router.POST)("/thum"), _dec3 = (0, _router.POST)("/ueimg"), _dec(_class = (_class2 = class _default extends _base2.default {
    constructor() {

        super();
    }
=======
let _default = (_dec = (0, _router_decorator.Controller)("/upload"), _dec2 = (0, _router_decorator.POST)("/thum"), _dec3 = (0, _router_decorator.POST)("/ueimg"), _dec(_class = (_class2 = class _default {
    constructor() {}
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2

    async thum(ctx, next) {
        var dir = await this.getFileName('/upload/thum');
        var res = await (0, _upload2.default)(ctx, { maxFieldsSize: 3 * 1024 }, { dir });
        try {
            var files = res.files;
            var fields = res.fields;
            if (fields && fields.id && files[0].url) {
                var res = await ctx.model.table("tk_article").field("thumimg").where({ id: fields.id }).findOne();
<<<<<<< HEAD
=======
                console.log(res);
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
                if (res) {
                    //修改
                    fs.unlinkSync(path.join(process.cwd(), stactPath, res.thumimg)); //删除原来的img
                    await ctx.model.table("tk_article").where({ id: fields.id }).update({ thumimg: files[0].url }); //更新图片;  
                }
                // 新增
                var resArr = [{ name: files[0].filename, url: files[0].url }];
            } else {
                var resArr = [];
            }
            ctx.body = await resArr;
        } catch (error) {
            console.log(error);
            ctx.body = await [];
        }
    }

    async uearticle(ctx, next) {
        try {
            var dir = await this.getFileName('/upload/thum');
            var res = await (0, _upload2.default)(ctx, {}, { dir });
            var files = res.files;
            var resUrl = files.map(ele => {
                return ele.url;
            });
            ctx.body = await {
                "errno": 0,
                "data": resUrl
            };
        } catch (error) {
            ctx.body = await {
                "code": 500,
                "errno": 1,
                "data": []
            };
        }
    }
    async getFileName(prex = "") {
        const date = new Date();
        let month = Number.parseInt(date.getMonth()) + 1;
        month = month.toString().length > 1 ? month : `0${month}`;
<<<<<<< HEAD
        var dir = `${prex}/${date.getFullYear()}${month}`;
=======
        var dir = `${prex}/${date.getFullYear()}${month}${date.getDate()}`;
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2
        return dir;
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "thum", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "thum"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "uearticle", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "uearticle"), _class2.prototype)), _class2)) || _class);

exports.default = _default;