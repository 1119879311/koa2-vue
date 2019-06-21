<template>
   <div class="tab-view">
       <by-title-line :title ="titile"></by-title-line>
        <el-button  type="primary" icon="el-icon-plus" @click='handleAdd'>添加权限</el-button>
        <div style="margin:20px 0">
           
           <el-form :inline="true" :model="searchkey" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="searchkey.searchValueKey" placeholder="关键词搜索" @change="changeSearchKey"></el-input>
                </el-form-item>
                <el-form-item label="筛选分组">
                    <el-select v-model="searchkey.searchGruoukey" placeholder="请选择分组"  style="float:left;" @change="changeGroup">
                        <el-option label="请选择分组"  value="" ></el-option>
                        <el-option :label="itme" :value="itme" v-for="(itme,index) in authGruoupName" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                </el-form-item>
            </el-form>

        </div>

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
                width="55"
                prop="id"
                label="id"
            >
                </el-table-column>
                <el-table-column
                 width="200"
                prop="name"
                label="权限名称"
            >
            </el-table-column>
            <el-table-column
               width="200"
                prop="identName"
                label="权限标识"
            >
              </el-table-column>
            <el-table-column
              
                prop="url"
                label="权限链接"
            >
              </el-table-column>
            <el-table-column
                 width="200"
                prop="groupName"
                label="权限分组"
            >
             <template slot-scope="scope">
                {{scope.row.groupName?scope.row.groupName:"未分组"}}
            </template>
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
                    width="150"
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
                    <el-button  size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button
                            size="mini"
                            :type="scope.row.status==1?'warning':'primary'"
                            @click="handleSwitch(1,scope.row)">  {{scope.row.status==1?"停用":"启用"}}</el-button>
                    <el-button  size="mini"  type="danger" @click="handleDel(scope.row)" >删除</el-button>
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
            :title="apdialogTiele"
            :visible.sync="addUpdatedialog"
             v-on:close="closeDialogEvent()">
            <auth-add-update
              ref="addUpdateCompent"
              v-on:sureBtn="sureBtn"
             :formData="formData"
             :groupName="authGruoupName"
            ></auth-add-update>
        </el-dialog>

   </div>
</template>
<script>
import authAddUpdate from "./authAddUpdate";
export default {
   data(){
       return {
            titile:"权限列表",
            apdialogTiele:"",
            addUpdatedialog:false,
            tableData: [],
            tabAllData:[],
            formData:{id:"",name:"",identName:"",url:"",groupName:"",status:true},
            multipleSelection:[],//选中的数据
            authGruoupName:[],
            searchkey:{
                searchGruoukey:"",
                searchValueKey:""
            }
            
       }
   },
   watch: {
       "searchkey.searchValueKey":function(newValue, oldValue) {
            if(newValue){
                var reg = new RegExp(""+newValue+"","gi");
                var arr = [];
                this.tabAllData.forEach(itme=>{
                    if(itme.name.search(reg)!=-1||itme.identName.search(reg)!=-1||itme.url.search(reg)!=-1||itme.groupName.search(reg)!=-1){
                        arr.push(itme)
                    }

                })
                this.tableData=arr;
            }else{
                this.tableData=this.tabAllData;
            }
       }
   },
   components:{
       authAddUpdate
   },
   methods:{
        //选中    
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        //添加
       handleAdd:function(){
           this.addUpdatedialog = true
           this.apdialogTiele ="添加权限";
           this.formData={id:"",name:"",identName:"",url:"",groupName:"",status:true};
           this.formData.type = "add";
       },
        //编辑    
       handleEdit:function(val){
            this.addUpdatedialog = true
            this.apdialogTiele =`修改权限---${val.name}`;
            this.formData = val;
            this.formData.status = val.status==1?true:false;
            this.formData.type = "modify";
       },
        
        sureBtn:function(res){
           var {id,name,identName,url,groupName,status} = res;
            var status = status?1:2;
            switch (res.type) {
                case "add":
                    this.sureAdd({name,identName,url,groupName,status});
                    break;
                case "modify":
                    this.sureModify({id,name,identName,url,groupName,status})
                    break;
                default:
                     this.addUpdatedialog = false;
                    break;
            }
           
       },
        //确认添加    
       sureAdd:function(option){
          this.$axios.POST("rbacAuthAdd",option).then(res=>{
               var data = res.data;
               if(data.status){
                   this.$message.success(data.mssage||'add is success...');
                   this.getListData();
                   setTimeout(() => {
                        this.addUpdatedialog = false;
                   }, 1000);
               }else{
                     this.$message.error(data.mssage||'add is fail...');
               }
           }).catch((error)=>{
                console.log(error)
           })
       },
        //确认修改    
       sureModify:function(option){
           this.$axios.POST("rbacAuthUpdate",option).then(res=>{
                var data = res.data;
               if(data.status){
                  this.$message.success(data.mssage||'update is success...');
                   this.getListData();
                   setTimeout(() => {
                        this.addUpdatedialog = false;
                   }, 1000);
               }
               
           }).catch((error)=>{
                console.log(error)
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
           this.$axios.POST("rbacAuthSwtich",{data}).then(res=>{
                var data = res.data;
               if(data.status){
                   this.$message.success(data.mssage||'update is success...');
                   this.getListData();
               }
           })
           
       },
        //删除auth    
       handleDel:function(val){
          
           if(val.status==1){
               this.$message.error('正常状态无法删除...');
               return false;
           }
           this.$confirm("确定删除该数据", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.POST("rbacAuthDel",{id:val.id}).then((res)=>{
                    var data = res.data;
                     if(data.status){
                        this.$message.success(data.mssage||'delete is success...');
                        this.getListData();
                    }else{
                       
                    }
                }).catch(error=>{
                    console.log(error)
                })
            }).catch(()=>{
                this.$message.error('cancel delete...');
            })

       },
       //获取auth 数据
       getListData:function(){
           this.$axios.GET("rbacAuth").then((res)=>{
                var data =res.data;
                if(data.status){
                    this.tabAllData = data.data;
                    this.tableData = data.data;
                    this.authGruoupName = [...new Set(data.data.map(itme=>itme.groupName))];
                   
                }else{
                    this.tableData = [];
                }
            }).catch(error=>{
                console.log(error)
            })
       },
        // 关闭添加编辑auth的dialog,
        closeDialogEvent(){
             this.$refs['addUpdateCompent'].resetForm();
        },
        //分组筛选搜索
        changeGroup:function(val){
           
            if(val){
                this.tableData=this.tabAllData.filter(itme=>itme.groupName==val);
            }else{
                 this.tableData=this.tabAllData;
            }
        },
        // 关键词输入搜索
        changeSearchKey:function(val){
            
        }
   },
   created(){
      this.getListData();
   }
}
</script>
<style>
.tab-view .el-table {margin: 10px 0}
.tab-view .el-table td, .el-table th{padding: 8px 0}

</style>


