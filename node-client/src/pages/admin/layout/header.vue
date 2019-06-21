<template>
    <div class="m-flex admin-header">
        <div class="m-flex left-header">
            <span>BEYONDS</span>
        </div>
         <div class="m-flex rig-header">
             <el-menu class="el-menu-demo" mode="horizontal"  @select="handleSelect" >
                <el-menu-item index="1"> <router-link to="/">前台</router-link></el-menu-item>
                <el-submenu index="2" popper-class="header-el-menu--horizontal">
                    <template slot="title">{{name}}</template>
                    <el-menu-item index="modifypwd">修改密码</el-menu-item>
                    <el-menu-item index="loginout">退出</el-menu-item>
                </el-submenu>
                </el-menu>
         </div>
           <el-dialog 
            title="重置密码"
            :visible.sync="isShow">
            <modypwd/>
        </el-dialog>
    </div>
</template>
<script>
import modypwd from "../manager/modifypwd";
export default {
    data(){
        return {
            name:"",
            isShow:false
        }
    },
    components: {
        modypwd
    },
    methods:{
        loginout:function(){
           this.$confirm("确定退出",{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
           }).then(()=>{
               this.$store.dispatch("USER/LoginOut"); 
               this.$store.dispatch("TABS/removeTabsData");  
               this.$router.replace({path:"/admin/login"})  
           })
        },
        handleSelect(key, keyPath) {
            switch (key) {
                case "modifypwd":
                    this.isShow = true;
                    break;
                case "loginout":
                    this.loginout();
                    break;
                default:
                    break;
            }
           
        }
    },
    created:function(){
        this.name =this.$store.state.USER.ADMIN_NAME;
      
    }
}
</script>
<style scoped>
    .admin-header{align-items: center;height: 100%}
    .admin-header .left-header{width:200px;}
    .admin-header .left-header span{text-shadow:3px 3px 10px #fff;color: #fff;font-size: 24px;font-family:"宋体";font-weight: bold}
    .admin-header .rig-header{flex: 1;flex-direction:  row-reverse;}
    .admin-header .rig-header .btn{margin-left: 20px}
    .admin-header .el-menu-demo{background: rgb(25, 41, 59); }
</style>

