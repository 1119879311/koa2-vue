/*
Navicat MySQL Data Transfer

Source Server         : FFS
Source Server Version : 50549
Source Host           : localhost:3306
Source Database       : thinkjs

Target Server Type    : MYSQL
Target Server Version : 50549
File Encoding         : 65001

Date: 2018-12-16 19:08:43
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_article
-- ----------------------------
INSERT INTO `tk_article` VALUES ('4', 'nodejs pm2进', '44545', '5', 'image/1523839487103.jpg', 'PM2.5', '100', '1', '1523946293467');
INSERT INTO `tk_article` VALUES ('5', '辅导费', '收到', '5', '', '覆盖', '100', '0', '13132');
INSERT INTO `tk_article` VALUES ('6', 'fgfgfg', 'fgfg', '6', 'fgfg', 'fgf', '100', '1', '1212');

-- ----------------------------
-- Table structure for `tk_auth`
-- ----------------------------
DROP TABLE IF EXISTS `tk_auth`;
CREATE TABLE `tk_auth` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '权限id',
  `name` varchar(255) NOT NULL COMMENT '权限名称',
  `url` varchar(255) NOT NULL COMMENT '链接地址',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '状态 0 | 1',
  `create_time` varchar(255) NOT NULL COMMENT '创建时间',
  `update_time` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_auth
-- ----------------------------
INSERT INTO `tk_auth` VALUES ('2', '添加行为', 'admin/auth/add', '1', '1537617221727', '1537617221727');
INSERT INTO `tk_auth` VALUES ('3', '添加用户', '/api/rbac/user/add', '1', '1543750294204', '1543750294204');
INSERT INTO `tk_auth` VALUES ('4', '编辑用户', '/api/rbac/user/edit', '1', '1543750491972', '1543750491972');

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
INSERT INTO `tk_cate` VALUES ('1', 'AI', '0', '100', '1', '');
INSERT INTO `tk_cate` VALUES ('2', '前端', '0', '100', '1', '');
INSERT INTO `tk_cate` VALUES ('3', '后台', '0', '100', '1', '');
INSERT INTO `tk_cate` VALUES ('4', '数据库', '0', '100', '1', '');
INSERT INTO `tk_cate` VALUES ('5', 'javascript', '2', '100', '1', '');
INSERT INTO `tk_cate` VALUES ('6', 'HTML', '2', '100', '1', '');
INSERT INTO `tk_cate` VALUES ('8', 'php', '3', '100', '1', '');

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
  `create_time` varchar(255) NOT NULL COMMENT '创建时间',
  `update_time` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_role
-- ----------------------------
INSERT INTO `tk_role` VALUES ('1', 'admin', '超级管理员', '0', '100', '1', '1534082222', '1534082222');
INSERT INTO `tk_role` VALUES ('2', 'edit', '普通编辑', '1', '100', '1', '1534082222', '1534082222');
INSERT INTO `tk_role` VALUES ('3', 'vip9', '会员9', '1', '100', '1', '1537610519287', '1537610519287');
INSERT INTO `tk_role` VALUES ('4', 'vip1', '会员1', '1', '100', '1', '1537608944162', '1537608944162');
INSERT INTO `tk_role` VALUES ('5', 'vip2', '会员2', '1', '100', '1', '1537609101765', '1537609101765');
INSERT INTO `tk_role` VALUES ('6', 'vip3', 'admin', '1', '100', '1', '1537623445597', '1537623445597');
INSERT INTO `tk_role` VALUES ('7', 'vip', '会员', '1', '100', '1', '1542447471987', '1542447471988');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_role_auth
-- ----------------------------
INSERT INTO `tk_role_auth` VALUES ('4', '6', '2');

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
INSERT INTO `tk_tab` VALUES ('1', '诗意', '1', '1313456465');
INSERT INTO `tk_tab` VALUES ('2', '音乐', '1', '1313456465');
INSERT INTO `tk_tab` VALUES ('3', '美术', '1', '1313456465');

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
INSERT INTO `tk_tab_article` VALUES ('2', '4');
INSERT INTO `tk_tab_article` VALUES ('1', '4');
INSERT INTO `tk_tab_article` VALUES ('3', '4');
INSERT INTO `tk_tab_article` VALUES ('1', '5');

-- ----------------------------
-- Table structure for `tk_user`
-- ----------------------------
DROP TABLE IF EXISTS `tk_user`;
CREATE TABLE `tk_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `contact` varchar(255) NOT NULL COMMENT '联系方式 ，ipone|eamil',
  `token` varchar(255) NOT NULL COMMENT '认证token',
  `status` int(12) NOT NULL DEFAULT '1' COMMENT '状态 0 | 1',
  `create_time` varchar(255) NOT NULL COMMENT '创建时间',
  `updata_time` varchar(255) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tk_user
-- ----------------------------
INSERT INTO `tk_user` VALUES ('1', 'admin', 'admin', '11198793111@qq.com', 'qwertyuiopasfghjklzxcvbnm', '1', '1534082222', '1534082222');
INSERT INTO `tk_user` VALUES ('2', 'mikes', '123456', '23654891', 'jakksdfidfejffkfkfkf', '1', '1530482223', '1534085555');
INSERT INTO `tk_user` VALUES ('3', 'admin1', '2122345544', '123@qq.com', 'HgQuRSQ9XGeu7rlY9t2DGB3u-9T669bJA8Kq6125IJF9AbA7', '1', '1536389043412', '1536389043413');

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
INSERT INTO `tk_user_role` VALUES ('1', '1');
INSERT INTO `tk_user_role` VALUES ('2', '2');
INSERT INTO `tk_user_role` VALUES ('3', '1');
INSERT INTO `tk_user_role` VALUES ('3', '2');
