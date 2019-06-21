<template>
    <div class="addUpate-page">
       <el-form :model="formData" ref="ruleForm" :rules="rules" label-position="right" label-width="120px">
            <el-form-item label="角色id" prop="id" v-if="formData.id">
                <el-input v-model="formData.id" auto-complete="off"  :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="角色名称(英文)" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
             <el-form-item label="角色昵称(中文)" prop="title">
                <el-input v-model="formData.title"></el-input>
            </el-form-item>
           
             <el-form-item label="排序" prop="sort">
                <el-input  v-model="formData.sort" style="width:80px"></el-input>
            </el-form-item>
            <el-form-item label="状态">
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
                        type:[Number,String],
                        default:0
                    },
                    name:{
                        type:[Number,String],
                        default:""
                    },
                    title:{
                        type:[Number,String],
                        default:""
                    },
                    sort:{
                        type:[Number,String],
                        default:100
                    },
                    status:{
                        type:Boolean,
                        default:true
                    },
                    handletype:{
                        type:String,
                        default:""
                    }
               }
           }
       },
   },
   data(){
      
       return {
            rules:{
                "name":[
                    {required:true,message:"name不能为空","trigger":"blur"}
                ],
                "title":[
                    {required:true,message:"title不能为空","trigger":"blur"}
                ],
                 "sort":[
                    { required:true,message:"必须为数字值","trigger":"blur"}
                ],
            }
       }
   },
   methods:{
      
    submitForm:function(formname){
            this.$refs[formname].validate((res)=>{
                console.log(res)
                if(res){
                  this.$emit("sureBtn",this.formData)
            }
        })   
    },
     resetForm() {
        this.$refs["ruleForm"].resetFields();
      },
 
   }
}
</script>
