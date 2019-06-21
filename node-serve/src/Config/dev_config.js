module.exports = {
    port:3000, //服务run端口
    routerPrefix:"/api", //所有的接口一个前缀
    staticPath : "/theme", //静态资源根目录
    entryPath : process.env.NODE_ENV==="development"?"src":"dist",
    mongoDbConf:"mongodb://localhost:27017/tk_mondb", //mongodb 链接配置,
    signed:"jJkK37aAbBcCdDeEXy89Y45Z_-6sStfFgGhHiIlLmMoOpPqQurRTuUvVwWxz",
    expiresIn:60*60*24,
    redisConf:{
        port:6379,
        host:"127.0.0.1"
    },
    mysql:{
        "host": "localhost",//主机名/ip
        "user": "root",//用户名
        "password": "",//密码
        "port": 3306,//端口
        "database": "thinkjs" //连接的库
    }

}