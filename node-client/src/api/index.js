
const serverApi = process.env.NODE_ENV =="production"?"/api":"http://127.0.0.1:3000/api";
//登录 
export let baseUrl = serverApi;
export let adminLogin = `${serverApi}/login`;

//---------cms
//----blog:article
export let blogArticle = `${serverApi}/post`; 
export let blogDetail = `${serverApi}/post/detail`;
export let blogArticlebAdd = `${serverApi}/post/add`;
export let blogArticlebUpdate = `${serverApi}/post/update`;
export let blogArticlebSwtich= `${serverApi}/post/swtich`;
export let blogArticlebDel= `${serverApi}/post/delete`;
export let blogGroupType = `${serverApi}/post/groupType`;


//----blog:tab
export let blogTab = `${serverApi}/tab`;
export let blogTabAdd = `${serverApi}/tab/add`;
export let blogTabUpdate = `${serverApi}/tab/update`;
export let blogTabSwtich = `${serverApi}/tab/swtich`;
export let blogTabDel = `${serverApi}/tab/delete`;
//----blog:cate
export let blogCate = `${serverApi}/cate`;
export let blogCateAdd = `${serverApi}/cate/add`;
export let blogCateUpdate = `${serverApi}/cate/update`;
export let blogCateSwtich = `${serverApi}/cate/swtich`;
export let blogCateDel = `${serverApi}/cate/delete`;


//图片上传 
export let uploadArticleUe= `${serverApi}/post/uploadueimg`; 
export let uploadArticleThum= `${serverApi}/post/uploadThum`; 

// rbac :user
export let rbacUser = `${serverApi}/manager`;
export let rbacUserAdd = `${serverApi}/manager/add`;
export let rbacUserUpdate = `${serverApi}/manager/update`;
export let rbacUserSwtich = `${serverApi}/manager/swtich`;
export let rbacUserDel = `${serverApi}/manager/delete`;
export let rbacUserAssginRole= `${serverApi}/manager/assginRole`;



// rbac:role 
export let rbacRole = `${serverApi}/role`;
export let rbacRoleAdd = `${serverApi}/role/add`;
export let rbacRoleUpdate = `${serverApi}/role/update`;
export let rbacRoleSwtich = `${serverApi}/role/swtich`;
export let rbacrRoleAssginAuth = `${serverApi}/role/assginAuth`;
export let rbacRoleDel = `${serverApi}/role/delete`;


// rbac:auth
export let rbacAuth = `${serverApi}/auth`;
export let rbacAuthAdd = `${serverApi}/auth/add`;
export let rbacAuthUpdate = `${serverApi}/auth/update`;
export let rbacAuthSwtich = `${serverApi}/auth/swtich`;
export let rbacAuthDel = `${serverApi}/auth/delete`;
// export let muenAuth = `${serverApi}/rbac/auth`;


// userCenter
 
export let usermodifypwd = `${serverApi}/userCenter/modifypwd`;
