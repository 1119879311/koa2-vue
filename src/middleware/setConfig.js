import * as config from "../config";
var proxyConf = new Proxy(config,{
    set: function(target, property, value, receiver) {
        target[property]=value;
        return true;
    },
    get:function(target,key,dec){
        return target[key];
    }
});
export default async(ctx,next)=>{
    ctx.config = (...values)=>{
        if(values.length==0) return proxyConf;
        if(values.length==1) return proxyConf[values[0]];
        if(values.length==2) {
            var val = proxyConf[values[0]];
            return val? val[values[1]]:val;
        }
    }
    await next();
};

