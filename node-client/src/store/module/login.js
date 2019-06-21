const  state = {
    ADMIN_NAME:"",
    ADMIN_ID:"",
    ADMIN_TOKEN:"",
    ADMIN_ISlOGIN:false,
    EXPIRESIN:0,
}

const mutations = {
    setToken:(state,data)=>{
        try {
            var valArr = Object.values(data);
            var falg = valArr.every(itme=> itme);
            if(!falg){
                sessionStorage.removeItem("token");
                return false;
            }
            sessionStorage.setItem("token",JSON.stringify(data))
            state.ADMIN_NAME = data.username;
            state.ADMIN_ID = data.userId;
            state.ADMIN_TOKEN = data.token;
            state.ADMIN_ISlOGIN = data.isLogin;
        } catch (error) {
            sessionStorage.removeItem("token");
            for (const key in state) {
                state[key] = '';
            }
        }
    },
    clearToken:(state)=>{
        sessionStorage.removeItem("token");
        for (const key in state) {
            state[key] = '';
        }
    }
}
const actions = {
    Login: async ({commit},data)=>{
      await commit("setToken",data)
    },
    Refresh:(({commit})=>{
        try {
            commit("setToken",JSON.parse(sessionStorage.getItem("token")))
        } catch (error) {
            commit("clearToken");
        } 
    }),
    LoginOut:({commit})=>{
        commit("clearToken");
       
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}