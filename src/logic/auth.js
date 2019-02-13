import Joi from "joi";
export default new class {
    constructor() {
        this.veryname = Joi.string().required().error(new Error("name is must required"));
        this.veryurl = Joi.string().required().error(new Error("url is must required"));
        this.verygname = Joi.string().error(new Error("g_name type is string"));
    }
    async  addAuth(data={}){
        var _this = this;
        var schema = Joi.object().keys({
            name:_this.veryname ,
            url: _this.veryurl,
            g_name: _this.verygname,

        })

        var resVali = Joi.validate(data,schema,{allowUnknown: true});
        if(resVali.error) return  await {code:-101,mssage:resVali.error.message};
        return null
    }
}