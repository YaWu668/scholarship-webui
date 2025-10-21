<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="用户名称：">
        <el-input v-model="queryParam.userName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="userTable"
      v-loading="formloading"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号">
        <template slot-scope="scope">
          <span>{{ pageIndexStart + scope.$index }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tokenId" label="会话编号" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="ipaddr" label="登录地址" />
      <el-table-column prop="loginTime" label="登录时间">
        <template slot-scope="scope">{{ formatTimestamp(scope.row.loginTime) }}</template>
      </el-table-column>
      <el-table-column width="220px" label="操作" align="center">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="danger"
            @click="handelForceLogout(row.tokenId)"
            class="link-left"
          >强制退出</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page-sizes="[13, 26, 39, 48]"
      :current-page.sync="pageIndex"
      :page.sync="queryParam.pageIndex"
      :limit.sync="queryParam.pageSize"
      @pagination="onPaginationChange"
      @size-change="onPaginationChange"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getOnlineUserList, forceLogout } from "@/api/onlineUser";

export default {
  components: { Pagination },
  data() {
    return {
      queryParam: {
        userName: "",
        role: 1,
        pageIndex: 1,
        pageSize: 13
      },
      userTable: [],
      classTable: [],
      studentList: [],
      total: 0,
      currentPage: 1,
      formloading: true,
      selectedRows: [],
      allUsers: [], // 存储所有在线用户数据
      pageIndexStart: 1 // 序号的起始值
    };
  },

  mounted() {
    this.search();
  },
  methods: {
    search() {
      // 加载所有在线用户数据
      getOnlineUserList(this.queryParamWithoutPageOptions()).then(res => {
        if (res.code === 200) {
          // 获取所有在线用户数据并排序
          this.allUsers = res.data.records.sort((a, b) => {
            return b.loginTime - a.loginTime; // 倒序排列
          });
          this.total = this.allUsers.length;
          this.handlePageChange(); // 初始加载时处理分页
          this.formloading = false;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //强制退出
    handelForceLogout(tokenId) {
      this.$confirm("此操作将强制退出该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          forceLogout(tokenId).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "强制退出成功!"
              });
              this.search();
            } else if (res.code === 500) {
              this.$message.error(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消强制退出"
          });
        });
    },
    // 时间戳转换为日期时间字符串
    formatTimestamp(timestamp) {
      if (!timestamp) return "-"; // 如果时间戳为空，返回 "-"
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 注意：月份从 0 开始
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      const second = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    // 去掉分页参数，避免后端误解
    queryParamWithoutPageOptions() {
      const { pageIndex, pageSize, ...restParams } = this.queryParam;
      return restParams;
    },
    // 处理分页
    handlePageChange() {
      const { pageIndex, pageSize } = this.queryParam;
      const start = (pageIndex - 1) * pageSize;
      const end = pageIndex * pageSize;
      this.userTable = this.allUsers.slice(start, end); // 切片显示当前页的数据
      this.pageIndexStart = start + 1; // 序号的起始值
    },
    // 分页组件变化时触发
    onPaginationChange() {
      this.handlePageChange();
    }
  },

};
</script>