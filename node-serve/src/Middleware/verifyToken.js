module.exports = (options={},callback)=>{
    return async (ctx,next)=>{
        // 验证url名单
        // {"POST":"^/api/"}  {"POST":["^/api/"]} ["^/api/"]
        var methond = ctx.method.toUpperCase();//转大写
        var path = ctx.path;
        var flag = false;
        if(Array.isArray(options)){
            flag = verifyArr(options,path);
        }else if(Object.prototype.toString.call(options)=="[object Object]"){
            if(typeof options[methond]=="string"){
                flag = verifyStr(options[methond],path)
            }else if(Array.isArray(options[methond])){
                flag = verifyArr(options[methond],path);
            }
           
        }else if(Object.prototype.toString.call(options)=="[object String]"){
            flag = verifyStr(options,path)
        }
        if(!flag){//不存在跳过
            await next();
        }else{
            callback(ctx,next); 
        }

    }
}

function verifyArr(data,path){
    return  data.some(itme=>{
         if(itme=="*") return true;
         if(typeof itme=="string"){
            return path.match(itme)
         }
    })
}

function verifyStr(data,path){
    if(data=="*") return true;
    return path.match(data)
}


