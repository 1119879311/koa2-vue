import {Controller, POST, GET} from "../../util/router_decorator";
import uploadFile from "../../model/uploadFiles";
const fs = require("fs");
const path = require("path");
const stactPath = "/upload";
@Controller("/upload")
export  default  class  {
    constructor(){


    }
    @POST("/thum")
    async thum(ctx,next){
        var dir = await this.getFileName('thum');
        var res = await uploadFile(ctx,{ maxFieldsSize: 3 * 1024},{dir});
        var files = res.files;
        var fields = res.fields;
        console.log(fields)
        try {
            if (fields && fields.id && files[0].url){
                var res = await ctx.model.table("tk_article").field("thumimg").where({id:fields.id}).findOne(); 
                if(res){
                    // fs.unlinkSync(path.join(process.cwd(),stactPath, res.url));//删除原来的img
                    await ctx.model.table("tk_article").where({id:fields.id}).update({ thumimg:files[0].url});//更新图片
                }
            }
            ctx.body = await [{ name: files[0].filename, url: files[0].url }];
        } catch (error) {
            console.log(error)
            ctx.body = await [];
        }
        
    }
    @POST("/ueimg")
    async uearticle(ctx,next) {
        try {
            var dir = await this.getFileName('ueimg');
            var res = await uploadFile(ctx,{},{dir});
            var files = res.files;
            var resUrl = files.map((ele)=>{
                return ele.url
            })
            ctx.body = await  {
                "errno": 0,
                "data": resUrl
            } 
        } catch (error) {
            ctx.body = await  {
                "code":500,
                "errno": 1,
                "data": []
            } 
        }
    }
    async getFileName(prex=""){
        const date = new Date();
        let month = Number.parseInt(date.getMonth()) + 1;
        month = month.toString().length > 1 ? month : `0${month}`;
        var dir = `${prex}/${date.getFullYear()}${month}${date.getDate()}`;
        return dir;
    }
}