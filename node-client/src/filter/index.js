import fn from '@/util/fn';
const dataFormat = (value,type)=>{
    if(!value){
        return "";
    }
    var type = type?type:"yyyy-MM-dd hh:mm"
    return fn.dataFormat(new Date(Number(value)), type);
}
export default {
    dataFormat
}