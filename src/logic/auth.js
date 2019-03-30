import Joi from "joi";
export default new class {
    constructor() {
        this.veryname = Joi.string().required().error(new Error("name is must required"));
        this.veryurl = Joi.string().required().regex(/^(\/[a-zA-Z]{1,}){1,}\/$/).error(new Error("格式不对，如：/abc/,/ab/dc/"));
        this.veryIdentName = Joi.string().required().regex(/^[a-zA-Z]{4,}$/).error(new Error("一定是字母，不区分大小写，且最少4位"));
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
        if(resVali.error) return  await {code:-101,mssage:resVali.error.message};
        return null
    }
}