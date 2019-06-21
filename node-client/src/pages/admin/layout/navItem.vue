<template>
     <el-submenu  v-if="itmelist.children&&itmelist.children.length" :index="itmeIndex">
           <template slot="title"> <i class="el-icon-menu"></i> <span>{{itmelist.title}}</span></template>
            <nav-item 
            v-for="(itme,i) in itmelist.children" 
            :key="itmeIndex+'-'+i" 
            :itmeIndex="itmeIndex+'-'+i"
            :itmelist="itme" >
        </nav-item>
     </el-submenu>
    <el-menu-item  v-else :index="itmelist.path">
        <i class="el-icon-menu"></i>
        <span slot="title">{{itmelist.title}}</span>
    </el-menu-item>
</template>
<script>
export default {
   name: 'navItem',
   props:["itmelist","itmeIndex"]
}
</script>
