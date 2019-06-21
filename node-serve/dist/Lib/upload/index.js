const path = require('path');
const fs = require('fs');
const formidable = require("formidable");
const rootDir = process.cwd();
const { staticPath } = imports("Config");

// /**
//  * 创建目录
//  * @param {*} dirname 绝对路径 
//  */ 
async function mkdirSync(dirname) {

    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (await mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
/**
 * 上传文件
 * @param  {object} ctx       koa上下文
 * @param  {object} options   文件上传参数
 *                  dir         文件目录 "thnum"
 *                  stactPath   文件存放路径(相对静态目录)'/upload'
 *                  filenames  文件名(不带后缀)
 * @return {promise}
 */
async function uploadFile(ctx, config = {}, options = {}) {
    if (!ctx.request) return;
    let host = options.host || '/';
    let dir = options.dir || 'upload';
    let stactPath = options.stactPath || staticPath;
    let filePath = path.join(rootDir, stactPath, dir);
    await mkdirSync(filePath);
    var config = Object.assign({
        uploadDir: filePath,
        encoding: "utf-8",
        keepExtensions: true
    }, config || {});

    let upload = new formidable.IncomingForm(config);

    return new Promise((resolve, reject) => {
        var filesArray = [];
        upload.on("file", function (fields, file) {

            try {
                if (file.name != "") {
                    filesArray.push([fields, file]);
                } else {
                    if (fs.lstatSync(file.path).isDirectory()) {
                        fs.rmdirSync(file.path);
                    } else {
                        fs.unlinkSync(file.path); //无效文件删除
                    }
                }
            } catch (error) {
                console.log(err);
            }
        }).on("end", function () {}).on("field", function (key, val) {}).on("error", function (err) {
            reject(err);
        });

        upload.parse(ctx.req, async function (err, fields, files) {

            // fields 接收文本数据，files 接收文件类型数据
            var result = await filesArray.map(function (ele) {
                var oldpath = ele[1].path;
                var oldname = ele[1].name;
                let fname = options.filname ? options.filname + path.extname(oldname) : new Date().getTime().toString() + path.extname(oldname);
                //绝对路径
                let absoluPath = path.join(filePath, fname);
                //相对路径
                let relavepath = path.join(host, dir, fname);
                fs.rename(oldpath, absoluPath, function (err) {
                    if (err) {
                        fs.unlinkSync(oldpath);
                    }
                });
                return { host: host, size: ele[1].size, type: ele[1].type, hash: ele[1].hash, url: relavepath.replace(/\\/g, '/'), absoluPath: absoluPath.replace(/\\/g, '/'), filename: fname, oldname: oldname };
            });
            resolve({ fields: fields, files: result });
        });
    });
}

module.exports = uploadFile;