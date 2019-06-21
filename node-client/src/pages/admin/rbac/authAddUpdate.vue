<template>
    <div class="addUpate-page">
       <el-form :model="formData" ref="ruleForm"  :rules="rules" label-position="right" label-width="120px">
            <el-form-item label="权限id" prop="id" v-if="formData.id">
                <el-input v-model="formData.id" auto-complete="off"  :disabled="true"></el-input>
            </el-form-item>
             <el-form-item label="权限名" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="权限标识" prop="identName">
                <el-input v-model="formData.identName"></el-input>
            </el-form-item>
            <el-form-item label="权限分组" >
                <el-select v-model="formData.groupName" placeholder="请选择权限分组"  style="float:left;">
                <el-option label="请选择权限分组"  value="" ></el-option>
                <el-option :label="itme" :value="itme" v-for="(itme,index) in groupName" :key="index"></el-option>
                </el-select>
                 <el-input v-model="customGroupName" style="float:left;width:100px;margin:0 12px"></el-input> <span>(可自定义分组名)</span>
            </el-form-item>
             <el-form-item label="权限链接" prop="url">
                <el-input v-model="formData.url"></el-input>
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
                        type:String,
                        default:""
                    },
                    identName:{
                        type:String,
                        default:""
                    },

                    url:{
                        type:String,
                        default:100
                    },
                    groupName:{ 
                        type:String,
                        default:""
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
       groupName:{
           type:Array,
           default:function(){
               return [];
           }
       }
   },
   data(){
        var urlVery  = (rule,value,callback)=>{
            if(!/^(\/[a-zA-Z]{1,}){1,}\/$/.test(value)){
                callback(new Error('添加的url 格式不对，如：/abc/,/ab/dc/'));
            }else{
               callback();  
            }
        };
        var identNameVery = (rule,value,callback)=>{
            if(!/^[a-zA-Z]{4,}$/.test(value)){
                callback(new Error('权限标识一定是字母，不区分大小写，且最少4位'));
            }else{
               callback();  
            }
        };
       return {

            rules:{
                "name":[
                    {required:true,message:"name不能为空","trigger":"blur"}
                ],
                "identName":[
                     { validator: identNameVery,"trigger":"blur"}
                ],
                 "url":[
                    { validator: urlVery,"trigger":"blur"}
                ],
            },
            customGroupName:""
       }
   },
   methods:{
      
    submitForm:function(formname){
             this.formData.groupName=this.formData.groupName?this.formData.groupName:this.customGroupName;
            this.$refs[formname].validate((res)=>{
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
