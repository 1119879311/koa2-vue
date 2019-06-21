<template>
    <div class="tabAddUpate-page">
       <el-form :model="formData" ref="ruleForm" :rules="rules" label-position="right" label-width="100px">
            <el-form-item label="标签ID" prop="id" v-if="formData.id!=''| formData.id!=''">
                <el-input v-model="formData.id" auto-complete="off"  :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="标签名称" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-switch v-model="formData.status"></el-switch>
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
       formData:{
           type:Object,
           default:function(){
               return {
                   id:{
                        type:Number,
                        default:0
                    },
                    name:{
                        type:[Number,String],
                        default:""
                    },
                    status:{
                        type:Boolean,
                        default:true
                    }
               }
           }
       },
       rules:Object
   },
   methods:{
      
    submitForm:function(formname){
            this.$refs[formname].validate((res)=>{
                this.$emit("sureBtn",res,this.formData)
        })   
    }
 
   }
}
</script>
