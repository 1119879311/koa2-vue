var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _desc, _value, _class2;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

const { Controller, POST, GET } = imports("Lib/router");
const authModel = imports("models/auth");
const authLogic = imports("logic/auth");
const roleBase = imports("Controller/admin/role_base");

// 该模块属于权限管理的角色模块，所有请求需要授权

let index = (_dec = Controller("/auth"), _dec2 = GET("/"), _dec3 = POST("/add"), _dec4 = POST("/update"), _dec5 = POST("/delete"), _dec6 = POST("/swtich"), _dec(_class = (_class2 = class index extends roleBase {
  async find(ctx, next) {
    let { status, roleId } = ctx.request.query;
    // 查询所有的权限行为
    var data = await authModel.findAll(status);
    // 根据角色id 刷选除对应的权限行为
    if (data && data.length && roleId) {
      var roleAuth = await authModel.findRoleAuth(roleId);
    }
    ctx.body = await ctx.send({ data, roleAuth });
  }

  /**添加 权限行为
   * @param POST /auth/add
   * @param body {name,identName,url,status,groupName}
  * @param return {code,mssage/errmsg,data,status}
   **/

  async add(ctx, next) {
    var { name, identName, url } = ctx.request.body;
    var validRes = await authLogic.veryAuth({ name, url, identName });
    if (validRes) return ctx.body = await ctx.error(validRes);
    ctx.body = await ctx.send((await authModel.add(ctx.request.body)));
  }
  /**修改权限行为
   * @param POST /auth/update
   * @param body { id, name,identName,url,status,groupName}
   * @param return {code,mssage/errmsg,data,status}
   **/

  async update(ctx, next) {
    var { id, name, identName, url } = ctx.request.body;
    if (!id) return ctx.body = await ctx.error("id  is required");
    // 数据验证
    var validRes = await authLogic.veryAuth({ name, url, identName });
    if (validRes) return ctx.body = await ctx.error(validRes);
    ctx.body = await ctx.send((await authModel.update(ctx.request.body)));
  }
  /**删除权限行为
   * @param POST /auth/delete
   * @param body { id}
   * @param return {code,mssage/errmsg,data,status}
   **/
  //删除role
  async delete(ctx, next) {
    let { id } = ctx.request.body;
    if (!id) return ctx.body = await ctx.error("id  is required");
    ctx.body = await ctx.send((await authModel.delete(id)));
  }

  /**单个/批量修改状态
   * @param {object} ctx.request.body 
   * @param {array} data =>[{id:1,status:1}]
   * @param return {code,mssage/errmsg,data,status}    
   * */

  async swtich(ctx, next) {
    var { data } = ctx.request.body;
    ctx.body = await ctx.send((await authModel.switch(data)));
  }

}, (_applyDecoratedDescriptor(_class2.prototype, "find", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "find"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "delete"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swtich", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "swtich"), _class2.prototype)), _class2)) || _class);

module.exports = index;