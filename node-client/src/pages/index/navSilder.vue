<template>
    <div class="adieSilder-page">
        <div class="aside-main">

            <div class="header-pic">
               <img src="~@/assets/images/header-logo.jpg" width="120" style="border-radius:50%">
            </div>
            <p class="mingyan">书之风-天高任鸟飞</p>
            <div class="nav-list">
                 <router-link :to="itme.url" class="nav-itme" v-for="(itme,index) in asideData" :key="index">
                   <img :src="itme.ionic" class="meun-ionic" /><span>{{itme.name}}</span>
                </router-link>

            </div>

        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                asideData:[
                    {name:"文章",ionic:require("@/assets/images/article-muen-ionic.png"),url:"/"},
                    {name:"分类",ionic:require("@/assets/images/cate-muen-ionic.png"),url:"/cate"},
                    {name:"标签",ionic:require("@/assets/images/tab-muen-ionic.png"),url:"/tabs"},
                    {name:"关于我",ionic:require("@/assets/images/abouMe-muen-ionic.png"),url:"/about"},
                    ]
            }
        }
    }
</script>

<style scoped>
.header-pic{
    width: 120px;
    height: 120px;
    margin: 20px auto;
    border-radius: 50%;
    background: #009688;
}
.mingyan{
    color: #000;
    text-align: center;
    padding: 6px 8px;
}
.nav-itme{
    padding: 6px 8px;
    text-align: center;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    margin:12px auto;
    color: #009688;
}
.nav-itme .meun-ionic{
    width: 28px;
    margin-right: 4px;
}

</style>