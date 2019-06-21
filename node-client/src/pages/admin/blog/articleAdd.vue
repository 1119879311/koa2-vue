<template>
     <div class="article-add-page">
         <by-title-line :title = "titile"></by-title-line>
      
        <art-add-form 
         ref="addForm"
         :formData ="formData"
          v-on:addEditBtn="addEditBtn"
        ></art-add-form>
         <!-- <el-button type="primary"  @click='getContent'>确定提交</el-button> -->
    </div>
</template>
<script>
import fn from "@/util/fn";
import artAddForm from "./articleAddUpdate";
export default {
    data(){
        return {
            titile:"添加帖子",
            token:this.$store.state.USER.ADMIN_TOKEN,
            formData:{//表单数据
                title:"",
                status:true,
                ueContent:"",
                remark:"",
                cata_id:"",
                tabList:[],
                fileList: []
            },
            
        }
    },
    components:{
        artAddForm
    },
    methods:{
        addEditBtn:function(val,data){
            if(!val) return
            var resDate = {
                title:data.title,
                content: data.ueContent,
                cid: data.cata_id,
                tabList:data.tabList,
                thumimg: data.thumimg,
                remark: data.remark,
                status:data.status?1:2
           }
           
           this.$axios.POST("blogArticlebAdd",resDate).then(res=>{
               var data = res.data;
               if(data.status){
                    this.$message.success(data.mssage||"添加成功");
                    setTimeout(() => {
                        this.$router.push({name:"article"}) 
                    }, 1000);
               }else{
                    this.$message.error(data.mssage||"添加失败");
               }
           }).catch((err)=>{
                this.$message.error("server is error");
           })
       
        }
    },
    created(){

    }
}
</script>