const Joi = require("joi");
module.exports = new class {
    constructor() {
        this.veryname = Joi.string().required().error(new Error("name is must required"));
        this.verytitle = Joi.string().required().error(new Error("title is must required"));
    }
    async veryRole(data = {}) {
        var _this = this;
        var schema = Joi.object().keys({
            name: _this.veryname,
            title: _this.verytitle
        });
        var resVali = Joi.validate(data, schema, { allowUnknown: true });
        if (resVali.error) return await { errmsg: resVali.error.message };
        return null;
    }
}();