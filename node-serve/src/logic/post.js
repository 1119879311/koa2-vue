const  Joi = require("joi");
module.exports= new class {
    constructor() {
        // title,content,thumimg,remark,tabList
        this.verytitle = Joi.string().required().error(new Error("title is must required"));
        this.veryremark = Joi.string().required().error(new Error("remark  is must required"));
        this.verycontent = Joi.string().required().error(new Error("content is must required"));
        // this.verythumimg = Joi.string().required().error(new Error("thumimg  is must required"));
       
        this.verytabList = Joi.array().error(new Error("tabList type is array"));

    }
    async  veryAtricle(data={}){
        var _this = this;
        var schema = Joi.object().keys({
            title:_this.verytitle ,
            remark:_this.veryremark,
            content: _this.verycontent,
            // thumimg: _this.verythumimg,
            tabList:_this.verytabList
        })
        var resVali = Joi.validate(data,schema,{allowUnknown: true});
        if(resVali.error) return  await {errmsg:resVali.error.message};
        return null
    }
 
}