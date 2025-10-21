<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">智能评奖评优后台管理系统</h3>
      </div>

      <el-form-item prop="userName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userName"
          v-model="loginForm.username"
          placeholder="用户名"
          name="userName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <!-- 添加单选框组 -->
      <el-radio-group v-model="loginForm.role" style="margin-bottom: 20px;">
        <el-radio label="admin">管理员</el-radio>
        <el-radio label="collegeAdmin">学院管理员</el-radio>
        <el-radio label="teacher">教师</el-radio>
      </el-radio-group>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" @click="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { login, getUserInfo } from "@/api/userinfo";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("用户名不能少于5个字符"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能少于5个字符"));
      } else {
        callback();
      }
    };
    return {
      userRole: "",
      loginForm: {
        username: "",
        password: "",
        remember: true,
        role: "admin" // 默认选择管理员
      },
      loginRules: {
        userName: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false
    };
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        // eslint-disable-next-line no-mixed-operators
        if (
          (shiftKey && key >= "a" && key <= "z") ||
          (!shiftKey && key >= "A" && key <= "Z")
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    handleLogin() {
      login(this.loginForm)
        .then(res => {
          if (res.code === 200) {
            localStorage.setItem("user_token", res.data.access_token);
            return getUserInfo(); // 返回Promise
          } else if (res.code === 500) {
            this.$message.error("用户名或密码错误");
            this.loginForm.username = "";
            this.loginForm.password = "";
            return Promise.reject(); // 中断后续逻辑
          }
        })
        .then(res => {
          if (res.code === 200) {
            this.userRole = res.data.roles[0];
            localStorage.setItem("user_role", res.data.roles[0]);

            // 角色比较逻辑
            if (this.loginForm.role === this.userRole) {
              this.$message.success("登录成功");
              this.$router.push({ path: "/dashboard" });
            } else {
              this.$message.error("选择的角色与账号权限不匹配，请重新选择！");
              this.loginForm.username = "";
              this.loginForm.password = "";
            }
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          console.error("登录请求失败", error);
          this.$message.error("登录请求失败，请稍后再试");
        });
    },
    ...mapMutations("user", ["setUserName"])
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 30px 50px 10px 50px;
    margin: 120px auto auto auto;
    overflow: hidden;
    background: rgba(252, 254, 255, 0.11);
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
