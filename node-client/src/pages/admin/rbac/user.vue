<template>
   <div class="user-view">
       <by-title-line :title = "titile"></by-title-line>
        <el-button  type="primary" icon="el-icon-plus" @click='tabAddClick'>添加用户</el-button>
         <div class="table-contain">
        <el-table
            :data="userData"
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
            prop="name"
            label="名称"
           >
            </el-table-column>
             <el-table-column
            prop="contact"
            label="联系方式"
           >
            </el-table-column>
              <el-table-column
            prop="isroot"
            label="是否是超级用户"
           >
            <template slot-scope="scope">
                    {{scope.row.isroot==1?"是":"不是"}} 
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
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createtime|dataFormat}}
                </template>
            </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="180">
            <template slot-scope="scope" >
              
                <el-dropdown size="mini"  type="primary" trigger="click" style="margin-right:12px">
                    <el-button size="mini" type="primary">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                    <el-dropdown-menu slot="dropdown">
                            <el-button v-if="scope.row.isroot!==1"  size="mini" type="primary"  @click="handleRole(scope.row)">分配角色</el-button>
                            <el-button  size="mini" type="primary" @click="editTab(scope.row)">修改</el-button>
                        
                            <el-button v-if="scope.row.isroot!==1"
                                    size="mini"
                                    :type="scope.row.status==1?'warning':'primary'"
                                    @click="handleSwitch(1,scope.row)">  {{scope.row.status==1?"停用":"启用"}}
                            </el-button>
                    </el-dropdown-menu>
                </el-dropdown>

                 <el-button v-if="scope.row.isroot!==1"  size="mini"  type="danger" @click="deteleTab(scope.row)" >删除</el-button>

            </template>
            </el-table-column>
        </el-table>
         <div class="bottom-warp">
             <div class="bottom-warp-left"  style="margin-top:20px">
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
            >
            </el-pagination>
              
        </div>
         </div>
        
       
        <el-dialog 
            :title="PopTitle"
            :visible.sync="userdialog"
            v-on:close="closeDialogEvent()">
            <user-add-update 
            :formData="formData"
             v-on:sureBtn="sureBtn"
             ref="userAddUpdateCompent"
            ></user-add-update>
        </el-dialog>
         <el-dialog 
            title="分配角色"
            :visible.sync="assignRoledialog">
            <user-assign-roles
            :prorsRoleCheck="roleList"
            v-on:assginRoleEvent="assginRoleEvent"
            ></user-assign-roles>
        </el-dialog>

   </div>
</template>
<script>
import userAddUpdate from "./userAddUpdate";
import userAssignRoles from "./userAssignRoles";

