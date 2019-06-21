<template>
    <div>
        <el-checkbox  v-model="checkAllFlag" @change="handleCheckAllChange">全选</el-checkbox>
        <div class="group-itme" style="margin:10px 0" v-for="(val,indexs) in authList" :key="indexs">
            <span style="margin: 12px 16px 12px 0;">{{val.groupName}}</span>
            <el-checkbox-group style="margin-left: 15px" v-model="checkAuth" @change="handleCheckedChange">
                <el-checkbox  style="margin: 15px" v-for="(itme,index) in val.dataList" :label="itme.id" :key="index">{{itme.name}}</el-checkbox>
            </el-checkbox-group>    
        </div>
       
         <el-button type="primary" style="margin:20px 0 0 12px"  @click="sureBtn()">确定提交</el-button>
     </div>
</template>
<script>
  export default {
    props:{
        roleId:""
     
    },
    data() {
      return {
        checkAllFlag: false,//全选的booleam
        authList: [], //结构化后的数据
        checkAuth:{},//选中的数据
        authOldList:[] //原始的所有数据
      };
    },
    watch:{
      roleId(val){
        this.roleId = val;
        this.getRoleData();
      }
    },
    methods: {
        //单选
      handleCheckAllChange(val) {
         this.checkAuth = val ? this.authOldList.map(itme=>itme.id) : [];

      },
        //全选
      handleCheckedChange(value) {
         this.checkAllFlag = value.length === this.authOldList.length;
      },
      //获取全部数据
      getRoleData(){
         this.$axios.GET("rbacAuth",{status:1,roleId:this.roleId}).then(res=>{
                var data = res.data;
                if(data.status){
                  this.authOldList = data.data;
                  this.checkAuth = data.roleAuth.map(itme=>itme.a_id);
                  this.authList= this.filterAllAuthGroup(data.data);
                
                  this.checkAllFlag =this.checkAuth.length&&(this.checkAuth.length === this.authOldList.length);
                }
            }).catch((err)=>{
              console.log(err)
            })
      },
       
      sureBtn(){
       
         this.$emit("assginRoleEvent",this.checkAuth)
        
      },
   
      filterAllAuthGroup(data){ //结构化分组所有的auth 返回 array
        var res = {};
        var noGroupData =  data.filter(val=> !val.groupName);
        var groupData =  data.filter(val=>val.groupName);
        groupData.forEach(itme=>{
             if(res[itme.groupName]){
                 res[itme.groupName].push(itme)
             }else{
                   res[itme.groupName] = [itme];
             }

         }) 
         if(noGroupData.length){
         res["未分组"] = noGroupData;
         }  
          var resArr = [];
         for (const key in res) {
           resArr.push({groupName:key,dataList:res[key]});
         }
         return resArr
      },
     
    },
    

    created(){
        this.getRoleData();
    }
  };
</script>