<template>
  <div class="user-info">
    <el-container class="content-box">
      <el-header>
        <router-link to="/index">
          <h1 class="xk_title">信科智能评奖评优系统</h1>
        </router-link>
        <div class="header-right">
          <!-- <div :class="{ 'has-dialog-info': hasDialogInfo }" style="float: left;">
            <div class="inform" @click="outerVisible = true"></div>
          </div>-->
          <p class="username">用户：{{username}}</p>

          <p class="logout" @click="logout()">【安全退出】</p>
        </div>
      </el-header>
      <el-main class="main-box">
        <el-container>
          <el-aside width="200px">
            <!-- 左侧菜单 S -->
            <el-menu
              :router="true"
              :default-active="this.$route.path"
              class="el-menu-vertical-demo main"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-menu-item index="/index">
                <template v-slot:title>
                  <span>首页</span>
                </template>
              </el-menu-item>

              <el-submenu index="/Record">
                <template slot="title">
                  <span>申请记录</span>
                </template>
                <el-menu-item index="/Record/BonusRecord">
                  <span>奖学金申请记录</span>
                </el-menu-item>
                <el-menu-item index="/Record/CreditRecord">
                  <span>学分认定记录</span>
                </el-menu-item>
              </el-submenu>

              <el-menu-item index="/Record/MyCredit">
                <template v-slot:title>
                  <span>我的学分</span>
                </template>
              </el-menu-item>
            </el-menu>
            <!-- 左侧菜单 E -->
          </el-aside>
          <el-main class="main-content">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/userinfo";
export default {
  data() {
    return {
      username:""
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    logout() {
      localStorage.removeItem("user_token");
      this.$router.push("/login");
    },
    // 获取用户信息
    getUserInfo() {
      getUserInfo().then(res => {
        this.username = res.data.user.nickName;
      });
    }
  },
  computed: {
    hasDialogInfo() {
      return this.dialogInfo.length > 0;
    }
  }
};
</script>

<style>
.user-info {
  position: absolute;
  width: 100%;
  min-height: 100vh;
  background: url("../../assets/index-images/index_bg.png") no-repeat;
  background-size: cover;
}
.user-info .el-header a {
  color: #fff;
  text-decoration: none !important;
}
.position {
  position: absolute;
  z-index: -1;
}
.left-top {
  left: 0;
  top: 0;
}
.right-top {
  right: 0;
  top: 0;
}
.left-bottom {
  left: 0;
  bottom: 0;
}
.right-bottom {
  right: 0;
  bottom: 0;
}
.user-info .el-header {
  height: 80px !important;
  line-height: 40px;
  color: #f0f0f0;
  background: #5fc5f5;
  display: flex;
  justify-content: space-between;
}
.header-right {
  height: 60px;
}
.header-right p {
  margin-right: 30px;
  float: left;
}
.content-box {
  position: relative;
  z-index: 10;
}
.content-box .user-info {
  width: 400px;
  height: 80px;
  position: relative;
}
.content-box .user-info p {
  float: left;
}

.inform {
  background: url("../../assets/index-images/inform.png") no-repeat;
  width: 32px;
  height: 32px;
  margin: 20px 40px 0 0;
  position: relative;
}
.inform:hover {
  cursor: pointer;
  background: url("../../assets/index-images/inform_hover.png") no-repeat;
}

.inform::after {
  content: "";
  display: block;
  clear: both;
  background: #f00;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0; /* 默认隐藏 */
}

.has-dialog-info .inform::after {
  opacity: 1; /* 显示伪类 */
}

.main-box {
  width: 80%;
  margin: 10px auto 0;
  position: relative;
  z-index: 9;
}

.user-info .el-menu {
  overflow: hidden;
  background: rgba(0, 0, 0, 0);
  border: none;
  border-radius: 2% 0 0 2%;
}
.user-info .el-menu-item.is-active,
.user-info .el-menu-item,
.user-info .el-submenu__title i {
  color: #fff;
}
.user-info .el-menu-item.is-active,
.user-info .el-menu-item:hover,
.user-info .el-submenu__title:hover {
  background-color: #1cafff;
}

.user-info .el-submenu__title,
.user-info .el-submenu__title i {
  color: #fff;
}
.main-content {
  width: 80%;
  min-height: 820px;
  background: #fff;
  border-radius: 0 2% 2% 0;
}
.logout:hover {
  color: #f00;
  cursor: pointer;
}
.message-box ul li {
  list-style: none;
  border: 1px solid #e2e2e2;
  padding: 10px;
}

.message-box ul li:hover {
  cursor: pointer;
  border: #f00 solid 1px;
}
</style>
