import orignRouter from "@/router/addRouter";
import router from '@/router';
let routerData = JSON.parse(JSON.stringify(orignRouter.children));
const state ={
    tabsList:[],
    activeTab:"/admin" //默认 
}

const getters = {};

const mutations = {
    addTabList:(state,data)=>{
        var data = data?data.replace(/\/$/,""):data;
        var fildIndx = state.tabsList.findIndex(itme=>itme.url==data);

        if(fildIndx==-1){
            var filterData = routerData.filter(itme=>itme.path==data);
           
            if(filterData.length) {
               
                filterData =filterData[0];
                // 添加一个
               state.tabsList.push({title:filterData.title,url:filterData.path});
              
            };
           
        }
        state.activeTab = data;
        router.push(data);
        sessionStorage.setItem("adminTabs",JSON.stringify(state.tabsList));
        sessionStorage.setItem("activeTab",data);
    },
    removeTab:(state,data)=>{
        var activeTab = state.activeTab;
        state.tabsList.forEach((itme,index)=>{
            if(itme.url==data){
                state.tabsList.splice(index,1);
                if(data==activeTab){
                    let nextTab = state.tabsList[index + 1] || state.tabsList[index - 1];
                  
                    if(nextTab){
                        state.activeTab = nextTab.url;
                        router.push(nextTab.url)
                    }
                }
            }
        })

        sessionStorage.setItem("adminTabs",JSON.stringify(state.tabsList));
        sessionStorage.setItem("activeTab",activeTab);
    },
    clearTabsData:(state)=>{
        state.tabsList=[];
        state.activeTab = "/admin"
        sessionStorage.removeItem("adminTabs");
        sessionStorage.removeItem("activeTab");
    },
    getTabsData:(state)=>{
        try {
            var tabs=  sessionStorage.getItem("adminTabs");
            state.tabsList  = tabs?[...new Set(JSON.parse(tabs))]:[];
            state.activeTab =  sessionStorage.getItem("activeTab")?sessionStorage.getItem("activeTab"):"/admin";
        } catch (error) {
            state.activeTab = "/admin"
        }
    } 
}

const actions = {
    removeTabsData:({commit})=>{
        commit("clearTabsData");
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
