<template>
  <div class="login">
    <div class="login_content">
      <img class="login_bg" src="@/assets/login_bg.jpg" />
      <div class="login_form_wrap">
        <img class="login_logo" src="@/assets/login_logo.png" />
      </div>
      <div class="login_form">
        <el-form>
          <h1 class="login_title">智能评奖评优系统</h1>
          <div class="login_input">
            <span>账号:</span>
            <el-input v-model="user.username" placeholder="请输入账号"></el-input>
          </div>
          <div class="login_input">
            <span>密码:</span>
            <el-input v-model="user.password" placeholder="请输入密码" type="password"></el-input>
          </div>
          <el-button type="primary" @click="userlogin">登录</el-button>
        </el-form>
      </div>
    </div>
    <div class="login_footer">
      <h2>桂林信息科技学院</h2>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/userinfo";
export default {
  data() {
    return {
      user: { username: "", password: "" }
    };
  },
  methods: {
    userlogin() {
      let user = {
        username: this.user.username,
        password: this.user.password
      };
      login(user)
        .then(res => {
          if (res.code === 200) {
            this.$message.success("登录成功");
            localStorage.setItem("user_token", res.data.access_token);
            this.$router.push("/index");
          } else if (res.code === 500) {
            this.$message.error("账号或密码错误");
            this.user.username = "";
            this.user.password = "";
          }
        })
        .catch(error => {
          console.error("登录请求失败", error);
          this.$message.error("登录请求失败");
        });
    }
  }
};
</script>

<style>
.login_content {
  width: 100%;
  height: 93vh;
  position: relative;
}
.login_bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  z-index: -99;
}
.login_form_wrap {
  position: relative;
  top: 0;
  left: 0;
  z-index: 99;
}
.login_logo {
  width: 800px;
  position: absolute;
  left: 50px;
  top: 50px;
}
.login_form {
  width: 400px;
  height: 400px;
  position: absolute;
  top: 20%;
  right: 10%;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}
.login_input {
  display: flex;
  height: 40px;
  margin-top: 40px;
}
.login_form span {
  width: 20%;
  line-height: 40px;
}
.login .el-button--primary {
  width: 200px;
  height: 40px;
  line-height: 2px;
  padding: 0;
  margin-top: 40px;
}
.login_footer {
  height: 7vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>