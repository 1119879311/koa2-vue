import vuex from "vuex";
import Vue from 'vue'
import USER from './module/login';
import AddRouter from "./module/addRouter";
import TABS from "./module/tabs";

Vue.use(vuex);
const modules = {
    USER,
    AddRouter,
    TABS
}
export default new vuex.Store({
    modules
})