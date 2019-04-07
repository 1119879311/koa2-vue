export let ENV = process.env.NODE_ENV==="production"?true:false;
export let port = 3000;
export let sessionTime = 1000*60*60*24;//签名有限时间
export let routerPrefix = "/api"; //路由前缀
export let signed = "jJkK37aAbBcCdDeEXy89Y45Z_-6sStfFgGhHiIlLmMoOpPqQurRTuUvVwWxz";
export let uploadHost = ENV?"http://127.0.0.1:3000":"";
export let staticPath = "/theme"; //静态资源根目录
export let db = {
    type:"mysql",
    "mysql":{
        "host": "localhost",//主机名/ip
        "user": "root",//用户名
        "password": "root",//密码
        "port": 3306,//端口
        "database": "thinkjs" //连接的库
    }
}
