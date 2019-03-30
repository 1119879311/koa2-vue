import crypto from "crypto";
export default {
    _proto_: (type) => {
        return Object.prototype.toString.call(type)
    },
    isNull:(val)=>{
        return this._proto_(val)=="[object Null]";
    },
    isFunction:(val)=>{
        return this._proto_(val)=="[object Function]";
    },
    isUndefined(val){
        return this._proto_(val)=="[object Undefined]";
    },
    isNumber:(val)=>{
        return this._proto_(val)=="[object Number]";
    },
    isSymbol:(val)=>{
        return this._proto_(val)=="[object Symbol]";
    },
    isBooleam:(val)=>{
        return this._proto_(val)=="[object Booleam]";
    },
    isString:(val)=>{
        return this._proto_(val)=="[object String]";
    },
    isObject(val){
        return this._proto_(val)=="[object Object]";
    },
    isArray(val){
        return this._proto_(val)=="[object Array]";
    },
    isStringNumber(val){
        return this.isString(val)||this.isNumber(val);
    },
    _proto_(type) {
        return Object.prototype.toString.call(type)
    },
    objLen:(val)=>{
        if(this.isObject(val)) return (Object.keys(val)).length;
        return 0;
    },
    splitobj: (obj = {}, live = "=") => {//对象键值拼接
        var str = ''
        for (var i in obj) {
            str += `${i} ${live}'${obj[i]}'`
        }
        return str
    },
    signRonder: (n = 30) => { //去随机数
        var str = "123456789aAbBcCdDeEfFgGhHiIjJkKlLmMoOpPqQurRsStTuUvVwWxXyYzZ_-";
        if ( n < 3) n = 30;
        var ronderstr = "";
        for (var i = 0; i < n; i++) {
            var index = Math.floor(Math.random() * str.length);
            ronderstr += str[index];
        }
        return ronderstr
    },
    md5: (pwd, key=pwd) => { //md5 加密
        var hash = crypto.createHash("md5");
        hash.update(pwd +"-"+ key);

        return hash.digest("hex");
    },
    Aes: {
        //加密
        aesEncrypt: function (val, key) {
            const cipher = crypto.createCipher('aes192', key);
            var cipval = cipher.update(val, 'utf8', 'hex');
            cipval += cipher.final('hex');
            return cipval;
        },
        //解密
        aesDecrypt: function (val, key) {
            const decipher = crypto.createDecipher('aes192', key);
            var decval = decipher.update(val, 'hex', 'utf8');
            decval += decipher.final('utf8');
            return decval;
        }

    },
    ip: (ips) => {
        if (!ips || ips == "" || typeof ips != "string") return ips
        //ipv4 前缀
        if (ips.startsWith("::ffff:")) {
            ips = ips.substr(coede.length)
        }
        if (ips == "::1") {
            ips = "127.0.0.1";
        }
        return ips;
    },
    dataFormat: (date, format = "yyyy-MM-dd") => {//参数一:时间，参数，要显示的时间格式
        if (Object.prototype.toString.call(date) != "[object Date]") return false;

        var o = {
            "M+": date.getMonth() + 1,                 //月份 
            "d+": date.getDate(),                    //日 
            "h+": date.getHours(),                   //小时 
            "m+": date.getMinutes(),                 //分 
            "s+": date.getSeconds(),                 //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds()             //毫秒 
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return format;
    },

    //递归对象， 实现一维数据结构
    recurOne: function (data = [], id = "id", pid = "pid", pidnum = 0, leve = 1) {//关联值 id and tid  = 0(定级)
        if (Object.prototype.toString.call(data) !== '[object Array]') return data;
        var arr = [];
        var $this = this;
        data.forEach(function (itme, index) {
            if (itme[pid] == pidnum) {
                itme['leve'] = leve
                arr.push(itme)
                arr = arr.concat($this.recurOne(data, id, pid, itme[id], leve + 1));
            }
        })
        return arr
    },
    //递归 实现无限极树状结构
    recurMany: function (data = [], id = "id", pid = "pid", pidnum = 0, leve = 1) {
        if (Object.prototype.toString.call(data) !== '[object Array]') return data;
        var result = new Array();
        var $this = this;
        data.forEach(function (itme) {
            if (itme[pid] == pidnum) {
                itme["leve"] = leve;
                itme["chrildren"] = $this.recurMany(data, id, pid, itme[id], leve + 1);
                result.push(itme)
            }
        })
        return result
    },
    //递归找子集，返回一个数组(子集每一项的id)
    filterChrildId: function (data = [], id = "id", pid = "pid", idNum = 0,field=null) {//默认没有子集，返回空数组
       var _this = this;
        if (!idNum || idNum == 0) return [];
        var arrId = [];
        if (Object.prototype.toString.call(data) !== '[object Array]') return [];
        data.forEach(ele => {
            if (ele[pid] == idNum) {
                if(field){
                    arrId.push(ele);
                }else{
                    arrId.push(ele[id]);
                }               
                arrId = arrId.concat(_this.filterChrildId(data, id, pid, ele[id],field))
            }
        });
        return arrId;

    },
    // 递归添加子集的数据
    diGuiAdd:function(data = [],idField="id",pidField="pid",countField = "count"){   
        if (Object.prototype.toString.call(data) !== '[object Array]') return data;
        var cloneData = JSON.parse(JSON.stringify(data));
         function fn(cloneData,cid,count){
             var counts = count ;
             cloneData.forEach(async (ele)=>{
                 if(ele[pidField]==cid){
                     counts +=ele[countField];
                     counts+=await fn(cloneData, ele[idField], counts);
                 }
             });
             return  counts;
         }
         data.forEach( (ele) => {
             ele[countField] = fn(cloneData, ele[idField], ele[countField]);    
         });
         return  data;
     },

    deepCopy: function (obj) {//对象拷贝：深拷贝
        if (typeof obj != "object") return obj;
        var newObj = new Object();
        var $this = this;
        for (var i in obj) {
            newObj[i] = $this.deepCopy(obj[1])
        }
        return newObj

    },
}