export default {
   data(){
       return {
            titile:"管理员列表",
            PopTitle:"",
            userdialog:false,
            assignRoledialog:false,
            userData: [ ],
            formData:{id:'', name:"", contact:"", type:"", status:true,},
            multipleSelection:[],//选中的数据
            roleList:[],//用户的角色数据
            addRoleUserid:"",//分配角色的用户id
            count:0,
            pageConfig:{
                curernetPage:1,//当前页，
                pageSize:20,//每页个数，
                pagerCount:4
            },
       }
   },
   components:{
       userAddUpdate,
       userAssignRoles
   },
   methods:{
       
        handleSizeChange(val) {
           this.pageConfig.pageSize = val;
        },
        handleCurrentChange(val) {
            this.pageConfig.curernetPage = val;
            this.getUserbData()
        },
        //编辑用户的关闭弹窗的回调
        closeDialogEvent(){
            this.$refs['userAddUpdateCompent'].resetForm();
        },    
        //选中    
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        // 设置表单数据
        setFormData(data={}){
            this.formData.id =data.id||"";
            this.formData.name = data.name||"";
            this.formData.contact = data.contact||"";
            this.formData.password = data.password||"";
            this.formData.type = data.type||"";
            this.formData.status = data.status==1?true:false;
        },
        //添加
       tabAddClick:function(){
            this.PopTitle ="添加管理员"
            this.userdialog = true;
            this.setFormData({type:"add"})
       },
        //编辑    
       editTab:function(val){
            this.PopTitle =`修改管理员---${val.name}`
            this.userdialog = true;
            this.setFormData(Object.assign(val,{type:"modify"}))
          
       },
        
        sureBtn:function(flag,res){
            if(!flag){
                this.$message({
                    showClose:true,
                    message:"数据填写有误",
                    type:"error"
                })
                return false;
            }
            var {id,name,password,contact,status,type} = res;
            var status = status?1:2;
           
            switch (type) {
                case "add":
                    this.sureAdd({name,password,contact,status});
                    break;
                case "modify":
                    this.sureModify({id,name,contact,status})
                    break;
                default:
                     this.tabAdddialog = false;
                    break;
            }
           
       },
        //确认添加    
       sureAdd:function(option){
          this.$axios.POST("rbacUserAdd",option).then(res=>{
               var data = res.data;
               if(data.status){
                   this.$message.success(data.mssage||"add is  success...");
                   this.getUserbData();
                   setTimeout(() => {
                        this.userdialog = false;
                   }, 1000);
               }else{
                    this.$message.error(data.mssage||"add is  fail...");
                    var tiptype = "error";
               }
              
           }).catch((error)=>{
               console.log(error)
                
           })
       },
        //确认修改    
       sureModify:function(option){
           this.$axios.POST("rbacUserUpdate",option).then(res=>{
              
                var data = res.data;
               if(data.status){
                    this.$message.success(data.mssage||"更新成功")
                   this.getUserbData();
                   setTimeout(() => {
                        this.userdialog = false;
                   }, 1000);
               }else{
                    this.$message.success(data.mssage||"更新失败")
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
           this.$axios.POST("rbacUserSwtich",{data}).then(res=>{
                var data = res.data;
               
               if(data.status){
                    this.$message.success(data.mssage||"更新成功")
                   this.getUserbData();
               }else{
                    this.$message.success(data.mssage||"更新失败")
                   
               }
              
           }).catch(error=>{
               console.log(error)
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
               this.$axios.POST("rbacUserDel",{id:val.id}).then((res)=>{
                    var data = res.data;
                   
                     if(data.status){
                         this.$message.success(data.mssage||"delete is success") 
                        this.getUserbData();
                    }else{
                         this.$message.error(data.mssage||"delete is fail") 
                    }
                }).cath(err=>{
                       console.log(err)
                       this.$message.error('server  is error...');
                  
                })
            }).catch(()=>{
                // this.$message.error('cancel delete...');
            })

       },
        // 获取用户列表
       getUserbData:function(){
           this.$axios.GET("rbacUser",{page:this.pageConfig.curernetPage,limit:this.pageConfig.pageSize,a_status:0}).then((res)=>{
                var data =res.data;
                if(data.status){
                    this.count = data.count;
                    this.userData = data.data;
                }else{
                    this.userData = [];
                }
               
            }).catch((err)=>{
                console.log(err)
            })
       },
        //分配角色
        handleRole(val){
          
            this.roleList = val.role.filter(itme=>itme.status==1).map(itme=>itme.name);
         
            this.addRoleUserid = val.id;
            this.assignRoledialog = true;
        },
        //提交角色
        assginRoleEvent(res){
            this.$axios.POST("rbacUserAssginRole",{id:this.addRoleUserid,roleArrId:res}).then(res=>{
                var data = res.data;
               if(data.status){
                    this.$message.success(data.mssage||"分配成功") 

                   this.getUserbData();
               }else{
                    this.$message.error(data.mssage||"分配失败") 
                    var tiptype = "error";
               }
                 this.assignRoledialog = false;
           }).catch(error=>{
               console.log(error)
           })
        }  
   },
   created(){
      this.getUserbData();
   }
}
</script>
<style>
.bottom-warp{
    display: flex;
    justify-content:space-between;
}
.tab-view .el-table {margin: 10px 0}
.tab-view .el-table td, .el-table th{padding: 8px 0}
</style>


