<template>
     <div class="cate-page">
         <by-title-line title = "分类列表"></by-title-line>
        <el-button type="primary" icon="el-icon-plus" @click='handleAdd(0)'>添加栏目</el-button>
        <div class="table-contain">
             <el-table
            :data="cate"
            :cell-style = cellkey
            border
            @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column v-for="(itme,index) in cate_header"
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
                width="100"
              >
                <template slot-scope="scope">
                    {{scope.row.status==1?"正常":(scope.row.status==2?"停用":'未知')}}
                </template>
            </el-table-column>
             <el-table-column
                    fixed="right"
                    label="操作"
                    width="330">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit( scope.row)">编辑</el-button>
                         <el-button
                         type="primary"
                        size="mini"
                        @click="handleAdd(scope.row)">添加子分类</el-button>
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
        </div>
        <div class="bottom-warp-left" style="margin-top:20px">
                 <el-button v-if="!(multipleSelection.filter(itme=>itme.status==1)).length" disabled>全部停用</el-button>
                 <el-button v-else type="danger" @click="handleSwitch('allStop')">全部停用</el-button>
                 <el-button v-if="!(multipleSelection.filter(itme=>itme.status==2)).length" disabled>全部启用</el-button>
                 <el-button v-else type="primary" @click="handleSwitch('allStart')">全部启用</el-button>
        </div>
        <el-dialog 
            :title="editTitle"
            :visible.sync="cataEditdialog" >
                <cate-update
                :datas ="editData"
                :rules = "rules" v-on:modifyBtn="modifyBtn"></cate-update>
        </el-dialog>
         <el-dialog 
            :title="addTitle"
            :visible.sync="cataAdddialog">
            <cate-add 
            :datas="addData"
            :rules ="rules"
            v-on:addCateBtn="addCateBtn"
            ></cate-add>
        </el-dialog>

    </div>
