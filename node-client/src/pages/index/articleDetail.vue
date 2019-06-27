<template>
  <div class="detail-view">
       <div class="content-main" v-if="status">
           <div class="article-title">
                <h3 class="title">{{articleData.title}}</h3>
                <p><span> 发布时间: {{articleData.createtime|dataFormat}}</span>&nbsp;&nbsp;
                    <span> 阅读量: {{articleData.readcount}}</span>
                <span> 分类: <router-link tag="a" :to="{path:'/index',query:{cid:articleData.cid}}">{{articleData.c_name}}</router-link></span>&nbsp;&nbsp;</p>
            </div>
            <!-- <div class="article-thuming" v-if="articleData.thumimg"> <img :src="articleData.thumimg"  :onerror="errorImg"  class="max-respose"></div> -->
            <!-- <div class="article-remark">{{articleData.remark}}</div> -->
            <div class="article-comtents" v-html="articleData.content" v-highlight> </div>
            <div class="article-tab">标签：
                <el-tag v-for="(tabItme,index) in articleData.tab" :key="index"><router-link tag="a" :to="{path:'/index',query:{tid:tabItme.id}}" >{{tabItme.name}}</router-link></el-tag>
            </div>
            <hr class="hr" style="border:none;height:1px;background:#009688" />
            <div class="next-prev-info">
                <p v-if="articleData.prevInfo" class="p-left">上一篇:<router-link tag="a" :to="{name:'articleDetail',params:{id:articleData.prevInfo.id}}"> {{articleData.prevInfo.title}}</router-link></p>
                <p v-if="articleData.nextInfo" class="p-right">下一篇:<router-link tag="a" :to="{name:'articleDetail',params:{id:articleData.nextInfo.id}}"> {{articleData.nextInfo.title}}</router-link></p>
            </div>
       </div>
         <!-- <div class="no-data" v-else>
            <p>{{nodata}}</p>
        </div> -->
  </div>
</template>
<script>
export default {
    data(){
        return {
             errorImg:'this.src="'+require('@/assets/images/silder.jpg')+'"',
             status:false,
             articleData:{},
             nodata:""
        }
    },
    watch:{
        $route(to,form){
             this.getDetail(to.params.id)
        }
    },
    methods:{
        getDetail(id){
            if(!id) return false;
             this.$axios.GET("blogDetail",{id,is_tab:1,addRead:true}).then(res=>{
                 var data = res.data;
                 this.status = data.status;
                if(data.status){
                  this.articleData = data.data;
                }
            })
        }
    },
    created(){
        this.getDetail(this.$route.params.id)
    }
}
</script>
<style>
.detail-view pre{background: #23241f;overflow:auto;font-family: Arial, Helvetica, sans-serif;width:100%; padding: 12px; border-radius: 4px;
font-weight: 700;font-size: 16px;line-height:28px;margin:10px auto;box-shadow: 0px 0px 10px #000;
border-left: 10px #19ccbb solid;}
.detail-view .content-main{width: 96%;max-width: 1250px;margin:0px auto;padding: 30px 0}
.detail-view .article-title{text-align: center}
.detail-view .article-title .title{font-size: 24px;color: #009688;line-height: 36px;border-bottom: 1px solid #eee}
.detail-view .article-title p{line-height: 28px;color: #666;margin:10px auto}
.detail-view .article-title p span{padding-left:15px}
.detail-view .article-title p a{color: rgb(244, 150, 3)}
.detail-view .article-title p a:hover{color: #008678}
.detail-view .article-remark{font-size: 18px;color: #333;margin: 20px 0;text-indent: 2em;line-height: 28px}
.detail-view .article-thuming{width: 100%;overflow: hidden;cursor: pointer;margin: 20px auto}
.detail-view .article-thuming img{transition:  all 0.5s;max-width: 600px;display: block;margin: 10px auto;box-shadow: 2px 2px 20px #333;}
.detail-view .article-tab{margin: 12px auto}
.detail-view .article-tab .el-tag{margin-right: 12px}
.article-comtents{color: #666;line-height: 28px;font-size: 14px;width: 100%;word-wrap: break-word}
.article-comtents table td{border: 1px solid #eee;padding: 8px;line-height: 28px;}
.no-data{text-align: center;color:  #999;font-size: 20px;padding: 20px;margin: 20px auto;box-shadow: 0px 3px 2px #999}
.next-prev-info{margin: 10px auto;overflow: hidden}
.next-prev-info .p-left{float: left}
.next-prev-info .p-right{float: right}
.next-prev-info a{color: #4a4848;font-size: 18px;}
.next-prev-info a:hover{color: #008678}
.detail-view .article-comtents img{
    max-width: 90% !important;
    display: block;
    margin: auto;
    margin:6px auto;
}
@media screen and (max-width: 768px) {
    .detail-view .article-title .title{font-size: 16px}
    .detail-view .article-title p{font-size: 14px}
    .next-prev-info p.p-left,.next-prev-info p.p-right{float:none !important}
    .next-prev-info p,.next-prev-info a{font-size: 14px}
    .article-thuming .max-respose{width: 98%}      
}
</style>


