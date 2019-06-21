<template>
   <div class="post-list">
       <div v-if="articleData.length">
            <ul class="list-contain" >
                <li class="list-itme my-flex" v-for="(itme,index) in articleData" :key="index">
                    <router-link :to="{name:'articleDetail',params:{id:itme.id}}" tag="a">
                        <div class="m-flex post-itme-main">
                            <div class="post-thming" v-if="itme.thumimg">
                                <el-popover
                                    placement="right"
                                    width="500"
                                    trigger="hover">
                                    <div class="popimg-warp">
                                    <img :src="itme.thumimg" class="max-respose" :onerror="errorImg">
                                    </div>
                                    <img :src="itme.thumimg" slot="reference"  :onerror="errorImg"  class="img-respose">
                                </el-popover>
                                </div>
                            <div class="f-col-auto right-content">
                                <h3 class="post-title">{{itme.title}}</h3>
                                <div class="post-remark">{{itme.remark}}</div>
                                <div class="post-cate" v-if="itme.cstatus==1">
                                    分类 : <router-link :to="{name:'catePage'}" tag="span">{{itme.cname}}</router-link>
                                </div>
                                <p class="p-detail-more"><span>{{itme.createtime|dataFormat}}&nbsp;&nbsp;</span><span>阅读量:{{itme.readcount}}&nbsp;&nbsp;</span></p>
                            </div>
                        </div>
                    </router-link>
                </li>
            </ul>
             <el-pagination
                 background
                @current-change="handleCurrentChange"
                :current-page="pageConfig.curernetPage"
                :page-size="pageConfig.pageSize"
                layout=" prev, pager, next,total"
                :total="pageConfig.total">
                </el-pagination>
       </div>
        
    </div>
</template>
<script>
export default {
    data(){
        return {
            errorImg:'this.src="'+require('@/assets/images/silder.jpg')+'"',
            articleData:[],
            pageConfig:{
                 curernetPage:1,//当前页，
                 pageSize:10,//每页个数
                 total:100
            },
            nodata:"暂无数据"
        }
    },
   watch:{
        $route(to,form){
            this.getArticleData(to.query)
        },
        
    },
    methods:{
       
        getArticleData:function(type){
            var option = {page:this.pageConfig.curernetPage,limit:this.pageConfig.pageSize};
            if(type&&type.cid){
                option['cateId'] = type.cid
            }else if(type&&type.tid){
                option['tabId'] = type.tid
            }else if(type&&type.search){
                 option['search'] = type.search
            }
          
            this.$axios.GET("blogArticle",option).then(res=>{
                var data = res.data;
                if(data.status){
                  this.pageConfig.total = data.count;
                  this.articleData = data.data;    
                }
            })
        },
         handleCurrentChange(val) {
             this.pageConfig.curernetPage = val;
             this.getArticleData(this.$route.query);
         },
        onScroll:function(e){
            var scrollHeight = document.documentElement.scrollHeight;
            var clientHeight = document.documentElement.clientHeight;
            var scrollTop =  document.documentElement.scrollTop;
            if((scrollHeight-clientHeight-scrollTop)<=100){
            
            }
        }
    },
    mounted:function(){
        this.$nextTick(function(){
            window.addEventListener("scroll",this.onScroll,false)
        })
    },
    created(){
        
        this.getArticleData(this.$route.query)
    }
}
</script>
<style>
.post-list a{color: #4ebaf2;display: block}
.post-list .list-itme{padding:10px;border:1px solid #009688;margin-bottom:5px;transition:all 0.8s;margin-bottom: 30px;background: rgba(255, 255, 255, 0.2);border-radius: 8px}
.post-list .list-itme:hover{border: 1px solid #009688;box-shadow: 0px 0px 30px #009688}
.post-list .list-itme:hover{color: #009688}
.post-list .post-thming{max-width: 180px;width: 25%; min-width:120px; margin-right: 20px;display: flex;align-items: center;overflow: hidden}
.post-list .post-thming img{transition:all 0.8s}
.post-list .post-thming:hover img{transform: scale(1.8);transition:all 0.8s}
.post-list .post-itme-main{padding: 10px 0;}
.post-list .right-content{margin-left: 20px;flex: 1;display: flex;flex-direction: column;justify-content: flex-start}
.post-list .post-title{font-size: 18px;font-weight:normal}
.post-list .post-remark{color: #444;font-size: 16px;line-height: 32px;margin: 10px 0;word-wrap:break-word }
.post-list .post-cate{color: #999;font-size: 14px}
.post-list .post-cate span{color: #009688}
.post-list .p-detail-more{color: #666;font-size: 14px;margin-top: 10px;margin-right: 10px;text-align: right;width: 100%;}
.post-list .p-detail-more a:hover{color: #009688}
.post-list .el-pagination{text-align: right;margin: 12px auto}
.el-pagination.is-background .el-pager li:not(.disabled).active{border-radius: 50%;background: #4ebaf4}
.no-data{text-align: center;color:  #999;font-size: 20px;padding: 20px;margin: 20px auto}

@media screen and (max-width: 768px){
    .post-list .post-remark{ text-align: justify;line-height: 20px;display: -webkit-box; overflow: hidden; white-space: normal!important; text-overflow: ellipsis;word-wrap: break-word; -webkit-line-clamp: 2; -webkit-box-orient: vertical;}
    .post-list .post-title a{font-size: 14px;word-wrap: normal;word-break: normal}
}

</style>



