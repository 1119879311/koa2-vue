<template>
    <div class="cate-page">
            <div  class="cate-main">
                <div class="m-flex cate-content">
                     <div class="cate-itme" v-for="(itme,index) in cateData" :key="index"  >
                         <router-link v-if="itme.count" :to="{path:'/index',query:{cid:itme.id}}">{{itme.name}}({{itme.count}})</router-link>
                     </div>
                </div>
            </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                cateData:[]
            }
        },
        methods:{
            getData(){
                this.$axios.GET("blogGroupType",{type:"cate"}).then(res=>{
                   var data = res.data;
                   if(data.status){
                       this.cateData = data.data;
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
.cate-itme{
    background: #fff;
   
    border-radius: 12px;
    transition: all  0.5s linear;
    box-shadow: 0 0 10px #ddd;
    cursor: pointer;
    font-size: 16px;
    margin:20px 2%;
}
.cate-itme:nth-child(n+1){
    background:#67C23A;
}

.cate-itme:nth-child(2n+1){
    background:#409EFF
}
.cate-itme:nth-child(3n+1){
    background:#F56C6C;
}
.cate-itme:nth-child(4n+1){
    background:rgba(224,67,150,1);
}
.cate-itme:nth-child(5n+1){
    background:rgba(125,120,234,1);
}

 .cate-itme:hover{
     box-shadow: 0 0 10px 2px #000;
 }
.cate-itme a{
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding:30px 20px;
    min-width:120px;
    color:#fff
}
</style>