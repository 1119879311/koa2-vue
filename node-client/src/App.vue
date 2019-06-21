<template>
   <div id="app">
     <transition name="el-zoom-in-top"> <router-view></router-view></transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
li{
  list-style: none;
}
a{
  text-decoration: none;
  color: #000;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/*base css*/
*{margin: 0;padding: 0;box-sizing: border-box}
ul,li{list-style: none}
*:fouce{outline: none}
a{text-decoration: none;color: #666}
a:hover{color: #008868}
input,button{outline: none}

/* commcon css */
.lg-contaion{max-width: 1200px;width: 100%;margin:20px auto}
img.img-response{display: block;width: 100%;margin: auto}
.text-right{text-align: right}
.m-flex{display: flex}
.block-shadow{width: 100%;border-radius: 5px; border: 1px solid #ddd; box-shadow: 0px 0px 10px #E7E7E7;padding: 8px;margin-bottom: 20px;}
/* pre{background: #23241f;overflow:auto;font-family: Arial, Helvetica, sans-serif;width:100%; padding: 12px; border-radius: 8px;font-weight: 700;font-size: 16px;line-height:28px;margin:10px auto;box-shadow: 0px 0px 10px #000;} */
/* pre{overflow:auto;width:100%;border-radius: 8px;font-weight: 700;font-size: 16px;box-shadow: 0px 0px 10px #000;} */
table{border-collapse:collapse} 
table td{border: 1px solid #eee;padding: 8px;line-height: 28px;}
.slide-fade-enter-active {
transition: all .3s ease;
}
.slide-fade-leave-active {
transition: all .5s;
}
.slide-fade-enter, .slide-fade-leave-to{
transform: translateX(-20px);
opacity: 0;
}
</style>
