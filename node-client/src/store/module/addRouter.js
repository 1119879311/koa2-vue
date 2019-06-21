import orignRouter from "@/router/addRouter"; //所有的router ,需要要与server端返回的数据 筛选对应的router
import devMeun from "@/assets/data/meun"; //本地测试侧栏菜单数据

const filterRouterDev = (data,auth=[])=>{
     var data = data||[];
     return data.map(itme=>itme.name);
}
const addRouterDev = (auth=[])=>{
    if(!auth|| !auth.length) return [];
    var result = [];
    var data = orignRouter.children||[];
    var cloneRouter = {path:orignRouter.path,component:orignRouter.component};
    auth.forEach(itme=>{
        var res = data.filter(val=>val.name==itme);
        if(res[0]){
            result.push(res[0])
        }
    })
    cloneRouter.children = result;
    return [cloneRouter];
}

const state = {
    routerList:[],
    meun:[],
    isAddROuter:false,
}
const mutations = {
    setRouter:(state,data)=>{
        var {newMuenList,newRoter,isAddROuter} = data;
        var res = addRouterDev(newRoter);
        state.meun = newMuenList;
        state.routerList =res;
        state.isAddROuter = isAddROuter;
        localStorage.setItem("muenRouter",JSON.stringify(data));
    },
    clearRouter:(state)=>{
        state.meun = [];
        state.routerList = [];
        state.isAddROuter = false;
        localStorage.removeItem("muenRouter")
    }
}
const actions = {
    loadRouter: async ({commit,rootState},data)=>{
        if(rootState.USER.ADMIN_TOKEN){
            var routerId =  filterRouterDev(orignRouter.children);
            commit("setRouter",{newMuenList:devMeun,newRoter:routerId,isAddROuter:true});
        }
    },
    Refresh:async ({commit,rootState})=>{
        if(rootState.USER.ADMIN_TOKEN){
         try {
            var muenRouter = JSON.parse(localStorage.getItem("muenRouter"));
            commit("setRouter",{newMuenList:muenRouter.newMuenList,newRoter:muenRouter.newRoter,isAddROuter:muenRouter.isAddROuter});
            return Promise.resolve(true)
         } catch (error) {
            commit("clearRouter");
            return Promise.resolve(false)
         }
        }
    },
    clearRouter:({commit,rootState})=>{
        commit("clearRouter");
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}