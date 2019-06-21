<template>
    <div>
        <div ref="ue" class="ue"></div>
    </div>
</template>
<script>
import UE from "wangeditor";
export default {
   name:"uedite",
   props:{
       ueContent:{
           type:String,
           default:""
       },
       ueConfig:Object
   },
   data(){
       return {
           editor:null
       }
   },
   mounted:function(){
       var _this = this;
       this.editor = new UE(this.$refs["ue"]);
        this.editor.customConfig.uploadImgHooks  = {
            success: function (xhr, editor, result) {
                // 图片上传并返回结果，图片插入成功之后触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            },
            fail: function (xhr, editor, result) {
                _this.$message.error(result.mssage||'上传失败');
                // 图片上传并返回结果，但图片插入错误时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            },
            error: function (xhr, editor) {
                // 图片上传出错时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            },
       }
       this.editor.customConfig.customAlert  = function(info){
           
       }
       Object.assign(this.editor.customConfig,this.ueConfig);
       this.editor.create();
       setTimeout(() => {
            this.editor.txt.html(this.ueContent);
       }, 1000);
      
   },
   methods:{
       getContents:function(){
           return this.editor.txt.html();
       }
   },
   destoryed(){
       this.editor.destory();
   }
}
</script>
<style>
 .ue{min-height: 400px}
 .ue .w-e-text-container{min-height: 400px}
 .ue .w-e-text-container,.ue .w-e-menu{z-index: 100!important;}
</style>

