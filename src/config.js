export var ENV = process.env.NODE_ENV==="production"?true:false;
export var port = 3000;
export var signed = "jJkK37aAbBcCdDeEXy89Y45Z_-6sStfFgGhHiIlLmMoOpPqQurRTuUvVwWxz";
export var uploadHost = ENV?"http://127.0.0.1:3000":"";
export var db = {
    type:"mysql",
    "mysql":{
        "host": "localhost",//主机名/ip
        "user": "root",//用户名
        "password": "root",//密码
        "port": 3306,//端口
        "database": "thinkjs" //连接的库
    }
}
