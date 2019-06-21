<template>
    <div class="tree-main">
        <div class="tree-item" @click="toggle" >
            <li><span v-if="isFloder" class="ionic-chevron" :class="[open?'bom-chevron':'top-chevron']"></span>
            <router-link exact :to="models.url" v-if="models.url">{{models.name}}</router-link>
            <span v-else><a href="javascript:;">{{models.name}}</a></span></li>
        </div>
        <transition name="fade">
            <div class="tree-list" v-show="open" v-if="isFloder">
                <itmes v-for="mel in  models.children" :key="mel.name" :models="mel"></itmes>
            </div>    
        </transition>
    </div>
</template>
<script>
export default {
    name:"itmes",
    props:{
        models:{
            type:Object,
            default(){
                return {
                    name:"tree1",
                    children:[]
                }
            }
        }
    },
    data(){
        return {
            open:false
        }
    },
    computed:{
        isFloder:function(){ 
            return this.models.children && this.models.children.length
        }
    },
    methods:{
        toggle:function(){
            if(this.isFloder){
                this.open = !this.open
            }
        }
    }
}
</script>
<style scoped>

.tree-main{
    
    cursor: pointer;
}
.tree-list{
    transition: opacity 0.5s linear;
}
.tree-list li{
    padding-left: 12px;
    list-style: none;
    
}
.tree-item{
    position: relative;
   
}
.tree-item a{
    color: #fff;
    text-decoration: none;
    display: block;
    padding: 12px;
}
.ionic-chevron{
    display: block;
    border:10px solid transparent;
    right: 10px;
    top: 50%; 
    transition: all 1s ;
    position: absolute;
    
}
.router-link-exact-active.router-link-active{
    /* background: #16232d; */
    color:#5FB878
}
.top-chevron{
    border-bottom-color: #5FB878;
    transform: translateY(-75%)
}
.bom-chevron{
    border-top-color: #5FB878; 
    transform: translateY(-25%)
 }
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
