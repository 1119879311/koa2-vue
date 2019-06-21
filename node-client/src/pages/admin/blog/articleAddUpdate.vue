<template>
     <div class="view-index">
        <el-button type="primary" class="goback" icon="el-icon-arrow-left" @click="goBack">返回</el-button>
        <el-form label-position="right" label-width="90px" ref="add-edit-forms" :model="formData" :rules="rules">
           <el-form-item label="文章标题" prop="title">
                <el-input v-model="formData.title"></el-input>
            </el-form-item>
             <el-form-item label="文章摘要" prop="remark">
                <el-input v-model="formData.remark"></el-input>
            </el-form-item>
             
            <el-form-item label="标签" prop="tabList">
                <el-checkbox-group v-model="formData.tabList">
                <el-checkbox :label="itme.id" name="tabtype"  v-for="(itme,index) in tabList" :key="index">{{itme.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
             <el-form-item label="所属栏目" prop="cata_id">
                <el-select v-model="cateIdCup" placeholder="请选择栏目">
                <el-option v-bind:style="{paddingLeft:2*Number(itme.leve-1)+2+'em'}" :label="itme.name" :value="itme.id" v-for="(itme,index) in cataList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章缩略图" prop="fileList">
                <el-upload
                    ref= "upload"
                    class="upload-demo"
                    :on-success ="handlesucess"
                    :action="uploadConf.uploadServer"
                    :file-list="formData.fileList"
                    list-type="picture"
                    :auto-upload="false"
                    :limit='1'
                    :data="uploadConf.uploadData"
                    :name="uploadConf.name"
                    :headers ="uploadConf.headers"
                   >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                     <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
            </el-form-item>
            <el-form-item label="文章内容">
               <my-ueditor 
                class="ueditor-main"
                :ueContent="formData.ueContent"
                :ueConfig="ueConfig" 
                ref="ueditor"
                ></my-ueditor>
            </el-form-item>
        </el-form>
         <el-button type="primary"  @click='getContent'>确定提交</el-button>

    </div>
</template>
<script>
import fn from "@/util/fn";
import myUeditor from "@/components/ue";
import {uploadArticleThum,uploadArticleUe} from '@/api';
export default {
    props:{
        formData:{
            type:Object,
            default:function(){
                return {
                    title:"", //标题
                    status:true,
                    ueContent:"",//内容
                    remark:"", //摘要
                    cata_id:"", 
                    tabList:[],  
                    fileList: [] //缩略图
                }
            }
        },
    },
    computed:{
        cateIdCup:{
            get:function(){
                return this.cataList.findIndex((ele)=>ele.id==this.formData.cata_id)>-1?this.formData.cata_id:'';
            },
            set:function(newVal){
                this.formData.cata_id= newVal;
            }
        }
    },
    data(){
        return {
                ueConfig:{ //富编辑器配置
                    uploadImgServer :uploadArticleUe,//编辑器图片上传服务器地址
                    uploadImgParams :{//编辑器图片上传附带参数
                        token:this.$store.state.USER.ADMIN_TOKEN
                    },
                    uploadImgHeaders:{ //自定义请求头
                        Authorization:this.$store.state.USER.ADMIN_TOKEN
                    }
                },
                uploadConf:{ //缩略图 配置
                    uploadServer:uploadArticleThum,
                    uploadData:{ token:this.$store.state.USER.ADMIN_TOKEN,id:this.$route.params.id},
                    headers:{Authorization:this.$store.state.USER.ADMIN_TOKEN}
                },
               cataList:[],
               tabList:[],
               rules:{
                   title:[
                       { required: true, message: '请输入标题', trigger: 'blur' },
                       { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
                   ],
                    remark:[
                       {required:true,mssage:"请输入摘要",trigger:"blur"},
                       {min:20,max:100,message:"字数在20到100",trigger:"blur"}
                   ],
                //    tabList:[
                //        {type:"array",required:true,mssage:"至少选择一个标签",trigger:"change"}
                //    ],
                   cata_id:[
                        { required: true, message: '请选择分类', trigger: 'change' }
                   ]
               }
        }
    },
    components:{
        myUeditor
    },
    methods:{
        // 提交表单内容
        getContent(){
           this.formData.ueContent =  this.$refs['ueditor'].getContents();
           this.formData.thumimg = this.formData.fileList[0]?this.formData.fileList[0].url:"";
           this.$refs["add-edit-forms"].validate((res)=>{
            //    if(!this.formData.thumimg){
            //         this.$message.warning('请上传一张缩略图');
            //    }
                if(!this.formData.ueContent){
                    this.$message.warning('内容不能为空');
               }
               if(!this.formData.ueContent||!res){
                     this.$emit('addEditBtn',false,this.formData)
               }else{
                    this.$emit('addEditBtn',true,this.formData)
               }
                
                // this.$emit('addEditBtn',false,this.formData)
           })
        },
        submitUpload(){//提交图片上传
            this.$refs['upload'].submit()
        },
       
        handlesucess:function(response, file, fileList){//缩略图成功响应
            if(response&&response.length){
                this.formData.fileList = file.response;
            }else{
                 this.formData.fileList =[];
                 this.$message.error(response.mssage||"上传失败");
            }
           
        },
         goBack(){
            this.$router.push({name:"article"})
        },
        getCate:function(){ //获取分类
            this.$axios.GET("blogCate").then(res=>{
                var data = res.data;
                if(data.status){
                    this.cataList= data.data;
                    if(!this.cataList||this.cataList.length==0) return;
                    this.cataList = this.cataList.filter(itme=>itme.status!=2);
                    this.cataList = fn.recurOne(this.cataList,"id","pid");
                   
                }
            }).catch((err)=>{
                  console.log("server is error")
            })

        },
        getTab(){//获取标签
             this.$axios.GET("blogTab",{status:1}).then((res)=>{
                var data =res.data;
                if(data.status){
                    this.tabList = data.data;
                }
            }).catch((err)=>{
                  console.log("server is error")
            })
        }
    },
    created(){ //钩子函数=>初始数据
        this.getCate();
        this.getTab();
    }
    
}
</script>
<style>
/* .ueditor-main{height: 200px !important;} */
.goback{margin-bottom: 20px}
.el-select-dropdown.el-popper{z-index: 10001 !important}
</style>
