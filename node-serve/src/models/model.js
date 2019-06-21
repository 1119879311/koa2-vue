const modelMysql = imports("Lib/mysql/models")
let  { mysql } = imports('Config');
class model extends modelMysql{
    constructor(){
        super(mysql)
    }
    static instances(){
        if (!this.instance) {
            this.instance = new model();
        }
        return this.instance;
    }
}
module.exports= model.instances();