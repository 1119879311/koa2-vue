const model = imports("models/model");
const request = imports("util/request");
const {getClientIP} =require("util/heper")
module.exports = class {
    // 记录客户端的ip 访问，每天统计一次
    async static setIPLogs(options={}){
        //  根据ip 获取客户端 的地址
        var {ip} = options;
        var webKey="6785506b6676ac1c290daaead359ca27";
        var url =  `https://restapi.amap.com/v3/ip?key=${webKey}&ip=${ip}`;
        var res = await request.get(url);
        res = JSON.parse(res);
        var adddress =  res['province'] + res['city'] ;
        // var data = {ip:"",adddress:"",count:"",updateTimes:new Date().getTime()}
        var nowDate = new Date().getTime()-(new Date().getHours())*24*60*1000;
        var res = await model.findOne({table:"tk_logs",where:{ip,updateTimes:[">=",nowDate]}})
        // 如果今天没有，则直接添加
        if(!res){
            return model.add({ip,adddress,readercount:1,updateTimes:new Date().getTime()})
        }
        // 如果有,距离上一次统计间隔不能少于30 分钟，否则不记录 30*60*1000
        if(new Date().getTime()-res.updateTimes>=30*60*1000){
            return await model.update({table:"tk_logs",values:{readercount:Number(res.readercount)+1},where:{id:res.id}})
        }
        return null;
    }


    // 统计:今天的总访次数，ip(用户)的访问个数， 每个ip(用户)的访问次数，每个月的访问次数
    async static tongjitLogs(){
        // 当前时间
        try {
            var nowDate = new Date().getTime()-(new Date().getHours())*24*60*1000;
            // 当天 分组 每个ip 的总数
            var todayAllIp = await model.select({table:"tk_logs",filed:`*,count(ip)`,where:{updateTimes:[">=",nowDate]},group:"ip"});
            if(res&&res.lenght){
                // 当天的总数
                var noweYear = new Date().getFullYear()
                var showCount = res.reduce((itme,nextItme)=>itme.readercount+nextItme.readercount)
            }
    
             // 今年 每个月的访问量分布 
            var yearReaderCount = await model.select({table:"tk_logs",
            filed:'ip,adddress,from_unixtime(updateTime/1000,"%m") as month,sum(readercount) as readercount',
            where:[`${noweYear}=from_unixtime(updateTime/1000,"%Y")`],group:"month"});
            
            // 今年每个月的人数分布
            var yearIpCount = await model.select({table:"tk_logs",
            filed:'ip,adddress,from_unixtime(updateTime/1000,"%m") as month,count(ip) as readercount',
            where:[`from_unixtime(updateTime/1000,"%Y")=${model.escape(noweYear)}`],group:"month"});
            return {data:{todayAllIp,todayAllReadCount,yearReaderCount,yearIpCount,showCount}}
        } catch (error) {
            console.log(error)
            return await {errmsg:"server is error"}
        }
       

    }
}