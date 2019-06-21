<template>
    <div class="by-paintion">
        <div class="pageination" v-if="pageCount>1">
            <div class="firstItem" v-if="layouts.first" :data-itme="1" :class="[pageNums-1<1?pageItemDisable:'pageItem']" @click="firstChanges()" ><slot name="firstVal">首页</slot></div>
            <div class="prveItem" v-if="layouts.prev" :data-itme="pageNums-1" :class="[pageNums-1<1?pageItemDisable:'pageItem']" @click="changes(pageNums-1)" ><slot name="prevVal">prev</slot></div>
            <div class="pageItem"
                 :v-if="pageNumView>0"
                 :data-itme="itme"
                 v-for="itme in pageViewsList" :key="itme"
                 :class="[itme==pageNums?pageItemActive:'']"
                 @click="changes(itme)" 
                >
                <slot v-bind:page="itme">{{itme}}</slot>
            </div>
            <div class="nextItem" v-if="layouts.next" :data-itme="pageNums+1" :class="[pageNums+1>pageCount?pageItemDisable:'pageItem']"  @click="changes(pageNums+1)"><slot name="nextVal">next</slot></div>
            <div class="jump-main"><input type="text" v-model="inputVal" class="inpval" v-on:keyup.enter="changes(inputVal)" /><button type="button" class="jumpbtn" :class="[!inputVal||inputVal==pageNums?pageItemDisable:'pageItem']"  @click="changes(inputVal)"><slot name="jumpbtn">Go</slot></button></div>
            <div class="lastItem" v-if="layouts.last" :data-itme="pageCount" :class="[pageNums+1>pageCount?pageItemDisable:'pageItem']" @click="lastChanges()" ><slot name="lastVal">尾页</slot></div>
            <div class="page-counts" v-if="layouts.counts" :data-itme="pageCount" ><slot name="countsVal">共{{pageCount}}页</slot></div>
            <div class="page-totals" v-if="layouts.totals" :data-itme="totals" ><slot name="totalsVal">共{{totals}}条数据</slot></div>
        </div>
    </div>
</template>
<script>
export default {
  
    props:{
       pageSize:{
            type:Number,
            default:6
       },
       pageNum:{
           type:Number,
           default:0
       },
       totals:{
           type:Number,
           default:100
       },
       pageNumView:{
           type:Number,
           default:5
       },
       isNextPrex:{
           type:Boolean,
           default:true
       },
       isShow:{
           type:Array,
           default:function(){
               return ["prev","pager","next","counts"] //["first","prev","pager","next","last","counts","totals"]
           }
       }
    },
    data(){
        return {
            pageItemActive:"pageItemActive",
            pageItemDisable:"pageItemDisable",
            pageNumViews:this.pageNumView,
            inputVal:1
        }
    },
    watch:{
        inputVal:function(val){
            // 监听输入的值是否合法
            var reg = /^[1-9][0-9]*$/;
            if(!reg.test(val)||val==this.pageNums||val>this.pageCount){
                this.inputVal = '';
                return ;
            }
        }
    },
    computed:{
        // 总页数
        layouts:function(){
            var obj = {};
            this.isShow.forEach(ele => {
                obj[ele] = ele;
            });
            return obj;
        },
        pageCount:function(){
            var pageCountRes = this.totals%this.pageSize>0?Math.ceil(this.totals/this.pageSize):this.totals/this.pageSize;
            return pageCountRes;
        },
        pageNums:function(){//重置当前页数
             var currentNum = this.pageNum<1?1:this.pageNum;
             return currentNum>this.pageCount?this.pageCount:currentNum;
        },
        pageViewsList:function(){ //计算页码列表
            var viewsList = [];
             //重置页码个数
            this.pageNumViews = this.pageNumViews>this.pageCount?this.pageCount:this.pageNumViews;
            var startVal =this.pageNums-parseInt(this.pageNumViews/2);
            startVal = startVal<1?1:startVal;
            var endVal = parseInt(startVal+this.pageNumViews);
            if(endVal>this.pageCount){
                startVal = this.pageCount - this.pageNumViews +1;
            }
            for(var i =0;i<this.pageNumViews;i++){
                viewsList.push(startVal);
                 ++startVal;
            }
            return viewsList;
        }

    },
    methods:{
        firstChanges:function(){
            if(this.pageNums==1) return;
            this.changes(1);
        },
        lastChanges:function(){
            if(this.pageNums==this.pageCount) return ;
            this.changes(this.pageCount);
        },
        changes:function(index){
            var index = Number(index);
            if(!index||index==this.pageNums  || index<1 ||index> this.pageCount) return ;
            this.$emit("changeEvent",index);
        }
    },
    mounted() {
    },
}
</script>
<style scoped>
.pageination{
    list-style: none;
    display: inline-block;
    overflow: auto;
   
}
.pageination>div{
    float: left;
    padding: 5px 10px;
   
}
.pageination .pageItem{
    border: solid thin #DDDDDD;
    margin: 5px;
    cursor: pointer;
}
.pageination .pageItemActive{
    border: solid thin #0099FF;
    margin: 5px;
    background-color: #0099FF;
    color:white;
    cursor:no-drop;
}
.pageination .pageItem:hover{
    border: solid thin #0099FF;
    background-color: #0099FF;
    color:white;
}
.pageination .pageItemDisable{
    border: solid thin #DDDDDD;
    margin: 5px;
    background-color: #DDDDDD;
    cursor:no-drop
}
.pageination .jump-main{
    padding: 0;
    margin-top: -2px
}
.pageination .inpval,.pageination button{
	display: inline-block;
	width: 30px;
	height: 30px;
	text-align: center;
	line-height: 30px;
	border: solid thin #DDDDDD;
	outline: none;
}
.pageination button{
	display: inline-block;
	margin-left: 5px;
	width: 33px;
	height: 33px;
	cursor: pointer;
}
.pageination .page-counts,.pageination .page-totals{
	 line-height: 32px;
	 background:#0099FF ;
	 color: #fff;
	 padding: 1px 8px;
	 margin-left: 5px;
	 margin-top: 5px;
}
</style>
