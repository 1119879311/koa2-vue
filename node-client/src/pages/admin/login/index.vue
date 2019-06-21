<template>
    <div class="login-view">
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="name">
                <el-input type="name" v-model="ruleForm2.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="ruleForm2.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script> 
    import {mapActions} from "vuex";
    export default {
        data() {
            var validatename = (rule, value, callback) => {
                if (value === '') {
                callback(new Error('请输入用户名'));
                } else {
                callback();
                }
            };
            var validatepassword = (rule, value, callback) => {
                if (value === '') {
                callback(new Error('请输入密码'));
                } else {
                callback();
                }
            };
            return {
                ruleForm2: { password: '',name: '', },
                rules2: {
                name: [{ validator: validatename, trigger: 'blur' }],
                password: [{ validator: validatepassword, trigger: 'blur' } ]
                }
            };
        },
        methods:{
            ...mapActions({
                Login:"USER/Login",  
                Logout:"USER/LoginOut",
                GetAuth:"AddRouter/loadRouter"       
            }) ,
             submitForm(formName) {
                var _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                         this.$axios.POST("adminLogin",this.ruleForm2).then((res)=>{
                            var data = res.data;
                            
                            if(data.status){
                                this.$message.success("登录成功，正在跳转.....");
                                var {token,username,userId,expiresIn} = data.data;
                                this.Login({token,username,userId,expiresIn,isLogin:true});
                                 //获取动态路由列表  
                                  this.GetAuth().then(()=>{
                                        this.$router.addRoutes(this.$store.state.AddRouter.routerList);
                                  });   
                                  setTimeout(()=>{
                                    _this.$router.replace({path:"/admin"})  
                                },1500)
                            }else{
                                this.$message.error(data.mssage||"登录失败,用户名或密码错误");
                            }
                        }).catch(()=>{
                            this.$message.error("服务器错误，登录失败");
                            this.Logout();
                        })

                       
                    } else {
                        return false;
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
.login-view{position: absolute;top:0;left: 0;bottom: 0;right: 0;width: 100%;display: flex;justify-content: center;align-items: center;background: #f5ecec}
.demo-ruleForm{padding: 40px  40px 20px 20px;box-shadow: 0 0  30px #fff}
</style>
