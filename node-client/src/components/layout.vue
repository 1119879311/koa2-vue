<template>
    <div class="page-layout">
        <!-- 上左右下结构 -->
        <header class="layer-header" :style="{height:headerH+'px'}">
           <slot name="layer-header">header</slot>
        </header>
        <div class="layer-aside" :style="{width:asideW+'px',top:headerH+'px'}">
            <div class="aside-warp" :style="{width:asideW+20+'px'}"> <slot name="layer-aside">aside</slot></div>
        </div>
        <div class="layer-contaion" :style="{marginLeft:asideW+'px',marginTop:headerH+'px'}">
           <slot name="layer-contaion">contaion</slot> 
        </div>
        <footer class="layer-footer" :style="{height:footerH+'px',left:asideW+'px'}">
           <slot name="layer-footer">footer</slot> 
        </footer>
    </div>
</template>
<script>
export default {
    props:{
        headerH:{
            type:Number,
            default:80
        },
        asideW:{
            type:Number,
            default:200
        },
         footerH:{
            type:Number,
            default:80
        },
    }
}
</script>

<style scoped>
.layer-header{
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    box-shadow: 3px 3px 9px #000;
    background: #1d2b36;
}
.layer-aside{
    position: fixed;
    bottom: 0;
    background-color: #1c2b36;
    overflow: hidden;
    color: #fff;
    box-shadow: 0px 3px 20px #000;
}
.layer-aside .aside-warp{
    position: relative;
    height: 100%;
    background-color: inherit;
    overflow-x: hidden;
    overflow-y: scroll;
}
.layer-footer{
    position: fixed;
    right: 0;
    bottom: 0
}
</style>
