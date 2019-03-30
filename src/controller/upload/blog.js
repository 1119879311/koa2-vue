import {Controller, POST} from "../../lib/router";
import uploadFile from "../../lib/upload";
import base from "../base"
const fs = require("fs");
const path = require("path");
const stactPath = "/theme";

@Controller("/upload")
export  default  class extends base {
    constructor(){

        super();
    }
    @POST("/thum")
    async thum(ctx,next){
        var dir = await this.getFileName('/upload/thum');
        var res = await uploadFile(ctx,{ maxFieldsSize: 3 * 1024},{dir});
        try {
            var files = res.files;
            var fields = res.fields;
            if (fields && fields.id && files[0].url){
                var res = await ctx.model.table("tk_article").field("thumimg").where({id:fields.id}).findOne(); 
                if(res){ //修改
                    fs.unlinkSync(path.join(process.cwd(),stactPath, res.thumimg));//删除原来的img
                    await ctx.model.table("tk_article").where({id:fields.id}).update({ thumimg:files[0].url});//更新图片;  
                }
                // 新增
                var resArr = [{ name: files[0].filename, url: files[0].url }];
            }else{
                var resArr= [];
            }
            ctx.body = await resArr;
        } catch (error) {
            console.log(error)
            ctx.body = await [];
        }
        
    }
    @POST("/ueimg")
    async uearticle(ctx,next) {
        try {
            var dir = await this.getFileName('/upload/thum');
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
        var dir = `${prex}/${date.getFullYear()}${month}`;
        return dir;
    }
}