</template>
<script>
import fn from "@/util/fn";
import cateAdd from "./cateAdd";
import cateUpdate from "./cateUpdate";
export default {
    data(){
        return {
            cataEditdialog:false,
            cataAdddialog:false,
            cate_header:[//栏目头
                { "prop":"id","label":"ID","width":"80"},
                { "prop":"name","label":"名称","width":"auto"},
                { "prop":"leve","label":"分类等级"},
                { "prop":"sort","label":"分类排序","width":"auto"}
            ],
            cate:[
                // {id:1,name:"前端",leve:1,sort:100,status:1,pid:0}
            ], //栏目数据
            editData:{//子组件编辑数据，
                id:"",
                name:"",
                sort:"",
                status:true,
                pid:0,
                catelist:""
            },
            editTitle:"",
            addData:{  //子组件添加的数据，
                name:"",
                pid:0,
                pname:"",
                sort:100,
                status:true,
            },
            addTitle:"",
            rules:{ //子组件编辑规则
                "name":[
                    {required:true,message:"分类名称不能为空","trigger":"blur"}
                ],
                "sort":[
                    { required: true, message: '排序不能为空'}
                ]
            },
            multipleSelection:[],//选中的数据
        }
    },
    components:{//组件
        cateUpdate,
        cateAdd
    },
    methods:{//事件
         //选中    
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
         handleEdit:function(data){//修改事件
            this.editTitle = '编辑'+data.name
            this.cataEditdialog = !this.cataEditdialog;
            this.editData = JSON.parse(JSON.stringify(data));
            this.editData.status = this.editData.status==1?true:false;
            this.editData["catelist"] = this.filterChrild(this.cate,data.id);
        },
        handleAdd:function(val){//添加事件
            this.addData.name="";
            this.addData.sort=100;
           if(val!='0'){
               if(val.status==2){
                   return this.$message.error('禁用状态无法添加子分类');
               }
                this.addTitle = `添加 ${val.name} 子分类`
                this.addData["pid"] =val.id;
                this.addData["pname"] =val.name;
           }else{
                this.addTitle = "添加分类"
                this.addData["pname"] ="顶级分类";
                this.addData["pid"] =0;
           }
            this.cataAdddialog = !this.cataAdddialog;
        },
        handleDelete:function(val){//删除事件
            if(val.status==1){
               this.$message.error('正常状态无法删除...');
               return false;
           }
            this.$confirm("确定删除该分类", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.$axios.POST("blogCateDel",{id:val.id}).then((res)=>{
                    var data = res.data;
                    if(data.status){
                        this.$message.success(data.mssage?data.mssage:"delete is  success...");
                        this.getdata();
                    }else{
                        this.$message.error(data.mssage?data.mssage:'delete is fail...');
                    }
                }).catch((err)=>{
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
            this.$axios.POST("blogCateSwtich",{data}).then(res=>{
            
                var data = res.data;
               if(data.status){
                     this.$message.success(data.mssage||"update is  success...");
                     this.getdata();
               }else{
                    this.$message.error(data.mssage||'update is fail...'); 
               }
              
           })
         },
        cellkey:function({row,columnIndex}){
            if(Number(columnIndex)==2){
                if(Number(row.leve)>1){
                    return {"padding-left": 2*Number(row.leve-1) +"em"}
                }
            }
        },
        modifyBtn:function(val,resdata){//监听修改栏目子组件的事件，参数是子组件的事件返回值
           if(val){
                this.$confirm("确定修改该栏目", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                     resdata.status = resdata.status?1:2;
                     this.$axios.POST("blogCateUpdate",resdata).then((res)=>{
                        var data = res.data;
                        if(data.status){
                            this.$message.success(data.mssage||"update is  success...");
                            this.getdata();
                            setTimeout(() => {
                                this.cataEditdialog = false;
                            }, 1000);
                        }else{
                             this.$message.error(data.mssage||'update is fail...'); 
                            
                        }
                       
                    }).catch((err)=>{
                        console.log("server is error")
                    })
                }).catch(()=>{
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });    
                })
                
             }
        },
        addCateBtn:function(istrue,resdata){//监听添加栏目子组件的事件，参数是子组件的事件返回值
           if(istrue){
                resdata.status = resdata.status?1:2;
                this.$axios.POST("blogCateAdd",resdata).then((res)=>{
                    var data = res.data;
                    if(data.status){
                        this.$message.success(data.mssage||"add is  success...");
                        this.getdata();
                        setTimeout(() => {
                            this.cataAdddialog = false;
                        }, 1000);
                    }else{
                        this.$message.error(data.mssage||'add is fail...');                        
                    }
                    
                }).catch((err)=>{
                        console.log("server is error")
                    })
            }else{

            }
        },
        getdata:function(){//获取栏目数据
           this.$axios.GET("blogCate",{status:0}).then(res=>{
              
                var data = res.data;
                if(data.status){
                    this.cate= data.data;
                    if(!this.cate||this.cate.length==0) return;
                    this.cate = fn.recurOne(this.cate,"id","pid");
                   
                }
            }).catch((err)=>{
                  console.log("server is error")
            })
        },
        filterChrild:function(data,tid=0){//找当前栏目除了子集以外的栏目(过滤子集栏目)
           if (!tid||tid==0) return data;
           var arrId = fn.filterChrildId(data, "id", "pid", tid);
           arrId.push(tid);
           var data = data.filter((itme)=>{
               return itme.id!=arrId.find((val)=>{return val==itme.id});
           })
           return data;
        }

    },
    
    created:function(){ 
        this.getdata();
    }
}
</script>
<style>
    .el-title{height: 22px;border-bottom:1px solid #a3ccf5; margin-bottom: 24px;}
    .el-title .el-text{line-height: 44px;padding: 0 10px;display: inline-block;margin-left: 20px;background: #fff;color: #666}
    .table-contain-contain{margin-top: 24px;height: 360px;overflow-y: scroll}
    .defult-btn{border:none;display: inline-block;padding: 12px;cursor: pointer;box-shadow: 0 0 10px #989696;color: #716969;background: rgb(176, 236, 239);}
    .defult-btn:focus{outline: none}
</style>
