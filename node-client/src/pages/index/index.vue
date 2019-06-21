<template>
    <div class="index-page">
       
        <div class="post-contetn">
            <post-list/>
        </div>

    </div>
</template>
<script>
    import postList from "./articleList"
    export default {
        data(){
            return {

            }
        },
        components:{
            postList
        },
    }
</script>

<style scoped>
.top-banner{
    overflow: hidden;
    position: relative;
    box-shadow: 0px 3px 20px 2px #d6f5ff;
 
}
.post-contetn{
    width: 98%;
    max-width: 1250px;
    margin:20px auto 
}
</style>