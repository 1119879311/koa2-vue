<template>
    <div class="add-cate">
        <el-form ref="ruleForm" label-position="left" label-width="80px" :model="datas" :rules="rules" >
            <el-form-item label="栏目名称" prop="name">
                <el-input v-model="datas.name"></el-input>
            </el-form-item>
            <el-form-item label="所属栏目" prop="pid">
                 <el-select v-model="datas.pid" placeholder="请选择所属栏目">
                 <el-option :label="datas.pname" :value="datas.pid"></el-option>   
                </el-select>
            </el-form-item>
               <el-form-item label="排序" prop="sort">
                <el-input  v-model="datas.sort"></el-input>
            </el-form-item>
             <el-form-item label="状态" prop="status">
                <el-switch v-model="datas.status"></el-switch>
            </el-form-item>
             <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
   props:{
       datas:Object,
       rules:Object
   },
   methods:{
       submitForm:function(formName){
            this.$refs[formName].validate((res)=>{
            
                this.$emit("addCateBtn",res,this.datas)
            }) 
       }
   }
}
</script>
<style>

</style>
