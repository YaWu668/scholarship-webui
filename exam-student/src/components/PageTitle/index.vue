<template>
  <h1 class="title">{{ title }}</h1>
</template>

<script>
export default {
  name: "PageTitle",
  props: ["title"],
  
};
</script>

<style>
.title{
  margin-left: 20px;
}
.title::before{
  content: '';
  display: inline-block;
  width: 5px;
  height: 30px;
  border-radius: 5px;
  background: #409eff;
  margin:0 10px -5px 0;
}
</style>