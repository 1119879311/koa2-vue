<template>
    <div class="index-layout-page">
       
        <!-- 左右下结构 -->
        <header class="layer-header" :style="{height:headerH+'px'}">
           <top-header/>
        </header>
        <div class="layer-aside" :style="{width:asideW+'px',top:headerH+'px',left:toggleLef-asideW+'px'}">
            <div class="aside-warp" :style="{width:asideW+20+'px'}">
               <nav-silder/>
            </div>
        </div>
         <img src="~@/assets/images/展开打开.png" :style="{marginLeft:2+'px',marginTop:4+'px'}" class="close-open-ionic" @click="closeOpenHandle">

         <!-- <img src="~@/assets/images/展开.png" :style="{marginLeft:asideW+'px',marginTop:headerH+'px'}" class="close-open-ionic" @click="closeOpenHandle"> -->
        <div class="layer-contaion" :style="{marginTop:headerH+'px',minHeight:containMinH+'px',marginLeft:containLeft+'px'}">
             <div class="top-banner">
                <!-- <img src="~@/assets/images/silder.jpg" class="img-response"> -->
            </div>
            <transition :name="transitionName">
                    <keep-alive>
                    <router-view />
                    </keep-alive>
            </transition>
            <div class="banqaun">
                <p>2019/04/01至{{(new Date).toDateString()}}</p>
                <p>粤ICP备19031381</p>
            </div>
        </div>
         <div class="bg-page"></div>
    </div>
</template>
<script>
import  navSilder  from "./navSilder";
import  topHeader  from "./header";
import util from "@/util/fn";
 var containMinH =  window.screen.height-150;
export default {
    data(){
        return {
            transitionName:"slide-fade",
            headerH:40,
            asideW:200,
            toggleLef:this.asideW,
            containLeft:this.asideW,
            containMinH: containMinH,
            navData:[
                {}
            ]
        }
    },
     components:{
        navSilder,
        topHeader
    },
     watch:{
            $route(to,form){
                this.setToggleLeft(this)

            },
            
        },
    beforeRouteEnter(to, from, next) {
            next(vm => {
              vm.setToggleLeft(vm);
            });
         },
     mounted:function(){
            var _this = this;
            this.$nextTick(function(){
                window.addEventListener("resize",function(){
                    _this.setToggleLeft(_this) 
                },false);
            })
    },
    methods: {
        closeOpenHandle:function(){
             if(util.isMobile()){
                if(this.toggleLef>0){
                    this.toggleLef = 0;
                }else{
                    this.toggleLef = 200;
                }
                this.containLeft=0;
             }else{
                 if(this.toggleLef>0){
                     this.toggleLef = 0;
                     this.containLeft=0;
                }else{
                    this.toggleLef = 200;
                    this.containLeft=200;

                }
             }
            
        },
        setToggleLeft:function(_this){
            if(util.isMobile()){
                _this.toggleLef = 0;
                _this.containLeft=0;
            }else{
                _this.toggleLef =200;
                _this.containLeft=200;
            }
        }
    },

}
</script>

<style scoped>
.bg-page{
    position: fixed;
    width: 100%;
    height:100%;
    top: 0;
    left: 0;
    background: url("~@/assets/images/11528e911dd3eeedb4f5d29402fc0653.jpeg");
    z-index:-10;
    zoom: 1;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center 0;
}
.layer-header{
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
    box-shadow: 0px 3px 20px 2px #d6f5ff;
    background: rgba(0, 0, 0, 1);
}
.layer-aside{
    position: fixed;
    bottom: 0;
    background: rgba(255, 255, 255, 1);
    overflow: hidden;
    color: #fff;
    box-shadow: 0px 3px 20px 2px #d6f5ff;
    /* box-shadow: 2px 0px 2px #999; */
    z-index: 1;
    transition: all 0.3s linear;
}
.layer-aside .aside-warp{
    position: relative;
    height: 100%;
    background-color: inherit;
    overflow-x: hidden;
    overflow-y: scroll;
    transition: all 0.3s linear;

}
.layer-footer{
    position: fixed;
    right: 0;
    bottom: 0;
    transition: all 0.3s linear;

}

.layer-contaion{
    transition: all 0.3s linear;
    position: relative;
    padding-bottom: 60px;
    /* background:#F5F5F5 */
}
.close-open-ionic{
    position: fixed;
    top: 0;
    cursor: pointer;
    z-index: 1;
    transition: all 0.3s linear;

}
.banqaun{
    padding: 12px;
    text-align: center;
    color: #333;
    position: absolute;
    bottom: 0;
    width: 100%;
}
.top-banner{
    height: 100px;
}

@media screen and (max-width: 768px){
    .top-banner{
        height: 30px;
    }
}

</style>
