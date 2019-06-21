import Vue from 'vue'
import Router from 'vue-router'
import store from "../store/index";
// import orignRouter from "@/router/addRouter";
//admin
var LoginPage = ()=>import("@/pages/admin/login");
var errorPage  =  ()=>import("@/pages/common/404");

Vue.use(Router);

// 清除本地数据
function clearLocalData(){
      store.dispatch("USER/LoginOut");
      store.dispatch("AddRouter/clearRouter");
      store.dispatch("TABS/removeTabsData");
}

let routers =  new Router({
  // mode:"history",
  routes: [
    { path:"/index", redirect: '/'},

    {  path:"/",component:()=>import("@/pages/index/layout"),children:
      [
        { path:"/",name:"indexPage",component:()=>import("@/pages/index")}, 
        { path:"/articledetail/:id",name:"articleDetail",component:()=>import("@/pages/index/articleDetail")},
        { path:"/cate",name:"catePage",component:()=>import("@/pages/index/catePage")},
        { path:"/tabs",name:"tabsPage",component:()=>import("@/pages/index/tabsPage")},       
      ]
    },
    { path:"/about",name:"aboutUsPage",component:()=>import("@/pages/index/aboutUsPage")},

    { path:"/admin/login", name:"login", component:LoginPage},
    {path:"/error/404", name:"404",component:errorPage} 
  ]
});
// routers.addRoutes(store.state.AddRouter.routerList);
routers.beforeEach((to, from, next)=>{
  if (to.path.match(/^\/admin/)) {
    if(to.path.match(/^\/admin\/login/)){
      clearLocalData();
      return  next();
    }
    store.dispatch("USER/Refresh");
    if(store.state.USER.ADMIN_TOKEN){
     
      // 判断是否拉去role router
        if(store.state.AddRouter.isAddROuter){
          if (to.matched.length == 0) {//不存在的path
            return  routers.replace('/admin/error/404');
          }
          next();
        }else{
            store.dispatch("AddRouter/Refresh").then(()=>{
              routers.addRoutes(store.state.AddRouter.routerList)
               next({path:"/admin"});
            }).catch(()=>{
                clearLocalData();
                next({path:"/admin/login"})
            });
        }

    }else{
        clearLocalData();
        return routers.push('/admin/login');
    };
    
  }else{
    if (to.matched.length == 0) {//不存在的path
      routers.replace('/error/404');
      return 
    }
    next();
  }   
})
export default routers;