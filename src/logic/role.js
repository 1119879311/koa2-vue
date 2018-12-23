import Joi from "joi";
export default new class {
    constructor() {
        this.veryname = Joi.string().required().error(new Error("name is must required"));
        this.verytitle = Joi.string().required().error(new Error("title is must required"));
    }
    async  addRole(data={}){
        var _this = this;
        var schema = Joi.object().keys({
            name:_this.veryname ,
            password: _this.verytitle,
        })

        var resVali = Joi.validate(data,schema,{allowUnknown: true});
        if(resVali.error) return  await {code:-101,mssage:resVali.error.message};
        return null
    }
}