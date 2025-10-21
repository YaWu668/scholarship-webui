<template>
  <div class="enInfo">
    <div class="tips">
      <h2>考试信息</h2>
      <p>考生名称：{{username}}</p>
      <p>考试名称：{{ yearTypeName }}</p>
      <p>考试科目：学生手册</p>
      <p>
        在考试期间
        <span style="color: red;font-size:22px">不允许刷新页面</span>，否则会自动提交试卷！！！
      </p>
      <div class="btn">
        <el-button type="primary" size="medium" @click="goExam">开始考试</el-button>
        <el-button type="danger" size="medium" @click="goHome">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/userinfo";
export default {
  data() {
    return {
      yearTypeId: null,
      username: "",
      yearTypeName: ""
    };
  },
  created() {
    this.yearTypeId = this.$route.query.examId;
    this.yearTypeName = this.$route.query.yearTypeName;
    this.getUserInfo();
  },
  methods: {
    goExam() {
      this.$router.push({ path: "/doexme", query: { yearId: this.yearTypeId } });
    },
    goHome() {
      this.$router.go(-1);
    },
    getUserInfo() {
      getUserInfo().then(res => {
        this.username = res.data.user.nickName;
      });
    }
  }
};
</script>

<style>
.enInfo {
  position: relative;
  z-index: 10;
  height: 100vh;
}

.enInfo .tips {
  width: 400px;
  height: 360px;
  background: #fff;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.enInfo .tips h2 {
  text-align: center;
}
.enInfo .tips p {
  margin: 30px 0 0 20px;
}
.enInfo .tips .btn {
  margin-top: 30px;
  text-align: center;
}
</style>