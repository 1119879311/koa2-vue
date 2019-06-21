<template>
    <div class="views-pwd">
      
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
      
    </div>
</template>

<script>
    export default {
     
        data() {
           
            var validatePass = (rule, value, callback) => {
                    if (value === '') {
                    callback(new Error('请输入密码'));
                    }else {
                        if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                        }
                        callback();
                    }
                };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入密码不一致!'));
                } else {
                callback();
                }
            };
            return {
                ruleForm: {
                    password: '',
                    checkPass: '',
                },
                rules: {
                    pass: [{ validator: validatePass, trigger: 'blur' } ],
                    checkPass: [ { validator: validatePass2, trigger: 'blur' }]
                },
            }
        },
       
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm("确定修改吗，修改后需要重新登录",{
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                        }).then(()=>{
                            this.$axios.POST("usermodifypwd",this.ruleForm).then((res)=>{
                                var {status,mssage} = res.data;
                                if(status){
                                     this.$message.success(mssage);
                                    setTimeout(()=>{
                                        this.$store.dispatch("USER/LoginOut"); 
                                        this.$store.dispatch("TABS/removeTabsData");  
                                        this.$router.replace({path:"/admin/login"}) 
                                    },500)
                                }
                            })    
                        })
                    } 
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>