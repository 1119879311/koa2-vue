/*
Navicat MySQL Data Transfer

Source Server         : FFS
Source Server Version : 50549
Source Host           : localhost:3306
Source Database       : thinkjs

Target Server Type    : MYSQL
Target Server Version : 50549
File Encoding         : 65001

Date: 2019-06-17 22:48:15
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `tk_article`
-- ----------------------------
DROP TABLE IF EXISTS `tk_article`;
CREATE TABLE `tk_article` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `title` varchar(48) NOT NULL DEFAULT '' COMMENT '标题',
  `content` text NOT NULL COMMENT '内容',
  `cid` int(11) NOT NULL COMMENT '分类所属id',
  `thumimg` varchar(255) NOT NULL DEFAULT '' COMMENT '缩略图地址',
  `remark` text NOT NULL COMMENT '摘要',
  `readcount` int(48) NOT NULL DEFAULT '100' COMMENT '阅读数',
  `sort` int(11) DEFAULT '10' COMMENT '排序',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '状态',
  `createtime` varchar(48) NOT NULL DEFAULT '' COMMENT '发送时间',
  PRIMARY KEY (`id`),
  KEY `cid` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_article
-- ----------------------------
INSERT INTO `tk_article` VALUES ('4', 'nodejs pm2进', '<p><br></p><pre><code>安装pm<br><br></code><p><code> npm install pm2 -g或者npm我-g pm2</code></p><code><span style=\"font-weight: normal;\"></span><br>pm2基本命令<br><br>pm2 start app.js //＃用pm2启动应用app.js（应用入口文件）<br><br>pm2 list //＃显示所有进程状态<br><br>pm2 monit //＃监视所有进程<br><br>pm2 logs //＃显示所有进程日志<br><br>pm2 stop all //＃停止所有进程<br><br>pm2 restart all //＃重启所有进程 、、。。<br><br>pm2 reload</code></pre><p><br></p><p><br></p>', '5', '/upload/thum/201904/1554642443625.jpg', '今天天气很好，是真的很好，是真的很好，是真的很好。。。。。。', '168', '10', '1', '1550829308586');
INSERT INTO `tk_article` VALUES ('8', 'javascript 的数据结构之栈与队列', '<ol><li><p></p><h2><span style=\"font-weight: bold;\">1. 栈：</span> </h2><h4>				概述：栈是一种遵循后进先出（lifo）原则的有序集合新添加的或呆删除的元素都保存的栈的一端，称为栈顶，另一端为栈低，旧的数据都在栈低</h4><h4>				特点 ： (1)后进先出 (2) 有序集合<br>			 栈的实现：<br>			 主要有几个方法</h4><p></p></li><li><span style=\"font-weight: bold;\">(1).push():添加一个或几个的元素在栈顶，<br></span></li><li><span style=\"font-weight: bold;\">(2).pop():移除并返回栈顶元素<br></span></li><li><span style=\"font-weight: bold;\">(3).peek():返回栈顶元素，不对栈做修改<br></span></li><li><span style=\"font-weight: bold;\">(4).size():返回栈个数<br></span></li><li><span style=\"font-weight: bold;\">(5).clear()：清空栈<br></span></li><li><span style=\"font-weight: bold;\">(6).isempty()：栈是否为空</span><br></li></ol><div><pre><code>class stack{<br>	//构造函数<br>	constructor(){<br>		//存储数据<br>		this.itmes=[];<br>	}<br>	//向栈顶加入一个元素<br>	push(itme){<br>		this.itmes.push(itme)<br>	}<br>	//移除栈顶元素 (修改栈数据)<br>	pop(){<br>		return this.itmes.pop()<br>	}<br>	//返回栈顶元素 (不修改栈数据)<br>	peek(){<br>		return this.itmes[this.itmes.length-1]<br>	}<br>	//返回栈个数<br>	size(){<br>		return this.itmes.length;<br>	}<br>	//清空栈<br>	clear(){<br>		this.itmes = [];<br>	}<br>	//栈是否为空<br>	isempty(){<br>		return !this.itmes.length<br>	}<br>}</code></pre><p><br></p><p></p><h3>&nbsp; &nbsp;1.2 栈的应用：</h3><h4>&nbsp; &nbsp;1.2.1:十进制转任意进制&nbsp;</h4><div><p>&nbsp; &nbsp;分析：将目标值除以进制基数，得到的取整数值作为新的目标值，记录下余数值，一直 到目标值小于0,最后将记录下的所有余数值倒序组合。利用栈，记录值余数进栈，组合时出栈<br><br></p></div><p></p><pre><code>function transforbinary(data,base){<br>	if(!data) return <br>	var stacks = new stack();<br>	while(data&gt;0){<br>		stacks.push(data%base);//除以进制的余数（进栈）;<br>		data = math.floor(data/base );<br>	}<br>	var distct = \"0123456789abcdef\";<br>	var res = [];<br>	while(!stacks.isempty()){<br>		res.push(distct[stacks.pop()]);<span style=\"font-family: arial, helvetica, sans-serif;\">//组合时（出栈）;</span><br>	}<br>	return res.join(\"\");<br>}<br>console.log(transforbinary(100, 2));//1100100<br>console.log(transforbinary(100, 8));//144<br>console.log(transforbinary(100, 16));//64</code></pre><div><p><br></p></div><p></p><div><br></div><p></p></div><p></p><h3></h3>', '2', '/upload/thum/201904/1554641683325.jpg', '栈：遵循后进后出 原则的有序集合，新添加的或呆删除的元素都保存的栈的一端，称为栈顶，另一端为栈低', '245', '10', '1', '1550829308586');
INSERT INTO `tk_article` VALUES ('10', '前端项目的常用的工具类方法小总结', '<p><br></p><p><br></p><pre><code>//数组去重<br>    reaptarr: function (arr) {<br>        //方法一，利用set对象,元素唯一性<br>        if (new set()) return [...new set(arr)]<br><br>        //方法二:利用对象，属性不重复性<br>        let obj = {};<br>        let newarr = [];<br>        for (let i = 0; i &lt; arr.length; i++) {<br>            if (!obj[arr[i]]) {<br>                obj[arr[i]] = true;<br>                newarr.push(arr[i]);<br>            }<br>        }<br>        return newarr;<br>        //方法三：利用indexof 查看元素是否存在于数组中,如果不存在返回-1<br>        for (var j = 0; j &lt; arr.length; j++) {<br>            if (newarr.indexof(arr[j] == -1)) {<br>                newarr.push(arr[j]);<br>            }<br>        }<br>        return newarr;<br><br><br>    },<br><br>    //十六进制颜色随机生成<br>    randomcolor: function () {<br>        var colorstr = \"0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f\";<br>        var colorarr = colorstr.split(\",\");<br>        var color = \"#\";<br>        for (let i = 0; i &lt; 6; i++) {<br>            color += colorarr[math.floor(math.random() * 16)];<br>        }<br>        return color;<br>    },<br><br>    //统计一段字符串中数字或字母出现次数最多,利用对象形式<br>    morecount: function (str) {<br>        if (typeof str != \"string\" || str.length &lt; 0) return str;<br>        let obj = {};<br>        //利用charat(index),把字符串分隔<br>        for (var i = 0; i &lt; str.length; i++) {<br>            var val = str.charat(i);<br>            if (obj[val]) {<br>                obj[val] = obj[val] + 1;<br>            } else {<br>                obj[val] = 1<br>            }<br>        }<br><br>        //找出对象中最大的值<br>        let max = 0;<br>        for (let i in obj) {<br>            if (max &lt; obj[i]) max = obj[i];<br>        }<br>        var newobj = {};<br>        for (let i in obj) {<br>            if (obj[i] == max) {<br>                newobj[i] = obj[i]<br>            }<br>        }<br>        return newobj;<br><br>    },<br>    //随机返回指定数组中的n个不重复的数<br>    randomval: function (arr, n) {<br>        // 随机生成一个范围内的索引;<br>        if (arr.length == 1) return arr;<br>        if (n &gt; arr.length) return false;<br><br>        var arr = arr;<br>        var newarr = [];<br>        for (let i = 0; i &lt; n; i++) {<br>            var index = math.floor(math.random() * arr.length);//生成一个随机索引<br>            newarr.push(arr.splice(index, 1)[0]);<br>        }<br>        return newarr;<br><br>    },<br><br>    //字符串去空格,正则 \\s 匹配空白字符，包括空格，tab字符和换行符<br>    strtrim: function (str) {<br>        return str.replace(/\\s+/g, \"\");<br>    },<br>    //递归求和<br>    recursum: function (unm) {<br>        if (unm &lt;= 1) return unm;<br>        return unm * this.recursum(unm - 1);<br>    },<br>    //找数组中最大值<br>    getarrmain: function (arr) {<br><br>        return math.max.apply(math, arr);<br>    },<br>    //找数组中最小的值<br>    getarrmin: function (arr) {<br><br>        return math.min.apply(math, arr);<br>    },<br>    //数组倒置元素；reverse()<br>    reversearr: function (arr) {<br>        return arr.reverse();<br>    },<br>    //时间格式化：dataformat(时间，时间的显示的格式)<br>    //如 (new date(),yyyy-mm-dd)//2017-6-28<br>    //如 (new date(),yyyy-mm-dd hh:mm:ss)//2017-6-28 15:02:30<br>    dataformat: function (date, format =\"yyyy-mm-dd\") {//参数一:时间，参数，要显示的时间格式<br>        if (object.prototype.tostring.call(date) != \"[object date]\") return false;<br><br>        var o = {<br>            \"m+\": date.getmonth() + 1,                 //月份 <br>            \"d+\": date.getdate(),                    //日 <br>            \"h+\": date.gethours(),                   //小时 <br>            \"m+\": date.getminutes(),                 //分 <br>            \"s+\": date.getseconds(),                 //秒 <br>            \"q+\": math.floor((date.getmonth() + 3) / 3), //季度 <br>            \"s\": date.getmilliseconds()             //毫秒 <br>        };<br>        if (/(y+)/.test(format)) {<br>            format = format.replace(regexp.$1, (date.getfullyear() + \"\").substr(4 - regexp.$1.length));<br>        }<br>        for (var k in o) {<br>            if (new regexp(\"(\" + k + \")\").test(format)) {<br>                format = format.replace(regexp.$1, (regexp.$1.length == 1) ? (o[k]) : ((\"00\" + o[k]).substr((\"\" + o[k]).length)));<br>            }<br>        }<br>        return format;<br>    },<br>    //递归对象， 实现一维数据结构<br>    recurone: function (data=[], id = \"id\", pid = \"pid\", pidnum = 0, leve = 1) {//关联值 id and tid  = 0(定级)<br>        if (object.prototype.tostring.call(data) !== \'[object array]\') return data;<br>        var arr = [];<br>        var $this = this;<br>        data.foreach(function (itme, index) {<br>            if (itme[pid] == pidnum) {<br>                itme[\'leve\'] = leve;<br>                arr.push(itme)<br>                arr = arr.concat($this.recurone(data, id, pid, itme[id], leve + 1));<br>            }<br>        })<br>        return arr<br>    },<br>    //递归 实现无限极树状结构<br>    recurmany: function (data = [], id = \"id\", pid = \"pid\", pidnum = 0, leve = 1) {<br>        if (object.prototype.tostring.call(data) !== \'[object array]\') return data;<br>        var result = new array();<br>        var $this = this;<br>        data.foreach(function (itme) {<br>            if (itme[pid] == pidnum) {<br>                itme[\"leve\"] = leve;<br>                itme[\"chrildren\"] = $this.recurmany(data, id, pid, itme[id], leve + 1);<br>                result.push(itme)<br>            }<br>        })<br>        return result<br>    },<br>    //递归找子集，返回一个数组(子集每一项的id)<br>    filterchrildid: function (data=[], id = \"id\", pid = \"pid\", idnum = 0) {//默认没有子集，返回空数组<br>        if (!idnum || idnum == 0) return [];<br>        var arrid = [];<br>        if (object.prototype.tostring.call(data) !== \'[object array]\') return [];<br>        data.foreach(ele =&gt; {<br>            if (ele[pid] == idnum) {<br>                arrid.push(ele[id]);<br>                arrid = arrid.concat(this.filterchrildid(data, id, pid, ele[id]))<br>            }<br>        });<br>        return arrid;<br><br>    },<br>    deepcopy:function(obj){//对象拷贝：深拷贝<br>        if (typeof obj !=\"object\") return obj;<br>        var newobj = new object();<br>        var $this = this;<br>        for(var i in obj){<br>             newobj[i] = $this.deepcopy(obj[1])<br>        }<br>        return newobj<br>        <br>    },<br>    replacetag:function(str){//替换字符串中的html标签<br>        if(typeof str !=\"string\") return str<br>        var reg = /&lt;[^&gt;]*&gt;|&lt;\\/[^&gt;]*&gt;/gmi; <br>        return str.replace(reg,\"\")<br>    },<br>    ismobile:function(){<br>        var ua = navigator.useragent;<br>        var ipad = ua.match(/(ipad).*os\\s([\\d_]+)/),<br>            isiphone = !ipad &amp;&amp; ua.match(/(iphone\\sos)\\s([\\d_]+)/),<br>            isandroid = ua.match(/(android)\\s+([\\d.]+)/),<br>            ismobile = isiphone || isandroid;<br>        return ismobile;<br>    }</code></pre><p><br></p>', '5', '/upload/thum/201904/1554640970988.jpg', '在前端开发中，一些我们日常需要用到一些常用方法，现在总结下有助于在开发中快速的应用到', '221', '10', '1', '1554542785041');
INSERT INTO `tk_article` VALUES ('11', 'url特殊字符转义', '<h2></h2><h3></h3><h4></h4><h4></h4><h5></h5><h5><ol><li><span style=\"font-size: large;\">1. url特殊字符需转义&nbsp; </span><span style=\"font-weight: normal;\">&nbsp;</span></li></ol></h5><ol><li><pre><code>（1）、空格换成加号(+)   <br>（2）、正斜杠(/)分隔目录和子目录   <br>（3）、问号(?)分隔url和查询   <br>（4）、百分号(%)制定特殊字符   <br>（5）、#号指定书签   <br>（6）、&amp;号分隔参数</code></pre><p><br></p></li><li><br></li></ol><h2></h2><h5><ol><li><span style=\"font-size: large;\">2. url转义字符原理：</span>&nbsp;&nbsp;</li></ol><p></p><ol><li><span style=\"font-size: medium;\"><span style=\"font-weight: normal;\">将这些特殊的字符转换成ascii码，格式为：%加字符的ascii码，即一个百分号%，后面跟对应字符的ascii（16进制）码值。例如 空格的编码值是\"%20\"。</span>&nbsp;&nbsp;</span></li><li><br></li><li><span style=\"font-size: large;\">3.url特殊符号及对应的十六进制值编码</span><br></li></ol></h5><p></p><ol><li><pre><code>（1）. +  url 中+号表示空格 %2b   <br>（2）. 空格 url中的空格可以用+号或者编码 %20   <br>（3）. /  分隔目录和子目录 %2f    <br>（4.） ?  分隔实际的 url 和参数 %3f    <br>（5）. % 指定特殊字符 %25    <br>（6）. # 表示书签 %23    <br>（7）. &amp; url 中指定的参数间的分隔符 %26    <br>（8）. = url 中指定参数的值 %3d</code></pre><p><br></p></li></ol><p></p><div><span style=\"font-size: medium;\"><br></span></div><p></p><div></div>', '5', '', 'url特殊字符转义及解决方法,有时候我们会传值给后台，会发现后台并不能获取能完整的参数，是因为我们用来了特殊字符,这个时候我们就需要对这些特殊字符转义', '120', '10', '1', '1558411571868');

-- ----------------------------
-- Table structure for `tk_auth`
-- ----------------------------
DROP TABLE IF EXISTS `tk_auth`;
CREATE TABLE `tk_auth` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '权限id',
  `name` varchar(255) NOT NULL COMMENT '权限名称',
  `identName` varchar(48) NOT NULL DEFAULT '' COMMENT 'url 的唯一标识',
  `url` varchar(255) NOT NULL COMMENT '链接地址',
  `groupName` varchar(255) NOT NULL DEFAULT '默认分组' COMMENT '分组默认',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '状态 0 | 1',
  `createtime` varchar(255) NOT NULL COMMENT '创建时间',
  `updatetime` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `g_id` (`groupName`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_auth
-- ----------------------------
INSERT INTO `tk_auth` VALUES ('2', '添加行为', 'authadd', '/api/auth/add/', '权限管理', '1', '1537617221727', '1552642961325');
INSERT INTO `tk_auth` VALUES ('3', '添加用户', 'useradd', '/api/manager/add/', '用户管理', '1', '1543750294204', '1552643698232');
INSERT INTO `tk_auth` VALUES ('4', '编辑用户', 'useredit', '/api/manager/update/', '用户管理', '1', '1543750491972', '1552644382391');
INSERT INTO `tk_auth` VALUES ('5', '编辑行为', 'authedit', '/api//auth/update/', '权限管理', '1', '1546425096159', '1552644390960');
INSERT INTO `tk_auth` VALUES ('6', '查看用户', 'userlook', '/api/manager/', '用户管理', '1', '1552139016730', '1552643687345');
INSERT INTO `tk_auth` VALUES ('7', '删除用户', 'userdel', '/api/manager/delete/', '用户管理', '1', '1552204293747', '1552643676600');
INSERT INTO `tk_auth` VALUES ('8', '查看行为', 'authlook', '/api/auth/', '权限管理', '1', '1552643413156', '1552643775508');
INSERT INTO `tk_auth` VALUES ('9', '开启禁用用户', 'userswtich', '/api/manager/swtich/', '用户管理', '1', '1552643569431', '1552643727627');
INSERT INTO `tk_auth` VALUES ('10', '开启或禁用行为', 'authswtich', '/api/auth/swtich/', '权限管理', '1', '1552643848177', '1552643913513');
INSERT INTO `tk_auth` VALUES ('11', '删除行为', 'authdel', '/api/auth/delete/', '权限管理', '1', '1552643994191', '1552643994191');
INSERT INTO `tk_auth` VALUES ('12', '查看角色', 'rolelook', '/api/role/', '角色管理', '1', '1552644098145', '1552644098145');
INSERT INTO `tk_auth` VALUES ('13', '添加角色', 'roleadd', '/api/role/add/', '角色管理', '1', '1552644267022', '1552644267022');
INSERT INTO `tk_auth` VALUES ('14', '编辑角色', 'roleedit', '/api/role/update/', '角色管理', '1', '1552644374457', '1552644374457');
INSERT INTO `tk_auth` VALUES ('15', '删除角色', 'roledel', '/api/role/delete/', '角色管理', '1', '1552644459926', '1552644459926');
INSERT INTO `tk_auth` VALUES ('16', '开启禁用角色', 'rolesswtich', '/api/role/swtich/', '角色管理', '1', '1552644515220', '1552644541190');
INSERT INTO `tk_auth` VALUES ('17', '分配权限', 'assginauth', '/api/role/assginauth/', '角色管理', '1', '1552644616464', '1556608929041');
INSERT INTO `tk_auth` VALUES ('18', '分配角色', 'assginrole', '/api/manager/assginrole/', '用户管理', '1', '1552644663665', '1552644663665');
INSERT INTO `tk_auth` VALUES ('19', '添加帖子', 'artcleadd', '/api/post/add/', '帖子管理', '1', '1552644868873', '1552644868873');
INSERT INTO `tk_auth` VALUES ('20', '删除帖子', 'articledel', '/api/post/delete/', '帖子管理', '1', '1552644935138', '1552644935138');
INSERT INTO `tk_auth` VALUES ('21', '编辑帖子', 'artcleedit', '/api/post/update/', '帖子管理', '1', '1552645197945', '1552645197945');
INSERT INTO `tk_auth` VALUES ('22', '上传帖子缩略图', 'uploadthum', '/api/post/uploadThum/', '帖子管理', '1', '1552645470098', '1552645470098');
INSERT INTO `tk_auth` VALUES ('23', '上传帖子图片', 'uploadueimg', '/api/post/uploadueimg', '帖子管理', '1', '1552645525404', '1552645525404');
INSERT INTO `tk_auth` VALUES ('24', '添加帖子分类', 'blogcate', '/api/cate/add/', '分类管理', '1', '1552645636851', '1552908718719');
INSERT INTO `tk_auth` VALUES ('25', '编辑分类', 'cateedit', '/api/cate/update/', '分类管理', '1', '1552909095974', '1552909095974');
INSERT INTO `tk_auth` VALUES ('26', '开启或禁用分类', 'cateswtich', '/api/cate/swtich/', '分类管理', '1', '1552909142378', '1552909169623');
INSERT INTO `tk_auth` VALUES ('27', '删除分类', 'catedel', '/api/cate/delete/', '分类管理', '1', '1552909205927', '1552909205927');
INSERT INTO `tk_auth` VALUES ('28', '添加标签', 'tabadd', '/ap/tab/add/', '标签管理', '1', '1552909446806', '1552909446806');
INSERT INTO `tk_auth` VALUES ('29', '编辑标签', 'tabedit', '/ap/tab/update/', '标签管理', '1', '1552909494832', '1552909494832');
INSERT INTO `tk_auth` VALUES ('30', '开启或禁用标签', 'tabswtich', '/ap/tab/swtich/', '标签管理', '1', '1552909537219', '1552909537219');
INSERT INTO `tk_auth` VALUES ('31', '删除标签', 'tabdel', '/api/tab/delete/', '标签管理', '1', '1552909583296', '1552909583296');

-- ----------------------------
-- Table structure for `tk_auth_muen`
-- ----------------------------
DROP TABLE IF EXISTS `tk_auth_muen`;
CREATE TABLE `tk_auth_muen` (
  `id` int(48) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '''''',
  `title` varchar(48) NOT NULL DEFAULT '''''',
  `componed` varchar(48) NOT NULL DEFAULT '''''',
  `url` varchar(255) NOT NULL DEFAULT '''''',
  `is_muen` smallint(1) NOT NULL DEFAULT '2',
  `is_state` smallint(1) NOT NULL DEFAULT '1' COMMENT '1默认开启，2 ，禁止',
  `parent_id` int(48) NOT NULL DEFAULT '0' COMMENT '0没有父级',
  `create_time` varchar(48) NOT NULL DEFAULT '''''',
  `update_time` varchar(48) NOT NULL DEFAULT '''''',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_auth_muen
-- ----------------------------

-- ----------------------------
-- Table structure for `tk_cate`
-- ----------------------------
DROP TABLE IF EXISTS `tk_cate`;
CREATE TABLE `tk_cate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `pid` tinyint(4) NOT NULL DEFAULT '0',
  `sort` int(48) NOT NULL DEFAULT '100',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '状态',
  `createtime` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_cate
-- ----------------------------
INSERT INTO `tk_cate` VALUES ('1', 'AI', '0', '100', '1', '1550829308586');
INSERT INTO `tk_cate` VALUES ('2', '前端', '0', '100', '1', '1550829308586');
INSERT INTO `tk_cate` VALUES ('3', '后台', '0', '100', '1', '1550829308586');
INSERT INTO `tk_cate` VALUES ('4', '数据库', '0', '100', '1', '1550829308586');
INSERT INTO `tk_cate` VALUES ('5', 'javascript', '2', '100', '1', '1550829308586');
INSERT INTO `tk_cate` VALUES ('6', 'HTML', '2', '100', '1', '1550829308586');
INSERT INTO `tk_cate` VALUES ('9', 'php', '3', '100', '1', '1560477784827');

-- ----------------------------
-- Table structure for `tk_menu`
-- ----------------------------
DROP TABLE IF EXISTS `tk_menu`;
CREATE TABLE `tk_menu` (
  ` id` int(11) NOT NULL AUTO_INCREMENT COMMENT '菜单id',
  `name` varchar(255) NOT NULL COMMENT '菜单名称',
  `url` varchar(255) DEFAULT NULL,
  `decaletion` varchar(255) DEFAULT '' COMMENT '菜单描述',
  `conpent` varchar(255) DEFAULT NULL COMMENT '（前端的一个标识：比如组件名称）',
  `pid` int(11) NOT NULL DEFAULT '0' COMMENT '菜单所属父级，0为顶级',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '菜单是否开启状态，1为开启',
  `sort` int(11) NOT NULL DEFAULT '100' COMMENT '排序',
  `create_time` varchar(255) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (` id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_menu
-- ----------------------------
INSERT INTO `tk_menu` VALUES ('1', '菜单管理', '', '菜单管理', '', '0', '1', '100', '1534082222');

-- ----------------------------
-- Table structure for `tk_menu_role`
-- ----------------------------
DROP TABLE IF EXISTS `tk_menu_role`;
CREATE TABLE `tk_menu_role` (
  `m_id` int(11) NOT NULL COMMENT '菜单id',
  `r_id` int(11) NOT NULL COMMENT '角色id',
  KEY `m_id` (`m_id`),
  KEY `r_id` (`r_id`),
  CONSTRAINT `tk_menu_role_ibfk_1` FOREIGN KEY (`m_id`) REFERENCES `tk_menu` (` id`),
  CONSTRAINT `tk_menu_role_ibfk_2` FOREIGN KEY (`r_id`) REFERENCES `tk_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_menu_role
-- ----------------------------

-- ----------------------------
-- Table structure for `tk_role`
-- ----------------------------
DROP TABLE IF EXISTS `tk_role`;
CREATE TABLE `tk_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色id',
  `name` varchar(255) NOT NULL COMMENT '角色名称（英文） admin,eduit',
  `title` varchar(255) NOT NULL COMMENT '角色描述（中文） 超级管理员，普通编辑',
  `pid` int(11) NOT NULL COMMENT '角色的父级id (所属)',
  `sort` int(11) NOT NULL DEFAULT '100' COMMENT '排序',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '状态 0 | 1',
  `createtime` varchar(255) NOT NULL COMMENT '创建时间',
  `updatetime` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_role
-- ----------------------------
INSERT INTO `tk_role` VALUES ('1', 'superAdmin', '超级管理员', '0', '100', '2', '1552133878049', '1552133878049');
INSERT INTO `tk_role` VALUES ('8', 'admin-look', '管理员阅览 ', '1', '100', '2', '1552138664960', '1553873175287');
INSERT INTO `tk_role` VALUES ('9', 'del', '删除', '1', '100', '2', '1552204633328', '1552204633328');
INSERT INTO `tk_role` VALUES ('10', 'ordinary-look', '普通查看', '1', '100', '1', '1553873242362', '1553873242362');

-- ----------------------------
-- Table structure for `tk_role_auth`
-- ----------------------------
DROP TABLE IF EXISTS `tk_role_auth`;
CREATE TABLE `tk_role_auth` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `r_id` int(11) NOT NULL COMMENT '角色id',
  `a_id` int(11) NOT NULL COMMENT '权限 id',
  PRIMARY KEY (`id`),
  KEY `r_id` (`r_id`),
  KEY `a_id` (`a_id`),
  CONSTRAINT `tk_role_auth_ibfk_1` FOREIGN KEY (`r_id`) REFERENCES `tk_role` (`id`),
  CONSTRAINT `tk_role_auth_ibfk_2` FOREIGN KEY (`a_id`) REFERENCES `tk_auth` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_role_auth
-- ----------------------------
INSERT INTO `tk_role_auth` VALUES ('131', '8', '12');
INSERT INTO `tk_role_auth` VALUES ('132', '8', '6');
INSERT INTO `tk_role_auth` VALUES ('133', '8', '8');
INSERT INTO `tk_role_auth` VALUES ('134', '1', '2');
INSERT INTO `tk_role_auth` VALUES ('135', '1', '3');
INSERT INTO `tk_role_auth` VALUES ('136', '1', '4');
INSERT INTO `tk_role_auth` VALUES ('137', '1', '5');
INSERT INTO `tk_role_auth` VALUES ('138', '1', '6');
INSERT INTO `tk_role_auth` VALUES ('139', '1', '7');
INSERT INTO `tk_role_auth` VALUES ('140', '1', '8');
INSERT INTO `tk_role_auth` VALUES ('141', '1', '9');
INSERT INTO `tk_role_auth` VALUES ('142', '1', '10');
INSERT INTO `tk_role_auth` VALUES ('143', '1', '11');
INSERT INTO `tk_role_auth` VALUES ('144', '1', '12');
INSERT INTO `tk_role_auth` VALUES ('145', '1', '13');
INSERT INTO `tk_role_auth` VALUES ('146', '1', '14');
INSERT INTO `tk_role_auth` VALUES ('147', '1', '15');
INSERT INTO `tk_role_auth` VALUES ('148', '1', '16');
INSERT INTO `tk_role_auth` VALUES ('149', '1', '17');
INSERT INTO `tk_role_auth` VALUES ('150', '1', '18');
INSERT INTO `tk_role_auth` VALUES ('151', '1', '19');
INSERT INTO `tk_role_auth` VALUES ('152', '1', '20');
INSERT INTO `tk_role_auth` VALUES ('153', '1', '21');
INSERT INTO `tk_role_auth` VALUES ('154', '1', '22');
INSERT INTO `tk_role_auth` VALUES ('155', '1', '23');
INSERT INTO `tk_role_auth` VALUES ('156', '1', '24');
INSERT INTO `tk_role_auth` VALUES ('157', '1', '25');
INSERT INTO `tk_role_auth` VALUES ('158', '1', '26');
INSERT INTO `tk_role_auth` VALUES ('159', '1', '27');
INSERT INTO `tk_role_auth` VALUES ('160', '1', '28');
INSERT INTO `tk_role_auth` VALUES ('161', '1', '29');
INSERT INTO `tk_role_auth` VALUES ('162', '1', '30');
INSERT INTO `tk_role_auth` VALUES ('163', '1', '31');

-- ----------------------------
-- Table structure for `tk_tab`
-- ----------------------------
DROP TABLE IF EXISTS `tk_tab`;
CREATE TABLE `tk_tab` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '状态1-开启；0停用',
  `createtime` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_tab
-- ----------------------------
INSERT INTO `tk_tab` VALUES ('1', '诗意', '1', '1550829308586');
INSERT INTO `tk_tab` VALUES ('2', '音乐', '1', '1550829308586');
INSERT INTO `tk_tab` VALUES ('5', '视频', '1', '1554474456422');

-- ----------------------------
-- Table structure for `tk_tab_article`
-- ----------------------------
DROP TABLE IF EXISTS `tk_tab_article`;
CREATE TABLE `tk_tab_article` (
  `t_id` int(11) NOT NULL,
  `a_id` int(11) NOT NULL,
  KEY `tk_cate_tab_ibfk_2` (`a_id`) USING BTREE,
  KEY `t_id` (`t_id`),
  CONSTRAINT `tk_tab_article_ibfk_1` FOREIGN KEY (`a_id`) REFERENCES `tk_article` (`id`),
  CONSTRAINT `tk_tab_article_ibfk_2` FOREIGN KEY (`t_id`) REFERENCES `tk_tab` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_tab_article
-- ----------------------------
INSERT INTO `tk_tab_article` VALUES ('2', '10');
INSERT INTO `tk_tab_article` VALUES ('5', '4');
INSERT INTO `tk_tab_article` VALUES ('1', '8');

-- ----------------------------
-- Table structure for `tk_user`
-- ----------------------------
DROP TABLE IF EXISTS `tk_user`;
CREATE TABLE `tk_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `contact` varchar(255) NOT NULL COMMENT '联系方式 ，ipone|eamil',
  `isRoot` smallint(12) NOT NULL DEFAULT '2' COMMENT '是否是超级用户管理，1是，2不是',
  `token` varchar(255) NOT NULL COMMENT '认证token',
  `status` int(12) NOT NULL DEFAULT '1' COMMENT '状态 0 | 1',
  `createtime` varchar(255) NOT NULL COMMENT '创建时间',
  `updatatime` varchar(255) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_user
-- ----------------------------
INSERT INTO `tk_user` VALUES ('5', 'root', '97d00e89e13d4c5516677f8d27f267ae', '1119879311@qq.com', '1', 'smgrpc_jott54xmqzb-hdwbgqk1s1iiyrkb_hqe9dc1dtbpc1552133737892', '1', '1552133737892', '1552133737892');
INSERT INTO `tk_user` VALUES ('6', 'test1', 'ab2bd7064e3329b31c6d2de27cbd1604', '123456@qq.com', '2', 'dm8f_cl-epotmquea3x6a2t2-mokftmeladbi-abxmphalm71552133878049', '1', '1552133878049', '1552133878049');

-- ----------------------------
-- Table structure for `tk_user_role`
-- ----------------------------
DROP TABLE IF EXISTS `tk_user_role`;
CREATE TABLE `tk_user_role` (
  `u_id` int(11) NOT NULL COMMENT '用户 id',
  `r_id` int(11) NOT NULL COMMENT '角色id',
  KEY `u_id` (`u_id`),
  KEY `r_id` (`r_id`),
  CONSTRAINT `tk_user_role_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `tk_user` (`id`),
  CONSTRAINT `tk_user_role_ibfk_2` FOREIGN KEY (`r_id`) REFERENCES `tk_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_user_role
-- ----------------------------
INSERT INTO `tk_user_role` VALUES ('6', '10');
