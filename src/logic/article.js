import Joi from "joi";
export default new class {
    constructor() {
        // title,content,thumimg,remark,tabList
        this.verytitle = Joi.string().required().error(new Error("title is must required"));
        this.verycontent = Joi.string().required().error(new Error("content is must required"));
        // this.verythumimg = Joi.string().required().error(new Error("thumimg  is must required"));
        this.veryremark = Joi.string().required().error(new Error("remark  is must required"));
        this.verytabList = Joi.array().error(new Error("tabList type is array"));

    }
    async  veryAtricle(data={}){
        var _this = this;
        var schema = Joi.object().keys({
            title:_this.verytitle ,
            content: _this.verycontent,
            // thumimg: _this.verythumimg,
            remark:_this.veryremark,
            tabList:_this.verytabList
        })
        var resVali = Joi.validate(data,schema,{allowUnknown: true});
        if(resVali.error) return  await {code:-101,mssage:resVali.error.message,status:false};
        return null
    }
}