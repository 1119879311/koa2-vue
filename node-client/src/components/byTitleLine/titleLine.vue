<template>
    <div>
        <div class="el-title">
            <p class="el-text">{{title}}</p>
        </div>
    </div>
</template>
<script>
export default {
  props:{
      title:String
  }
}
</script>
<style>
    .el-title{height: 22px;border-bottom:1px solid #a3ccf5; margin-bottom: 24px;}
    .el-title .el-text{line-height: 44px;padding: 0 10px;display: inline-block;margin-left: 20px;background: #fff;color: #666}
</style>
