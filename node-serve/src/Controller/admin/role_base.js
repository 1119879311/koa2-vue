const {utilUser,utilRole} = imports("Lib/permission")
// 拦截用户的角色认证
module.exports = class {
    async __before(ctx){
        var isUser = await utilUser(ctx);
        if(isUser) return isUser;
        var isRole = await utilRole(ctx);
        if(isRole) return isRole;
        return null;
   }
}