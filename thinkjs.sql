/*
Navicat MySQL Data Transfer

Source Server         : root
Source Server Version : 50617
Source Host           : localhost:3306
Source Database       : thinkjs

Target Server Type    : MYSQL
Target Server Version : 50617
File Encoding         : 65001

Date: 2019-03-19 19:03:23
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
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '状态',
  `createtime` varchar(48) NOT NULL DEFAULT '' COMMENT '发送时间',
  PRIMARY KEY (`id`),
  KEY `cid` (`cid`),
  CONSTRAINT `tk_article_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `tk_cate` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_article
-- ----------------------------
INSERT INTO `tk_article` VALUES ('4', 'nodejs pm2进', '<p>&lt;h4&gt;安装pm2&lt;/h4&gt;&lt;p&gt;&nbsp;npm install pm2 -g或者npm我-g pm2&nbsp;&lt;/p&gt;&lt;h4&gt;pm2基本命令&lt;/h4&gt;&lt;pre&gt;&lt;code&gt;pm2 start app.js //＃用pm2启动应用app.js（应用入口文件）<br>pm2 list //＃显示所有进程状态<br>pm2 monit //＃监视所有进程<br>pm2 logs //＃显示所有进程日志<br>pm2 stop all //＃停止所有进程<br>pm2 restart all //＃重启所有进程 、、。。<br>pm2 reload <br>&lt;/code&gt;&lt;/pre&gt;</p>', '5', '/upload/thum/20190220/1550628745603.jpg', '今天天气很好，是真的很好，是真的很好，是真的很好。。。。。。', '104', '1', '1550829308586');
INSERT INTO `tk_article` VALUES ('5', '辅导费', '收到<p><img src=\"http://w3.unescn.com/static/images/index/banner1.jpg\" style=\"max-width:100%;\"><br></p>', '5', '/upload/thum/20190219/1550555600929.jpg', '覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖覆盖', '102', '1', '1550829308586');
INSERT INTO `tk_article` VALUES ('6', 'fgfgfg', 'fgfg<p><br></p>', '6', '/upload/thum/20190220/1550660214195.png', '今天天气很好，是真的很好，是真的很好，是真的很好。。。。。。', '101', '1', '1550829308586');
INSERT INTO `tk_article` VALUES ('7', 'ai', '<p><img src=\"upload/ueimg/20190215/1550227189920.jpg\" style=\"max-width:100%;\"><br></p><p>胜多负少的</p>', '1', '/upload/thum/20190221/1550716484534.jpg', '今天天气很好，是真的很好，是真的很好，是真的很好。。。。。。', '102', '1', '1550829308586');
INSERT INTO `tk_article` VALUES ('8', 'ais', '<p><img src=\"/upload/thum/20190219/1550552810900.jpg\" style=\"max-width:100%;\"><br></p><p>胜多负少的</p>', '1', '/upload/thum/20190222/1550825262101.jpg', '今天天气很好，是真的很好，是真的很好，是真的很好。。。。。。', '106', '1', '1550829308586');

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
INSERT INTO `tk_auth` VALUES ('2', '添加行为', 'authadd', '/api/rbac/auth/add/', '权限管理', '1', '1537617221727', '1552642961325');
INSERT INTO `tk_auth` VALUES ('3', '添加用户', 'useradd', '/api/rbac/user/add/', '用户管理', '1', '1543750294204', '1552643698232');
INSERT INTO `tk_auth` VALUES ('4', '编辑用户', 'useredit', '/api/rbac/user/update/', '用户管理', '1', '1543750491972', '1552644382391');
INSERT INTO `tk_auth` VALUES ('5', '编辑行为', 'authedit', '/api/rbac/auth/update/', '权限管理', '1', '1546425096159', '1552644390960');
INSERT INTO `tk_auth` VALUES ('6', '查看用户', 'userlook', '/api/rbac/user/', '用户管理', '1', '1552139016730', '1552643687345');
INSERT INTO `tk_auth` VALUES ('7', '删除用户', 'userdel', '/api/rbac/user/delete/', '用户管理', '1', '1552204293747', '1552643676600');
INSERT INTO `tk_auth` VALUES ('8', '查看行为', 'authlook', '/api/rbac/auth/', '权限管理', '1', '1552643413156', '1552643775508');
INSERT INTO `tk_auth` VALUES ('9', '开启禁用用户', 'userswtich', '/api/rbac/user/swtich/', '用户管理', '1', '1552643569431', '1552643727627');
INSERT INTO `tk_auth` VALUES ('10', '开启或禁用行为', 'authswtich', '/api/rbac/auth/swtich/', '权限管理', '1', '1552643848177', '1552643913513');
INSERT INTO `tk_auth` VALUES ('11', '删除行为', 'authdel', '/api/rbac/auth/delete/', '权限管理', '1', '1552643994191', '1552643994191');
INSERT INTO `tk_auth` VALUES ('12', '查看角色', 'rolelook', '/api/rbac/role/', '角色管理', '1', '1552644098145', '1552644098145');
INSERT INTO `tk_auth` VALUES ('13', '添加角色', 'roleadd', '/api/rbac/role/add/', '角色管理', '1', '1552644267022', '1552644267022');
INSERT INTO `tk_auth` VALUES ('14', '编辑角色', 'roleedit', '/api/rbac/role/update/', '角色管理', '1', '1552644374457', '1552644374457');
INSERT INTO `tk_auth` VALUES ('15', '删除角色', 'roledel', '/api/rbac/role/delete/', '角色管理', '1', '1552644459926', '1552644459926');
INSERT INTO `tk_auth` VALUES ('16', '开启禁用角色', 'rolesswtich', '/api/rbac/role/swtich/', '角色管理', '1', '1552644515220', '1552644541190');
INSERT INTO `tk_auth` VALUES ('17', '分配权限', 'assginauth', '/api/rbac/role/assginauth/', '角色管理', '1', '1552644616464', '1552644673955');
INSERT INTO `tk_auth` VALUES ('18', '分配角色', 'assginrole', '/api/rbac/user/assginrole/', '用户管理', '1', '1552644663665', '1552644663665');
INSERT INTO `tk_auth` VALUES ('19', '添加帖子', 'artcleadd', '/api/blog/artcle/add/', '帖子管理', '1', '1552644868873', '1552644868873');
INSERT INTO `tk_auth` VALUES ('20', '删除帖子', 'articledel', '/api/blog/artcle/delete/', '帖子管理', '1', '1552644935138', '1552644935138');
INSERT INTO `tk_auth` VALUES ('21', '编辑帖子', 'artcleedit', '/api/blog/artcle/update/', '帖子管理', '1', '1552645197945', '1552645197945');
INSERT INTO `tk_auth` VALUES ('22', '上传帖子缩略图', 'uploadthum', '/api/upload/thum/', '帖子管理', '1', '1552645470098', '1552645470098');
INSERT INTO `tk_auth` VALUES ('23', '上传帖子图片', 'uploadueimg', '/api/upload/ueimg/', '帖子管理', '1', '1552645525404', '1552645525404');
INSERT INTO `tk_auth` VALUES ('24', '添加帖子分类', 'blogcate', '/api/blog/cate/add/', '分类管理', '1', '1552645636851', '1552908718719');
INSERT INTO `tk_auth` VALUES ('25', '编辑分类', 'cateedit', '/api/blog/cate/update/', '分类管理', '1', '1552909095974', '1552909095974');
INSERT INTO `tk_auth` VALUES ('26', '开启或禁用分类', 'cateswtich', '/api/blog/cate/swtich/', '分类管理', '1', '1552909142378', '1552909169623');
INSERT INTO `tk_auth` VALUES ('27', '删除分类', 'catedel', '/api/blog/cate/delete/', '分类管理', '1', '1552909205927', '1552909205927');
INSERT INTO `tk_auth` VALUES ('28', '添加标签', 'tabadd', '/ap/blog/tab/add/', '标签管理', '1', '1552909446806', '1552909446806');
INSERT INTO `tk_auth` VALUES ('29', '编辑标签', 'tabedit', '/ap/blog/tab/update/', '标签管理', '1', '1552909494832', '1552909494832');
INSERT INTO `tk_auth` VALUES ('30', '开启或禁用标签', 'tabswtich', '/ap/blog/tab/swtich/', '标签管理', '1', '1552909537219', '1552909537219');
INSERT INTO `tk_auth` VALUES ('31', '删除标签', 'tabdel', '/api/blog/tab/delete/', '标签管理', '1', '1552909583296', '1552909583296');

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_cate
-- ----------------------------
INSERT INTO `tk_cate` VALUES ('1', 'AI', '0', '100', '1', '1550829308586');
INSERT INTO `tk_cate` VALUES ('2', '前端', '0', '100', '1', '1550829308586');
INSERT INTO `tk_cate` VALUES ('3', '后台', '0', '100', '1', '1550829308586');
INSERT INTO `tk_cate` VALUES ('4', '数据库', '0', '100', '1', '1550829308586');
INSERT INTO `tk_cate` VALUES ('5', 'javascript', '2', '100', '1', '1550829308586');
INSERT INTO `tk_cate` VALUES ('6', 'HTML', '2', '100', '1', '1550829308586');
INSERT INTO `tk_cate` VALUES ('8', 'php', '3', '100', '1', '1550829308586');

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_role
-- ----------------------------
INSERT INTO `tk_role` VALUES ('1', 'superAdmin', '超级管理员', '0', '100', '1', '1552133878049', '1552133878049');
INSERT INTO `tk_role` VALUES ('8', 'look', '阅览 ', '1', '100', '1', '1552138664960', '1552204611925');
INSERT INTO `tk_role` VALUES ('9', 'del', '删除', '1', '100', '1', '1552204633328', '1552204633328');

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
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_role_auth
-- ----------------------------
INSERT INTO `tk_role_auth` VALUES ('55', '8', '6');
INSERT INTO `tk_role_auth` VALUES ('56', '8', '17');
INSERT INTO `tk_role_auth` VALUES ('98', '1', '17');
INSERT INTO `tk_role_auth` VALUES ('99', '1', '16');
INSERT INTO `tk_role_auth` VALUES ('100', '1', '15');
INSERT INTO `tk_role_auth` VALUES ('101', '1', '14');
INSERT INTO `tk_role_auth` VALUES ('102', '1', '13');
INSERT INTO `tk_role_auth` VALUES ('103', '1', '12');
INSERT INTO `tk_role_auth` VALUES ('104', '1', '18');
INSERT INTO `tk_role_auth` VALUES ('105', '1', '9');
INSERT INTO `tk_role_auth` VALUES ('106', '1', '7');
INSERT INTO `tk_role_auth` VALUES ('107', '1', '6');
INSERT INTO `tk_role_auth` VALUES ('108', '1', '4');
INSERT INTO `tk_role_auth` VALUES ('109', '1', '3');
INSERT INTO `tk_role_auth` VALUES ('110', '1', '31');
INSERT INTO `tk_role_auth` VALUES ('111', '1', '30');
INSERT INTO `tk_role_auth` VALUES ('112', '1', '29');
INSERT INTO `tk_role_auth` VALUES ('113', '1', '28');
INSERT INTO `tk_role_auth` VALUES ('114', '1', '11');
INSERT INTO `tk_role_auth` VALUES ('115', '1', '10');
INSERT INTO `tk_role_auth` VALUES ('116', '1', '8');
INSERT INTO `tk_role_auth` VALUES ('117', '1', '5');
INSERT INTO `tk_role_auth` VALUES ('118', '1', '2');
INSERT INTO `tk_role_auth` VALUES ('119', '1', '23');
INSERT INTO `tk_role_auth` VALUES ('120', '1', '22');
INSERT INTO `tk_role_auth` VALUES ('121', '1', '21');
INSERT INTO `tk_role_auth` VALUES ('122', '1', '20');
INSERT INTO `tk_role_auth` VALUES ('123', '1', '19');
INSERT INTO `tk_role_auth` VALUES ('124', '1', '27');
INSERT INTO `tk_role_auth` VALUES ('125', '1', '26');
INSERT INTO `tk_role_auth` VALUES ('126', '1', '25');
INSERT INTO `tk_role_auth` VALUES ('127', '1', '24');

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_tab
-- ----------------------------
INSERT INTO `tk_tab` VALUES ('1', '诗意', '1', '1550829308586');
INSERT INTO `tk_tab` VALUES ('2', '音乐', '1', '1550829308586');
INSERT INTO `tk_tab` VALUES ('3', '美术', '1', '1550829308586');

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
INSERT INTO `tk_tab_article` VALUES ('1', '5');
<<<<<<< HEAD
INSERT INTO `tk_tab_article` VALUES ('1', '8');
INSERT INTO `tk_tab_article` VALUES ('2', '8');
INSERT INTO `tk_tab_article` VALUES ('1', '7');
INSERT INTO `tk_tab_article` VALUES ('2', '7');
INSERT INTO `tk_tab_article` VALUES ('1', '4');
INSERT INTO `tk_tab_article` VALUES ('2', '4');
=======
INSERT INTO `tk_tab_article` VALUES ('1', '4');
INSERT INTO `tk_tab_article` VALUES ('2', '4');
INSERT INTO `tk_tab_article` VALUES ('3', '4');
INSERT INTO `tk_tab_article` VALUES ('1', '7');
INSERT INTO `tk_tab_article` VALUES ('2', '7');
INSERT INTO `tk_tab_article` VALUES ('1', '8');
INSERT INTO `tk_tab_article` VALUES ('2', '8');
>>>>>>> 1c587a32720794c851f701e5bf832a642b1e9bd2

-- ----------------------------
-- Table structure for `tk_user`
-- ----------------------------
DROP TABLE IF EXISTS `tk_user`;
CREATE TABLE `tk_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `contact` varchar(255) NOT NULL COMMENT '联系方式 ，ipone|eamil',
  `isAdmin` smallint(12) NOT NULL DEFAULT '2' COMMENT '是否是超级用户管理，1是，2不是',
  `token` varchar(255) NOT NULL COMMENT '认证token',
  `status` int(12) NOT NULL DEFAULT '1' COMMENT '状态 0 | 1',
  `createtime` varchar(255) NOT NULL COMMENT '创建时间',
  `updatatime` varchar(255) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_user
-- ----------------------------
INSERT INTO `tk_user` VALUES ('5', 'root', '442ba7d1cca10b43b40b04329d477513', '1119879311@qq.com', '1', 'smgrpc_jott54xmqzb-hdwbgqk1s1iiyrkb_hqe9dc1dtbpc1552133737892', '1', '1552133737892', '1552133737892');
INSERT INTO `tk_user` VALUES ('6', 'test1', 'dc20efcafaba4148150c75c976d9b0a4', '123456@qq.com', '2', 'dm8f_cl-epotmquea3x6a2t2-mokftmeladbi-abxmphalm71552133878049', '1', '1552133878049', '1552133878049');
INSERT INTO `tk_user` VALUES ('9', 'test2', 'dc20efcafaba4148150c75c976d9b0a4', 'test2@qq.com', '2', 'v-ir7pfi9be3ybstoyojpty6v24wsxutsrhzffkgu5bkmtbl1552212036503', '1', '1552212036503', '1552212036503');

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
INSERT INTO `tk_user_role` VALUES ('6', '8');
INSERT INTO `tk_user_role` VALUES ('9', '1');
