// 自定义状态
const code =  {
    "Error":-101,
    "NoToken":-401,
    "NoAuth":-404,
    "Success":200
}

export let success =(option={})=>{
  var res =  {status:true,code:code["Success"],mssage:"handle is success",data:""};
  if(typeof option =="string"){
     res['mssage'] = option;
     return res;
  }
  return Object.assign(res,option||{})
}
export let error =(option={})=>{
    var res =  {status:false,code:code["Error"],mssage:"handle is fail",data:""};
    if(typeof option =="string"){
         res['mssage'] = option;
         return res;
    }
    return Object.assign(res,option||{})
}