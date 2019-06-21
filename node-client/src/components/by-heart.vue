<template>
    <div class="heart-warp" :style="getStyle">
        <div class="heart-before" :style="getHeartStyle"></div>
        <div class="heart-after" :style="getHeartStyle"></div>
        <div class="heart-conten"><slot></slot></div>
    </div>
</template>

<script>
    export default {
        props:{
            background:{
                type:String,
                default:"red"
            },
            scale:{
                type:Number|String,
                deault:1
            }
        
        },
        data(){
            return {
                size:10,
            }
        },
        computed:{
            getStyle(){
                this.size = this.size<16?16:this.size;
                return {
                    width:this.size * this.scale +"px",
                    height:(this.size-2) * this.scale +"px"
                }
            },
            getHeartStyle(){
                var radiusWid = (this.size-2) * this.scale +"px";
                return {
                    "border-radius": `${radiusWid} ${radiusWid} 0 0`,
                    "background-color": this.background 
                }
            },
            getWidth(){
                return this.width;
            },
            getHeight(){
                return this.height;
            }
        }
    }
</script>

<style scoped>
.heart-warp{
    position: relative;
}
.heart-warp .heart-before,.heart-warp .heart-after{
    position: absolute;
    content: "";
    width: 50%;
    height: 100%;
    top: 0;
    background-color: red ;
    transition:  all 0.5s linear;
    z-index: 0;
}

.heart-warp:hover .heart-before,.heart-warp:hover .heart-after{
    box-shadow: 0px 0px 30px #009688,inset 0px 0px 10px #009688;

}
.heart-warp .heart-after{
    left: 0;
	transform: rotate(45deg);
    transform-origin: 100% 100%;
}
.heart-warp .heart-before{
    left: 50%;
    transform: rotate(-45deg);
    transform-origin:0 100%;  
}
.heart-warp .heart-conten{
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
}
</style>