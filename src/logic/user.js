import Joi from "joi";
export default new class {
    constructor(){
        this.veryname = Joi.string().alphanum().min(3).max(30).required().error(new Error("name is lenght is 3-30"));
        this.verypass = Joi.string().required().regex(/^[a-zA-Z0-9]{3,30}$/).error(new Error("password is 只能字母与数字 且 长度3-30位"));
        this.verycontact = Joi.string().required().regex(/(^(13|15|18)\d{9}$)|(^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$)/).error(new Error("please contact is email or mobile"));
    }
    
    async login(data){
        var _this = this;
        var schema = Joi.object().keys({
            name:_this.veryname ,
            password: _this.verypass,
        })
        // console.log(data)
        var resVali = Joi.validate(data,schema,{allowUnknown: true});
        if(resVali.error) return  await {code:-101,mssage:resVali.error.message};
        return null
    }

    async addUser(data = {}){
        var _this = this;
        var schema = Joi.object().keys({
            name:_this.veryname ,
            password: _this.verypass,
            contact: _this.verycontact,
        })

        var resVali = Joi.validate(data,schema,{allowUnknown: true});
        if(resVali.error) return  await {code:-101,mssage:resVali.error.message};
        return null
    }
    async editUser(data = {}){
        var _this = this;
        var schema = Joi.object().keys({
            name:_this.veryname ,
            contact: _this.verycontact,
        })
        console.log(data)
        var resVali = Joi.validate(data,schema,{allowUnknown: true});
        console.log(resVali)

        if(resVali.error) return  await {code:-101,mssage:resVali.error.message};
        return null
    }


}