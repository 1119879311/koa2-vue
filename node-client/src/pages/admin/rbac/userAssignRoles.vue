<template>
    <div>
        <el-checkbox  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="roleCheck" @change="handleCheckedChange">
            <el-checkbox border style="margin: 12px" v-for="(itme,index) in roleList" :label="itme.title" :key="index">{{itme.title}}</el-checkbox>
        </el-checkbox-group>
         <el-button type="primary" style="margin:20px 0 0 12px"  @click="sureBtn()">确定提交</el-button>
     </div>
</template>
<script>
  export default {
    props:{
        prorsRoleCheck:{
            type:Array,
            default:function(){
                return [];
            }
        }
    },
    data() {
      return {
        checkAll: false,
        roleCheck:this.prorsRoleCheck,
        roleList: [],
      };
    },
    watch:{
      prorsRoleCheck(val){
        this.roleCheck = val;
        this.checkAll =val.length&&(val.length === this.roleList.length);
      }
    },
    methods: {
      // 处理全选的
      handleCheckAllChange(val) {
         this.roleCheck = val ? this.roleList.map(itme=>itme.title) : [];

      },
      // 单选的
      handleCheckedChange(value) {
         
         this.checkAll = value.length === this.roleList.length;
      },
      // 获取所有的role
      getRoleData(){
         this.$axios.GET("rbacRole",{status:1}).then(res=>{
                var data = res.data;
                if(data.status){
                    this.roleList= data.data;
                    this.checkAll = this.roleCheck.length&&( this.roleCheck.length === this.roleList.length);
                }
            })
      },
      // 确定提交
      sureBtn(){
         var  resRoleId = [];
         this.roleCheck.forEach(ele => {
            this.roleList.filter(val=>{ if(val.title==ele){ resRoleId.push(val.id) }})
         });
         this.$emit("assginRoleEvent",resRoleId)
        
      }
    },
    created(){
        this.getRoleData();  
    }
  };
</script>