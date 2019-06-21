<template>
    <div class="tabAddUpate-page">
       <el-form :model="formData" ref="ruleForm" :rules="rules" label-position="right" label-width="100px">
            <el-form-item label="管理员id" prop="id" v-if="formData.id!=''| formData.id!=''">
                <el-input v-model="formData.id" auto-complete="off"  :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="管理员名称" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
             <el-form-item label="管理员密码" prop="password" v-if="!formData.id">
                <el-input v-model="formData.password"></el-input>
            </el-form-item>
             <el-form-item label="联系方式" prop="contact">
                <el-input v-model="formData.contact"></el-input>
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
                    contact:{
                         type:String,
                        default:""
                    },
                    password:{
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
   },
   data(){
        var validateContact = (rule, value, callback) => {
           if (!/(^(13|15|18)\d{9}$)|(^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$)/.test(value)) {
              callback(new Error('contact must type is eamil or ipone'));
            } else {
              callback();
            }
        };
         var validatorPwd = (rule, value, callback) => {
              callback();
        };
       return {
            rules:{
                  "name":[
                    {required:true,message:"姓名不能为空","trigger":"blur"}
                ],
                 "password":[
                    {validator:validatorPwd,"trigger":"blur"}
                ],
                 "contact":[
                    { validator: validateContact,"trigger":"blur"}
                ],
            }
       }
   },
   methods:{
      
    submitForm:function(formname){
            this.$refs[formname].validate((res)=>{
                this.$emit("sureBtn",res,this.formData)
        })   
    },
     resetForm() {
        this.$refs["ruleForm"].resetFields();
      },
 
   }
}
</script>
