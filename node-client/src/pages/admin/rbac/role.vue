<template>
     <div class="role-page">
         <by-title-line title = "角色列表"></by-title-line>
        <el-button type="primary" icon="el-icon-plus" @click='handleAdd(0)'>添加角色</el-button>
         <div class="table-contain">
             <el-table
            :data="listData"
            :cell-style = cellkey
            border
            @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column v-for="(itme,index) in table_header"
                :key="index"
                fixed
                :prop="itme.prop"
                :label="itme.label"
                :width="itme.width">
             </el-table-column>
              <el-table-column
                label="创建时间"

              >
                <template slot-scope="scope">
                    {{scope.row.createtime|dataFormat}}
                </template>
            </el-table-column>
              <el-table-column
                label="状态"
                width="80"
              >
                <template slot-scope="scope">
                    {{scope.row.status==1?"正常":(scope.row.status==2?"停用":'未知')}}
                </template>
            </el-table-column>
             <el-table-column
                    fixed="right"
                    label="操作"
                    width="300">
                    <template slot-scope="scope">
                          <el-button  size="mini" type="primary" @click="handleAuth(scope.row)">分配权限</el-button>
                        <el-button
                        size="mini"
                        @click="handleEdit( scope.row)">编辑</el-button>
                         <!-- <el-button
                         type="primary"
                        size="mini"
                        @click="handleAdd(scope.row)">添加子角色</el-button> -->
                         <el-button
                        size="mini"
                        :type="scope.row.status==1?'warning':'primary'"
                        @click="handleSwitch(1,scope.row)">   {{scope.row.status==1?"停用":"启用"}}</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete( scope.row)">删除</el-button>
                       
                    </template>
                    </el-table-column>
          </el-table>
            <div class="bottom-warp-left" style="margin-top:20px">
                 <el-button v-if="!(multipleSelection.filter(itme=>itme.status==1)).length" disabled>全部停用</el-button>
                 <el-button v-else type="danger" @click="handleSwitch('allStop')">全部停用</el-button>
                 <el-button v-if="!(multipleSelection.filter(itme=>itme.status==2)).length" disabled>全部启用</el-button>
                 <el-button v-else type="primary" @click="handleSwitch('allStart')">全部启用</el-button>
            </div>
        </div>
       
       
         <el-dialog 
            :title="addUpdateTitile"
            v-on:close="closeaddUpdateDialog()"
            :visible.sync="addUpdatedialog">
            <role-add-update
            :formData="formData"
             ref="addUpdateCompent"
             v-on:sureBtn="addUpdateHandle"
            ></role-add-update>
        </el-dialog>


         <el-dialog 
            title="分配权限"
             v-on:close="closeDialogEvent()"
            :visible.sync="assignAuthdialog">
            <role-assign-auth
            ref="assignAuthCompent"
            v-on:assginRoleEvent="assginRoleEvent"
             :roleId="aasginRoleId"
            ></role-assign-auth>
        </el-dialog>

    </div>
</template>
<script>
import fn from "@/util/fn";
import roleAssignAuth from "./roleAssignAuth";
import roleAddUpdate from "./roleAddUpdate";

