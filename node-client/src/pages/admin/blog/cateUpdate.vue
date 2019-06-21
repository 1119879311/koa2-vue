<template>
    <div class="modify-cate">
        <el-form ref="ruleForm" :model="datas" :rules="rules"   label-width="80px" size="mini">
            <el-form-item label="编号" prop="id">
                <el-input v-model="datas.id" auto-complete="off"  :disabled="true"></el-input>
            </el-form-item>
             <el-form-item label="栏目名称" prop="name">
                <el-input v-model="datas.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属栏目" prop="cate_id">
                <el-select v-model="datas.pid">
                <el-option label="顶级栏目" :value="0" ></el-option>
                <el-option v-bind:style="{paddingLeft:2*Number(itme.leve-1)+2+'em'}" :label="itme.name" :value="itme.id" v-for="(itme,index) in datas.catelist" :key="index"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="排序" prop="sort">
                <el-input  v-model="datas.sort"></el-input>
            </el-form-item>
             <!-- <el-form-item label="状态" prop="status">
                <el-switch v-model="datas.status"></el-switch>
            </el-form-item> -->
            <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    props:{
        datas:Object,
        rules:Object
    },
    methods:{
        submitForm:function(formname){
             this.$refs[formname].validate((res)=>{
                  this.$emit("modifyBtn",res,this.datas)
            })   
        }
    }
}
</script>
