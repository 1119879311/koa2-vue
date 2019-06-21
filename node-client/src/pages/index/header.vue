<template>
    <div class="m-flex header-main">
        
        <div class="block-input search-main" :style="{borderColor:searchInput.borderColor}">
            <input type="text"  v-model="searchKey"  :style="{width:searchInput.wid}" @keyup.enter="searchEvent(searchKey)" v-on:focus="searchFocus(searchKey)" v-on:blur="searchBlur(searchKey)">
            <a class="label-text el-icon-search" style="color:#96dbf8" @click="searchEvent(searchKey)"></a>
        </div>
        <div class="nav-main">
            <div class="nav-itme" v-for="(itme,index) in navData" :key="index">
                 <el-tooltip class="item" effect="dark" :content="itme.name" placement="bottom-end">
                    <a :href="itme.url" target="_target"><img :src="itme.ionic" width="28"> </a>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                isPC:false,
                navData:[
                    {name:"github",url:"https://github.com/1119879311",ionic:require("@/assets/images/git-ionic.png")},
                    {name:"npm",url:"https://www.npmjs.com/~beyonds",ionic:require("@/assets/images/npm-ionic.png")},
                    ],
                searchKey:"",
                searchInput:{
                    wid:"60px",
                    borderColor:"#dddd"
                }
            }
        },
        methods:{
            //searchFous 
            searchFocus(){
                this.searchInput.wid = "180px";
                this.searchInput.borderColor = "#409EFF";              
            },
            searchBlur(val){
                if(!val) {
                    this.searchInput.borderColor = "#ddd";
                    this.searchInput.wid = "20px";
                } 
               
            },
            resize:function(){
                var clientWid = document.documentElement.clientWidth;
                if(clientWid>=768){//平板pc
                        this.isPC = true
                }else{//移动
                        this.isPC = false
                }
            },
            searchEvent:function(val){
                if(!val){
                    this.$message.warning('内容不能为空');
                    return
                 }
                 this.$router.push({path:"/?search="+val})
            }
        },
        mounted:function(){
            this.$nextTick(function(){
                window.addEventListener("resize",this.resize,false);
            })
        },
        created(){
            this.resize();
        }
    }
</script>

<style scoped>

.header-main{
    justify-content: flex-end;
    height: 100%;
    padding: 4px 3px;
}
/* nav */
.nav-main{
    display: flex;
    margin-left: 20px;
    height: 100%;
    align-content: center;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row-reverse
}
.nav-main .nav-itme{
    margin-right: 8px
}
.nav-main .nav-itme a{
     color: #000;
    font-weight: bold
}
.nav-main a.router-link-active{
    color: #359ddc;
}
/* search */
.search-main{
    border:1px solid #dbecfd;
    border-radius: 4px;
    height: 28px;
    font-size: 14px;
    align-items: center;
}
.search-main input{
    border:none;
    outline: none;
    padding: 0 4px;
    border-radius:4px;
    transition: all 0.5s linear;
    width: 30px;
    min-width: 0;
    background: transparent;
    color: #009688;
}
</style>