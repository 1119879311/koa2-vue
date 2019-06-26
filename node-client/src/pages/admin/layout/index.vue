<template>
  <el-container>
        <el-header><adminHeader></adminHeader></el-header>
        <el-container class="view-main">
            <el-aside width="200px" ><admin-aside :menu="menu"></admin-aside></el-aside>
            <el-container>
              <el-main>
               <div class="my-tab-class">
                  <el-tabs ctype="card" editable
                    v-model="$store.state.TABS.activeTab"
                    @tab-click="tabclick"
                    @tab-remove="removeTab">
                      <el-tab-pane :label="itme.title" :name="itme.url" v-for="itme in $store.state.TABS.tabsList" :key="itme.title"></el-tab-pane>
                  </el-tabs>
               </div>
               <div class="content-views">
                  <transition :name="transitionName">
                      <router-view />
                  </transition>
               </div>
              </el-main>
            <el-footer>Footer</el-footer>
            </el-container>
        </el-container>
     </el-container>
</template>
<script>
import adminHeader from './header';
import adminAside from './aside';
import adminNavSiler from '@/assets/data/meun';
import { mapMutations } from "vuex";
export default {
  name: 'App',
  data(){
    return{
      transitionName:"slide-fade",
      menu:[],
      tabsList:this.$store.state.TABS.tabsList,
      activeTab:this.$store.state.TABS.activeTab
    }
  },

  components:{     
    adminHeader,
    adminAside
  },
   watch:{
        $route(to,form){
          
          if(to.name=="adminNofind"){
              this.setTab(to.path);
          }else{
            this.setTab(to.path); 
          }
         
        },
        
    },
  methods: {
    ...mapMutations({
      setTab:"TABS/addTabList",
      getTab:"TABS/getTabsData",
      remTab:"TABS/removeTab"

    }),
    tabclick:function(option){
      this.setTab(option.name)
    },
    removeTab:function(option){
      this.remTab(option);
      setTimeout(() => {
        if(!this.$store.state.TABS.tabsList.length){
          this.setTab("/admin")
        }
      }, 10);
      
    }
  },
  created:function(){
      this.getTab();
      this.tabsList = this.$store.state.TABS.tabsList;
      this.activeTab = this.$store.state.TABS.activeTab;
      this.$router.push({path:this.activeTab})

  }
  
}
</script>
<style>
.view-admin{height: 100%}
.view-main{position: absolute;top:60px;bottom: 0;width: 100%}
.el-main{padding-top: 0;padding-left: 0;position: relative;}
.el-header, .el-footer {
 background-color: #E9EEF3;
  height: 60px;
}
.el-aside {
  background-color:#19293b;
  border-right: none;
  color: #3e9fff;
}
body > .el-container {
  margin-bottom: 40px;
}
.el-header{
  background: rgb(25, 41, 59);
}
.content-views{padding-left:20px;padding-top: 45px }
.table-contain{margin-top: 24px;max-height: 450px;overflow-y: scroll}
.my-tab-class{position: fixed;left: 208px;top: 60px;z-index: 2000;right: 10px;background: #fff}
</style>
