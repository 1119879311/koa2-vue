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
        const date = new Date();
        let month = Number.parseInt(date.getMonth()) + 1;
        month = month.toString().length > 1 ? month : `0${month}`;
        var dir = `thum/${date.getFullYear()}${month}${date.getDate()}`
        var res = await uploadFile(ctx,{ maxFieldsSize: 3 * 1024},{dir});

        var files = res.files;
        var fields = res.fields;
        console.log(files)
        if (!fields && files.type == "modify" && files.id && files[0].url){
            try {
                var res = ctx.model.table("tk_article").field("thumimg").where({id:files.id}).findOne(); 
                if(res){
                    fs.unlinkSync(path.join(process.cwd(),stactPath, files[0].url));
                    await ctx.model.table("tk_article").where({id:files.id}).update({ thumimg:files[0].url})
                }
            } catch (error) {
                console.log(error)
            } 
        }
        ctx.body = await [{ name: files[0].filename, url: files[0].url }];
        
    }
    async uearticle(ctx,next) {
        try {
            var res = await uploadFile(ctx,{});
            var files = res.files;
            var resUrl = files.map((ele)=>{
                return ele.url
            })
            ctx.body = await  {
                "errno": 0,
                "data": resUrl
            } 
        } catch (error) {
            
        }
    }
    // async deleteOldThum(id,fileurl){
    //     var res = dbArticle.findOne({ field:["thumimg"],where:{id:id}}); 
    //     if(res.stact){
    //        try {
    //            fs.unlinkSync(path.join(process.cwd(),stactPath,fileurl));
    //            await dbArticle.update({ keyval: { thumimg:fileurl},where:{id,id}})
    //        } catch (error) {}
    //     } 
    // }

}