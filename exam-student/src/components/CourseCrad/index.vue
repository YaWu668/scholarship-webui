<template>
  <div class="course-crad">
    <el-card :body-style="{ padding: '0' }">
      <img
        src="@/assets/index-images/test.jpg"
        class="image"
      />
      <div class="crad-content" style="padding: 10px;">
        <p>{{ title }}</p>
        <div class="bottom clearfix" style="float: right;">
          <el-button type="primary" @click="$emit('startLearn')">{{ buttonText }}</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "CourseCrad",
  props: ["title","buttonText"],
  data() {
    return {};
  },
  methods:{
    startLearn(){
      this.$emit('startLearn')
    }
  }
};
</script>

<style>
.course-crad{width: 22%;}
.el-card{width: 100%;margin-top: 25px;padding-bottom: 10px;}
.el-card img{width: 100%;max-height: 160px;}
.crad-content p{margin: 10px;}
</style>