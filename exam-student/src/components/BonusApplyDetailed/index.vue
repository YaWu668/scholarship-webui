<template>
  <div class="bonus-apply-detailed">
    <el-container>
      <el-header></el-header>
      <el-main>
        <h1>{{ title }}</h1>
      </el-main>
    </el-container>
  </div>
</template>
  
  <script>
export default {
  name: "BonusApplyDetailed",
  props: ["title"]
};
</script>
  
<style>
.bonus-apply-detailed .el-main{
  width: 80%;
  margin: 0 auto;
  background: #fff;
  opacity: 0.8;
  border-radius: 25px;
}
</style>