export default {
    data(){
        return {
            addUpdatedialog:false,
            assignAuthdialog:false,
            addUpdateTitile:"",
            table_header:[//栏目头
                { "prop":"id","label":"角色ID","width":"65"},
                { "prop":"name","label":"角色名称(英文)","width":"auto"},
                { "prop":"title","label":"角色标题(中文)","width":"auto"},
                { "prop":"ptitle","label":"父级角色","width":"auto"},
                { "prop":"sort","label":"分类排序","width":"80"}
            ],
            listData:[], 
          
            rules:{ //子组件编辑规则
                "name":[ {required:true,message:"名称不能为空","trigger":"blur"}],
                "sort":[  { required: true, message: '排序不能为空'} ]
            },
            multipleSelection:[],//选中的数据
            aasginRoleId:"", //分配权限的角色Id
            formData:{id:'', name:"", title:"", handletype:"", status:true,sort:100},
        }
    },
    components:{//组件
        roleAssignAuth,
        roleAddUpdate
        // cateAdd
    },
    methods:{//事件
         //选中    
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
         handleEdit:function(data){//修改事件
            this.addUpdatedialog = true;
            this.addUpdateTitile = '编辑'+data.title;
            this.formData={id:data.id, name:data.name, title:data.title, handletype:"modify", status:true,sort:data.sort};
        },
        handleAdd:function(val){//添加事件
            this.addUpdatedialog = true;
            this.addUpdateTitile = "添加角色";
            this.formData={id:'', name:"", title:"", handletype:"add", status:true,sort:100};
        },
        handleDelete:function(val){//删除事件
            if(val.status==1){
               this.$message.error('正常状态无法删除...');
               return false;
           }
            this.$confirm("确定删除该角色", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.POST("rbacRoleDel",{id:val.id}).then((res)=>{
                    var data = res.data;
                    if(data.status){
                        this.$message.success(data.mssage||"delete is  success...");
                        this.getdata();
                    }else{
                        this.$message.error(data.mssage||'delete is fail...');
                    }
                }).catch((err)=>{
                    console.log(err)
                    this.$message.error('server is error...');
                })
                  
            }).catch(()=>{
                this.$message.error('cancel delete...');
            })
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
           
            this.$axios.POST("rbacRoleSwtich",{data}).then(res=>{
            
                var data = res.data;
               if(data.status){
                   
                    this.$message.success(data.mssage||"更新成功")
                   this.getdata();
               }else{
                    this.$message.error(data.mssage||"更新失败")
               }
              
           }).catch(err=>{
               console.log(err)
           })
         },
        cellkey:function({row,columnIndex}){
            if(Number(columnIndex)==2){
                if(Number(row.leve)>1){
                     return {"padding-left": 2*Number(row.leve-1) +"em"}
                }
            }
        },
        // 添加更新的子组件返回的数据
        addUpdateHandle(res){
            var {id,name,title,sort,status,handletype} = res;
            status = status?1:2;
           switch (handletype) {
                case "add":
                    this.sureAdd({name,title,sort,status});
                    break;
                case "modify":
                    this.sureUpdate({id,name,title,sort,status})
                    break;
                default:                   
                    break;
            }
        },
        // 确定修改
        sureUpdate:function(resdata){
           this.$confirm("确定修改角色", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                     this.$axios.POST("rbacRoleUpdate",resdata).then((res)=>{
                        var data = res.data;
                        if(data.status){
                            this.$message.success(data.mssage||"更新成功")
                            this.getdata();
                            setTimeout(() => {
                                this.addUpdatedialog = false;
                            }, 1000);
                        }else{
                            this.$message.error(data.mssage||"更新失败")
                        }
                       
                    }).catch((err)=>{
                        console.log(err)
                    })
                }).catch(()=>{
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });    
                })
        },
        sureAdd:function(resdata){//
            this.$axios.POST("rbacRoleAdd",resdata).then((res)=>{
                var data = res.data;
                if(data.status){
                   this.$message.success(data.mssage||"添加成功")
                    this.getdata();
                    setTimeout(() => {
                        this.addUpdatedialog = false;
                    }, 1000);
                }else{
                   this.$message.error(data.mssage||"添加失败")
                }
               
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 获取role列表数据
        getdata:function(){
           this.$axios.GET("rbacRole").then(res=>{
             
                var data = res.data;
                if(data.status){
                    this.listData= data.data;
                    if(!this.listData||this.listData.length==0) return;
                    this.listData.map(itme=>{
                       itme['ptitle'] = this.listData.map(val=>{ if(itme.pid==val.id){ return val.title } });
                    })
                   
                    this.listData = fn.recurOne(this.listData,"id","pid");
                   
                }
            }).catch((err)=>{
                  console.log(err)
            })
        },
      
        // 分配权限
        handleAuth(val){
            this.aasginRoleId = val.id;
            this.assignAuthdialog =  true;
        },
        // 提交分配权限
        assginRoleEvent(data){
            this.$axios.POST("rbacrRoleAssginAuth",{id:this.aasginRoleId,authArrId:data}).then(res=>{
                var data = res.data;
              
               if(data.status){
                   this.$message.success(data.mssage||"分配成功")
                   this.getdata();
               }else{
                   this.$message.error(data.mssage||"分配失败")

               }
                this.assignAuthdialog = false;
           }).catch(error=>{
               console.log(error)
           })
        },
        // 关闭分配auth的dialog,
        closeDialogEvent(){
            //  this.$refs['assignAuthCompent'].clearChecked();
        },
         // 关闭添加编辑role的dialog,
        closeaddUpdateDialog(){
             this.$refs['addUpdateCompent'].resetForm();
        },

    },
    
    created:function(){ 
        this.getdata();
    }
}
</script>
<style>
    .el-title{height: 22px;border-bottom:1px solid #a3ccf5; margin-bottom: 24px;}
    .el-title .el-text{line-height: 44px;padding: 0 10px;display: inline-block;margin-left: 20px;background: #fff;color: #666}
    .common-contain{margin-top: 24px;min-height: 360px;overflow-y: scroll;max-height: 600px;height: auto;}
    .defult-btn{border:none;display: inline-block;padding: 12px;cursor: pointer;box-shadow: 0 0 10px #989696;color: #716969;background: rgb(176, 236, 239);}
    .defult-btn:focus{outline: none}
</style>
