<template>
     <div class="article-update-page">
         <by-title-line :title = "titile"></by-title-line>
      
        <art-add-form
         v-if="flag"
         ref="addForm"
         :formData ="formData"
         v-on:addEditBtn="addEditBtn"
        ></art-add-form>
    </div>
</template>
<script>
import fn from "@/util/fn";
import artAddForm from "./articleAddUpdate";
export default {
    data(){
        return {
            titile:"修改帖子",
            flag:false,
            artId:"",
            token:this.$store.state.USER.ADMIN_TOKEN,
            formData:{//表单数据
                title:"",
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
                id:this.artId,
                title:data.title,
                content: data.ueContent,
                cid: data.cata_id,
                tabList:data.tabList,
                thumimg: data.thumimg,
                remark: data.remark,
                status:data.status?1:2
           }
            this.$axios.POST("blogArticlebUpdate",resDate).then(res=>{
               var data = res.data;
               if(data.status){
                    this.$message.success(data.mssage||"更新成功");
                    setTimeout(() => {
                        this.$router.push({name:"article"}) 
                    }, 1000);
               }else{
                    this.$message.error(data.mssage||"更新失败");
               }
           }).catch((err)=>{
                this.$message.error("server is error");
           })
        }
    },
    created(){
         this.artId = this.$route.params.id;
         this.$axios.GET("blogDetail",{ id:this.artId,is_tab:0,a_status:0}).then(res=>{
            var resData = res.data;
             if(resData.status){
                var   data = resData.data;
                if(data.thumimg){
                    var thumimg =(data.thumimg).replace(/\\/g,"/");
                    var index = thumimg.search(/(\/)(?!.*\1)/gi)
                    var name = thumimg.substr(index+1);
                    this.formData.fileList = [{name:name,url:thumimg}]
                }
                this.formData.status = data.status==1?true:false
                this.formData.id = data.id;
                this.formData.title = data.title;
                this.formData.remark = data.remark;
                this.formData.tabList = data.tab.length<1?[]:data.tab.map((itme)=>{return itme.id})
                this.formData.ueContent =data.content; 
                this.formData.cata_id = data.cid;
                this.formData.cata_name = data.c_name;
                this.artId = data.id;
                this.flag = true;
             }
        }).catch((err)=>{
            console.log("server is error")
        });
       this.flag = true;
       
    }
}
</script>