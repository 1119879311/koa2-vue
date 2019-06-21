<template>
    <div class="article-page">
        <by-title-line :title = "titile"></by-title-line>
         <router-link :to="{ path:'/admin/blog/articleAdd'}"><el-button type="primary" icon="el-icon-plus">添加帖子</el-button></router-link> 
          <div class="table-contain">
          <el-table
            :data="tableData"
            style="width: 100%;margin:20px 0"
             border
            :default-sort = "{prop: 'id', order: 'descending'}"
             @selection-change="handleSelectionChange"
            >
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="id"
                label="ID"
                width="120"
                sortable>
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题"
               >
            </el-table-column>
             <el-table-column
                prop="cname"
                label="所属分类"
               >
            </el-table-column>
            <el-table-column
                label="状态"
                width="100"
              >
                <template slot-scope="scope">
                    {{scope.row.status==1?"正常":(scope.row.status==2?"停用":'未知')}}
                </template>
            </el-table-column>

            <el-table-column
                label="创建时间"

              >
                <template slot-scope="scope">
                    {{scope.row.createtime|dataFormat}}
                </template>
            </el-table-column>
             <el-table-column
                prop="readcount"
                label="访问量"
                 width="120">
            </el-table-column>
             <el-table-column
                fixed="right"
                label="操作"
                width="230"
               >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                         <el-button
                        size="mini"
                        :type="scope.row.status==1?'warning':'primary'"
                        @click="handleSwitch(1,scope.row)">  {{scope.row.status==1?"停用":"启用"}}</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="delArticle(scope.$index, scope.row)">删除</el-button>
                   
                </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="bottom-warp">
            
            <div class="bottom-warp-left">
                 <el-button v-if="!(multipleSelection.filter(itme=>itme.status==1)).length" disabled>全部停用</el-button>
                 <el-button v-else type="danger" @click="handleSwitch('allStop')">全部停用</el-button>
                 <el-button v-if="!(multipleSelection.filter(itme=>itme.status==2)).length" disabled>全部启用</el-button>
                 <el-button v-else type="primary" @click="handleSwitch('allStart')">全部启用</el-button>
                
            </div>
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageConfig.curernetPage"
                :page-size="pageConfig.pageSize"
                layout="pager, jumper , total"
                :total="count"
                :pagerCount="pageConfig.pagerCount"
            >
            </el-pagination>
              
        </div>
    </div>
</template>

<script>
export default {

    data(){
        return {
            titile:"帖子列表",
            tableData:[],
            count:1000,
            pageConfig:{
                curernetPage:1,//当前页，
                pageSize:20,//每页个数，
                pagerCount:5
            },
            multipleSelection:[],
        }
    },
    methods:{
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
         handleSizeChange(val) {
           this.pageConfig.pageSize = val;
        },
        handleCurrentChange(val) {
            this.pageConfig.curernetPage = val;
            this.getArticle()
        },
        handleEdit(index,val){
            this.$router.push({name:"articleUpdate",params:{id:val.id}})
        },
        handleSwitch(val,rowdata){
           var data = [];
           switch (val) {
               case 1:
                    var status = rowdata.status==2?1:2;
                    data = [{id:rowdata.id,status,pid:rowdata.pid}]
                   break;
                 case "allStop":
                   this.multipleSelection.forEach(itme=>{ if(itme.status!=2){ data.push(  {id:itme.id,status:2} )} })
                   break;
                 case "allStart":
                   this.multipleSelection.forEach(itme=>{ if(itme.status!=1){ data.push(  {id:itme.id,status:1} )} })                 
                   break;
               default:
                   break;
           }
           this.$axios.POST("blogArticlebSwtich",{data}).then(res=>{
            
                var data = res.data;
               if(data.status){
                   this.$message.success(data.mssage||'updata is success...');
                   this.getArticle()
               }else{
                    this.$message.error(data.mssage||'updata is fail...');

               }
              
           })
         },
      getArticle(){
            this.$axios.GET("blogArticle",{page:this.pageConfig.curernetPage,limit:this.pageConfig.pageSize,a_status:0}).then(res=>{
                var data = res.data;
                if(data.status){
                  this.count = data.count;
                  this.tableData = data.data;
                   
                }
            }).catch((err)=>{
                  console.log("server is error")
            })
      },
     
      delArticle(index,val){
           if(val.status==1){
               this.$message.error('正常状态无法删除...');
               return false;
           }
           this.$confirm("确定删除该数据", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.POST("blogArticlebDel",{id:val.id}).then((res)=>{
                    var data = res.data;
                     if(data.status){
                         this.$message.success(data.mssage||'delete is success...');
                           
                        this.getArticle()
                    }else{
                        this.$message.error(data.mssage||'delete is fail...');
                    }
                }).catch((err)=>{
                  console.log("delete is fail,server is error")
              })
                  
            }).catch(()=>{
                this.$message.error('cancel delete...');
            })
      }
    },
    created(){
        this.getArticle()
    }
}
</script>

<style scoped>
.bottom-warp{
    display: flex;
    justify-content:space-between;
}
</style>