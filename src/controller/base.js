import userAuth from "../util/auth_decorator"

export default class {
   
    async __before(ctx,next){
        var isUser = await userAuth.utilUser(ctx);
        if(isUser) return isUser;
        var isRole = await userAuth.utilRole(ctx);
        if(isRole) return isRole;
        return null;
    }
}