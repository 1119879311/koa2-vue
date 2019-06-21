<template>
   <div class="tab-view">
       <by-title-line :title = "titile"></by-title-line>
        <el-button  type="primary" icon="el-icon-plus" @click='tabAddClick'>添加标签</el-button>
        <div class="table-contain">
        <el-table
            :data="tableData"
            border
            @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
            prop="id"
            label="id"
           >
            </el-table-column>
            <el-table-column
            prop="name"
            label="标签名称"
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
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createtime|dataFormat}}
                </template>
            </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="230">
            <template slot-scope="scope">
                <el-button  size="mini" type="primary" @click="editTab(scope.row)">编辑</el-button>
                  <el-button
                        size="mini"
                        :type="scope.row.status==1?'warning':'primary'"
                        @click="handleSwitch(1,scope.row)">  {{scope.row.status==1?"停用":"启用"}}</el-button>
                <el-button  size="mini"  type="danger" @click="deteleTab(scope.row)" >删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        </div>
        <div class="bottom-warp-left"  style="margin-top:20px">
                 <el-button v-if="!(multipleSelection.filter(itme=>itme.status==1)).length" disabled>全部停用</el-button>
                 <el-button v-else type="danger" @click="handleSwitch('allStop')">全部停用</el-button>
                 <el-button v-if="!(multipleSelection.filter(itme=>itme.status==2)).length" disabled>全部启用</el-button>
                 <el-button v-else type="primary" @click="handleSwitch('allStart')">全部启用</el-button>
        </div>
        <el-dialog 
            :title="tabTitle"
            :visible.sync="tabAdddialog">
            <tab-add-update 
            :formData="formData"
            :rules ="rules"
             v-on:sureBtn="sureTabBtn"
            ></tab-add-update>
        </el-dialog>

   </div>
</template>
<script>
import tabAddUpdate from "./tabAddUpdate";
export default {
   data(){
       return {
            titile:"标签列表",
            tabTitle:"",
            tabAdddialog:false,
            tableData: [
                // {id:1,name:"无名",status:2}
            ],
            formData:{
                id:'',
                name:"",
                type:"",
                status:true,
            },
            rules:{
                  "name":[
                    {required:true,message:"标签名称不能为空","trigger":"blur"}
                ],
            },
            multipleSelection:[],//选中的数据
       }
   },
   components:{
       tabAddUpdate
   },
   methods:{
        //选中    
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        //添加
       tabAddClick:function(){
            this.tabTitle ="添加标签"
            this.tabAdddialog = true;
            this.formData.id="";
            this.formData.name = "";
            this.formData.type = "add";
       },
        //编辑    
       editTab:function(val){
            this.tabTitle =`修改标签---${val.name}`
            this.tabAdddialog = true;
            this.formData.id=val.id;
            this.formData.name = val.name;
            this.formData.status = val.status==1?true:false;
            this.formData.type = "modify";
       },
        
        sureTabBtn:function(flag,res){
            if(!flag){
                this.$message({
                    showClose:true,
                    message:"数据填写有误",
                    type:"error"
                })
                return false;
            }
            var status = res.status?1:2;
            switch (res.type) {
                case "add":
                    this.sureAdd(res.name,status);
                    break;
                case "modify":
                    this.sureModify(res.id,res.name,status)
                    break;
                default:
                     this.tabAdddialog = false;
                    break;
            }
           
       },
        //确认添加    
       sureAdd:function(name,status){
          this.$axios.POST("blogTabAdd",{name,status}).then(res=>{
               var data = res.data;
               if(data.status){
                    this.$message.success(data.mssage||"add is  success...");
                   this.getTabData();
                   setTimeout(() => {
                        this.tabAdddialog = false;
                   }, 1000);
               }else{
                    this.$message.error(data.mssage||"add is fail")
                   
               }
           }).catch((error)=>{
                console.log("server is error")
           })
       },
        //确认修改    
       sureModify:function(id,name,status){
           this.$axios.POST("blogTabUpdate",{id,name,status}).then(res=>{
                var data = res.data;
               if(data.status){
                    this.$message.success(data.mssage||"update is success")
                  
                   this.getTabData();
                   setTimeout(() => {
                        this.tabAdddialog = false;
                   }, 1000);
               }else{
                    this.$message.error(data.mssage||"update is fail")
               }
              
           }).catch((error)=>{
                console.log("server is error")
           })
       },
         // 状态修改   
       handleSwitch(val,rowdata){
           var data = [];
           switch (val) {
               case 1:
                    var status = rowdata.status==2?1:2;
                    data = [{id:rowdata.id,status}]
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
           this.$axios.POST("blogTabSwtich",{data}).then(res=>{
            
                var data = res.data;
               if(data.status){
                   this.$message.success(data.mssage||"update is success")
                   this.getTabData();
               }
           })
           
       },
       deteleTab:function(val){
          
           if(val.status==1){
               this.$message.error('正常状态无法删除...');
               return false;
           }
           this.$confirm("确定删除该数据", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.POST("blogTabDel",{id:val.id}).then((res)=>{
                    var data = res.data;
                     if(data.status){
                         this.$message.success(data.mssage||"delete is success")

                        this.getTabData();
                    }else{
                        this.$message.error(data.message||"delete is fail");
                    }
                })
            }).catch(()=>{
                this.$message.error('cancel delete...');
            })

       },

       getTabData:function(){
           this.$axios.GET("blogTab",{status:0}).then((res)=>{
                var data =res.data;
                if(data.status){
                    this.tableData = data.data;
                }else{
                    this.tableData = [];
                }
            }).catch((err)=>{
                console.log("server is error")
            })
       }
   },
   created(){
      this.getTabData();
   }
}
</script>
<style>
.tab-view .el-table {margin: 10px 0}
.tab-view .el-table td, .el-table th{padding: 8px 0}
</style>


