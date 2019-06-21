<template>
    <div class="admin-aside">
        
        <el-menu
        :default-active='$store.state.TABS.activeTab?$store.state.TABS.activeTab:activeRoter'
        class="el-menu-vertical-demo"
        @select="onSelect"
        background-color="#023d79"
        text-color="#fff"
        active-text-color="#ffd04b" 
        router >
            <nav-item v-for="(itme,index) in menu" 
            :key="index" 
            :itmelist="itme"
            :itmeIndex="String(index)"></nav-item>
        </el-menu>
    </div>
</template>
<script>

import navItem from "./navItem";
import adminNavSiler from '@/assets/data/meun'
import { mapMutations } from "vuex";

export default {
    data(){
        return{
            activeRoter:this.$router.history.current.path,
            uniqueOpened:true,
            menu:adminNavSiler,
        }
    },
    components:{
        navItem
    },
 
    methods: {
        ...mapMutations({
            setTab:"TABS/addTabList"
        }),
         onSelect:function(key){
          this.setTab(key)

          this.activeRoter = key;
        },
        
    },
    created(){
        
    }
}
</script>
<style>
 .admin-aside .el-menu{border:none}
 .admin-aside .el-icon-arrow-down{color: #fff;font-size: 20px}
 .admin-aside .el-icon-menu{color: #fff}
</style>
