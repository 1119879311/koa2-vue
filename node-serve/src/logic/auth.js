const  Joi = require("joi");
module.exports= new class {
    constructor() {
        this.veryname = Joi.string().required().error(new Error("name is must required"));
        this.veryurl = Joi.string().required().regex(/^(\/[a-zA-Z]{1,}){1,}\/$/).error(new Error("url必填且规则如：/abc/,/ab/dc/"));
        this.veryIdentName = Joi.string().required().regex(/^[a-zA-Z]{4,}$/).error(new Error("identName必填且是字母，不区分大小写，且最少4位"));
        // this.veryGroupName = Joi.string().error(new Error("groupName type is string"));
        
    }
    async  veryAuth(data={}){
        var _this = this;
        var schema = Joi.object().keys({
            name:_this.veryname ,
            url: _this.veryurl,
            identName: _this.veryIdentName,
            // groupName: _this.veryGroupName,

        })

        var resVali = Joi.validate(data,schema,{allowUnknown: true});
        if(resVali.error) return  await {errmsg:resVali.error.message};
        return null
    }
}