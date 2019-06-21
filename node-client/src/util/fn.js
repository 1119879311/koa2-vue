export default {
    //数组去重
    reaptArr: function (arr) {
        //方法一，利用Set对象,元素唯一性
        if (new Set()) return [...new Set(arr)]

        //方法二:利用对象，属性不重复性
        let obj = {};
        let newarr = [];
        for (let i = 0; i < arr.length; i++) {
            if (!obj[arr[i]]) {
                obj[arr[i]] = true;
                newarr.push(arr[i]);
            }
        }
        return newarr;
        //方法三：利用indexOf 查看元素是否存在于数组中,如果不存在返回-1
        for (var j = 0; j < arr.length; j++) {
            if (newarr.indexOf(arr[j] == -1)) {
                newarr.push(arr[j]);
            }
        }
        return newarr;


    },

    //十六进制颜色随机生成
    randomColor: function () {
        var colorStr = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
        var colorArr = colorStr.split(",");
        var color = "#";
        for (let i = 0; i < 6; i++) {
            color += colorArr[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    //统计一段字符串中数字或字母出现次数最多,利用对象形式
    moreCount: function (str) {
        if (typeof str != "string" || str.length < 0) return str;
        let obj = {};
        //利用charAt(index),把字符串分隔
        for (var i = 0; i < str.length; i++) {
            var val = str.charAt(i);
            if (obj[val]) {
                obj[val] = obj[val] + 1;
            } else {
                obj[val] = 1
            }
        }

        //找出对象中最大的值
        let max = 0;
        for (let i in obj) {
            if (max < obj[i]) max = obj[i];
        }
        var newobj = {};
        for (let i in obj) {
            if (obj[i] == max) {
                newobj[i] = obj[i]
            }
        }
        return newobj;

    },
    //随机返回指定数组中的N个不重复的数
    randomVal: function (arr, n) {
        // 随机生成一个范围内的索引;
        if (arr.length == 1) return arr;
        if (n > arr.length) return false;

        var arr = arr;
        var newarr = [];
        for (let i = 0; i < n; i++) {
            var index = Math.floor(Math.random() * arr.length);//生成一个随机索引
            newarr.push(arr.splice(index, 1)[0]);
        }
        return newarr;

    },

    //字符串去空格,正则 \s 匹配空白字符，包括空格，tab字符和换行符
    strTrim: function (str) {
        return str.replace(/\s+/g, "");
    },
    //递归求和
    recurSum: function (unm) {
        if (unm <= 1) return unm;
        return unm * this.recurSum(unm - 1);
    },
    //找数组中最大值
    getArrmain: function (arr) {

        return Math.max.apply(Math, arr);
    },
    //找数组中最小的值
    getArrmin: function (arr) {

        return Math.min.apply(Math, arr);
    },
    //数组倒置元素；reverse()
    reverseArr: function (arr) {
        return arr.reverse();
    },
    //时间格式化：dataFormat(时间，时间的显示的格式)
    //如 (new Date(),yyyy-MM-dd)//2017-6-28
    //如 (new Date(),yyyy-MM-dd hh:mm:ss)//2017-6-28 15:02:30
    dataFormat: function (date, format ="yyyy-MM-dd") {//参数一:时间，参数，要显示的时间格式
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
    recurOne: function (data=[], id = "id", pid = "pid", pidnum = 0, leve = 1) {//关联值 id and tid  = 0(定级)
        if (Object.prototype.toString.call(data) !== '[object Array]') return data;
        var arr = [];
        var $this = this;
        data.forEach(function (itme, index) {
            if (itme[pid] == pidnum) {
                itme['leve'] = leve;
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
    filterChrildId: function (data=[], id = "id", pid = "pid", idNum = 0) {//默认没有子集，返回空数组
        if (!idNum || idNum == 0) return [];
        var arrId = [];
        if (Object.prototype.toString.call(data) !== '[object Array]') return [];
        data.forEach(ele => {
            if (ele[pid] == idNum) {
                arrId.push(ele[id]);
                arrId = arrId.concat(this.filterChrildId(data, id, pid, ele[id]))
            }
        });
        return arrId;

    },
    deepCopy:function(obj){//对象拷贝：深拷贝
        if (typeof obj !="object") return obj;
        var newObj = new Object();
        var $this = this;
        for(var i in obj){
             newObj[i] = $this.deepCopy(obj[1])
        }
        return newObj
        
    },
    replaceTag:function(str){//替换字符串中的html标签
        if(typeof str !="string") return str
        var reg = /<[^>]*>|<\/[^>]*>/gmi; 
        return str.replace(reg,"")
    },
    isMobile:function(){
        var ua = navigator.userAgent;
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            isAndroid = ua.match(/(Android)\s+([\d.]+)/),
            isMobile = isIphone || isAndroid;
        return isMobile;
    }
} 