import axios from "axios";
import * as apiUrl from "@/api";
import qs from "qs";
import router from '@/router';
import store from "@/store";
import { Message } from 'element-ui';
const Axios = axios.create({})
//拦截请求

Axios.interceptors.request.use(function (req) {
    try {
        var {token} = JSON.parse(sessionStorage.getItem("token"))    
    } catch (error) {
       var  token = "";
    }
    req.headers.Authorization = token;
    return req;
}, function (error) {
    return Promise.reject(error);
});

// 服务器返回的数据状态code:
// "Error":-104,    //操作失败错误提示
// "NoToken":-102, //缺失或者过期token 
// "NoAuth":-103, //无权限操作
// "Success":200 //操作成功
//拦截响应
Axios.interceptors.response.use(function (res) {
    var {code,errmsg} = res.data;
    if(code==-102){
        store.dispatch("USER/LoginOut");
        Message({message:"登录失效，请重新登录",type:"error",duration:800})
        setTimeout(function(){
             return router.push('/admin/login')
        },1000) 
    }else if(code==-103){
          Message({message:"你没权限操作",type:"warning"});
    }else if(code=='-104'){
          Message({message:errmsg||"操作失败",type:"warning"});
    }
    return res;
  }, function (error) {
    
    return Promise.reject(error);
  });

function POST(apiName,data={}){
    var urls = apiUrl[apiName]?apiUrl[apiName]:apiName;
    return Axios({method: "post",url: urls,data:data});
}
function GET(apiName,data={}){
    var urls = apiUrl[apiName]?apiUrl[apiName]:apiName;
    return Axios({method: "GET",url: urls,params:data});
}
export default {
    POST,GET,Axios
}