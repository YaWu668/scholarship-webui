<template>
  <div class="index-page">
    <div class="index">
      <div class="left-top position">
        <img src="@/assets/index-images/bg-top-left.png" />
      </div>
      <div class="right-top position">
        <img src="@/assets/index-images/bg-top-right.png" />
      </div>
      <div class="left-bottom position">
        <img src="@/assets/index-images/bg-bottom-left.png" />
      </div>
      <div class="right-bottom position">
        <img src="@/assets/index-images/bg-bottom-right.png" />
      </div>

      <el-container class="content-box">
        <el-header>
          <h1>信科智能评奖评优系统</h1>
          <div class="header-right">
            <el-menu
              :router="true"
              :default-active="this.$route.path"
              class="el-menu-demo"
              mode="horizontal"
              active-text-color="#f00"
            >
              <el-submenu index="2">
                <template class="username" slot="title">用户：{{username}}</template>
                <el-menu-item style="margin-top: 0;" index="/Record/BonusRecord">个人中心</el-menu-item>
              </el-submenu>
              <el-menu-item class="logout" style="border:none">
                <p @click="logout">【安全退出】</p>
              </el-menu-item>
            </el-menu>
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

                <el-submenu index="/classroom">
                  <template slot="title">
                    <span>学生手册统考</span>
                  </template>
                  <el-menu-item index="/classroom/exam">
                    <span>学生手册年度考试</span>
                  </el-menu-item>
                  <el-menu-item index="/classroom/ExmaRecord">
                    <span>考试记录</span>
                  </el-menu-item>
                </el-submenu>

                <el-submenu index="/Bonus">
                  <template slot="title">
                    <span>优秀学生奖</span>
                  </template>
                  <el-menu-item index="/Bonus/BonusApply">
                    <span>奖学金申请</span>
                  </el-menu-item>
                </el-submenu>
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
    <!-- 消息弹窗 S -->
    <!-- <el-dialog class="message-box" title="通知信息" :visible.sync="outerVisible">
      <ul>
        <li @click="openInfoDialog(index)" v-for="(item, index) in dialogInfo" :key="index">
          <h2>{{item.title}}</h2>
          <div class="content">
            <p>{{item.overview}}</p>
          </div>
        </li>
      </ul>
      <el-dialog
        width="30%"
        :title="innerdialogInfo.title"
        :visible.sync="innerVisible"
        append-to-body
      >
        <div class="content">
          <p>{{innerdialogInfo.content}}</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">确 认</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
      </div>
    </el-dialog>-->
    <!-- 消息弹窗 E -->
  </div>
</template>

<script>
import { getUserInfo } from "@/api/userinfo";
export default {
  data() {
    return {
      outerVisible: false,
      innerVisible: false,
      innerdialogInfo: {},
      username: ""
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    logout() {
      this.$confirm("确认退出系统吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          localStorage.removeItem("user_token");
          this.$router.push("/login");
          this.$message({
            type: "success",
            message: "退出成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 获取用户信息
    getUserInfo() {
      getUserInfo().then(res => {
        this.username = res.data.user.nickName;
      });
    },
    // 打开消息弹窗

    openInfoDialog(index) {
      this.innerVisible = true;
      this.innerdialogInfo = this.dialogInfo[index];
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
.index-page {
  height: 100%;
  display: flex;
}
.index-page .index {
  flex-grow: 1; /* 添加这个属性 */
  width: 100%;
  background: url("../../assets/index-images/index_bg.png") no-repeat center top /
    100% auto scroll;
  background-size: cover;
  background-position: center top;
  display: flex;
  flex-direction: column;
}
.index-page .index .el-header a {
  color: #fff;
  text-decoration: none !important;
}
.index-page .position {
  position: absolute;
  z-index: 1;
}
.index-page .left-top {
  left: 0;
  top: 0;
}
.index-page .right-top {
  right: 0;
  top: 0;
}
.index-page .left-bottom {
  left: 0;
  bottom: 0;
}
.index-page .right-bottom {
  right: 0;
  bottom: 0;
}
.index-page .el-header {
  height: 80px !important;
  line-height: 40px;
  color: #f0f0f0;
  background: #5fc5f5;
  display: flex;
  justify-content: space-between;
}
.index-page .header-right {
  height: 60px;
  display: flex;
}
.index-page .header-right p {
  margin-right: 30px;
  float: left;
}
.index-page .header-right a {
  text-decoration: none !important;
  color: #fff;
}

.index-page .header-right .el-menu {
  height: 80px !important;
}

.index-page .header-right .el-menu--horizontal > .el-submenu .el-submenu__title,
.el-menu--horizontal > .el-menu-item {
  height: 80px !important;
  line-height: 80px !important;
  width: 200px !important;
  color: #fff;
  font-size: 18px;
}

.index-page .header-right .el-submenu.is-active .el-submenu__title {
  border: none;
}

.index-page
  .header-right
  .el-menu--horizontal
  > .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  color: #333 !important;
}

.index-page .header-right .el-menu--horizontal > .el-menu-item {
  line-height: 50px !important;
}

.index-page .header-right .header-right-ul {
  position: absolute;
  z-index: 11;
  width: 171px;
  top: 62px;
  background: #5fc5f5;
  /* display: none; */
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

.main-box {
  width: 80%;
  margin: 10px auto 0;
}

.index-page .el-menu {
  overflow: hidden;
  background: rgba(0, 0, 0, 0);
  border: none;
  border-radius: 2% 0 0 2%;
}
.index-page .el-menu-item.is-active,
.index-page .el-menu-item,
.index-page .el-submenu__title i {
  color: #fff;
}
.index-page .el-aside .el-menu-item.is-active,
.index-page .el-aside .el-menu-item:hover,
.index-page .el-aside .el-submenu__title:hover {
  background-color: #1cafff;
}

.index-page .el-submenu__title,
.index-page .el-submenu__title i {
  color: #fff;
}

.main-content {
  width: 80%;
  min-height: 820px;
  background: #fff;
  border-radius: 0 2% 2% 0;
}

.logout p {
  color: #fff !important; /* 确保文字颜色为白色 */
}
.logout:hover p {
  color: #f00 !important; /* 如果需要鼠标悬停时变红，可以在这里设置 */
}

.message-box ul li {
  list-style: none;
  border: 1px solid #e2e2e2;
  padding: 10px;
}
</style>
