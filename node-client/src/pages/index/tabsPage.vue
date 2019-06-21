<template>
    <div class="cate-page">
            <div  class="cate-main">
                <div class="m-flex cate-content">
                     <by-heart v-for="(itme,index) in tabData" :key="index" scale=8>
                        <router-link class="m-itme" :to="{path:'/index',query:{tid:itme.id}}">{{itme.name}}({{itme.count}})</router-link>
                     </by-heart>
                </div>
                
            </div>
    </div>
</template>

<script>
import byHeart from "@/components/by-heart";
    export default {
        components:{
            byHeart
        },
        data(){
            return {
                tabData:[]
            }
        },
        methods:{
            getData(){
                this.$axios.GET("blogGroupType",{type:"tab"}).then(res=>{
                   var data = res.data;
                   if(data.status){
                       this.tabData = data.data;
                   }
                })
            }
        },
        created(){
            this.getData();
        }
    }
</script>

<style scoped>
.cate-main{
    display: flex;
    max-width: 1440px;
    width: 98%;
    margin: auto;
}
.cate-content{
    flex: 1;
    max-width: 900px;
    display: flex;
    margin: 40px auto;
    justify-content: space-around;
    flex-wrap: wrap;
}
.m-itme{
    background: transparent;
    width: 100%;
    height: 100%;
    /* box-shadow: 0 0 10px #ddd; */
    cursor: pointer;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    transition: all 0.5s linear;
}
.m-itme:hover{
    /* box-shadow: 0px 0px 30px #009688,inset 0px 0px 10px #009688;
    color: #000; */
    transition: all 0.5s linear;

}
</style>