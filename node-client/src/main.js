import Vue from 'vue'
import App from './App.vue'
import router from './router'
import elementUi from 'element-ui';
import axios from "./api/axios";
import store from "./store";
import filters from "./filter";
import byTitleLine from "@/components/byTitleLine";
Vue.config.productionTip = false
// console.log( process.env.NODE_ENV);
Vue.prototype.$axios = axios;
import 'swiper/dist/css/swiper.css';
import "@/assets/css/base.css";
import "element-ui/lib/theme-chalk/index.css"
Vue.use(elementUi);
Vue.use(byTitleLine)
//过滤器统一处理加载
Object.keys(filters).forEach(key => {  
  Vue.filter(key, filters[key])  
}) 
Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
  hljs.highlightBlock(block)
  })
})

new Vue({
  router,
  store,
  render: h => h(App),
 
}).$mount('#app')
