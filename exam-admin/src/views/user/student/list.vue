<template>
  <div class="app-container user-list">
    <!-- 搜索表单 -->
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <!-- 姓名输入框 -->
      <el-form-item label="姓名：">
        <el-input v-model="queryParam.userName" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <!-- 查询和操作按钮 -->
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="reset">重置列表</el-button>
        <el-button type="primary" @click="handleRePassword">批量重置密码</el-button>
        <el-button type="danger" @click="handleDeleteBatch">批量删除</el-button>
        <el-button type="primary" @click="getTemplate">获取模版</el-button>
        <el-upload
          class="upload-demo"
          :action="this.apiurl+`/exam/admin/importUser`"
          :show-file-list="false"
          :on-success="handleSuccess"
          :headers="uploadHeaders"
          :limit="1"
        >
          <el-button size="medium" type="primary">批量导入用户信息</el-button>
        </el-upload>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="userTable"
      v-loading="formloading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="序号" width="55">
        <template slot-scope="scope">
          <span>{{ getRowIndex(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="学号/工号" />
      <el-table-column prop="nickName" label="姓名" />
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex === '0'">男</span>
          <span v-if="scope.row.sex === '1'">女</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="70px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status === '1'" type="warning">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <!-- 编辑按钮 -->
          <router-link
            :to="{ path: '/user/student/edit', query: { id: row.userId } }"
            class="link-left"
          >
            <el-button size="mini">编辑</el-button>
          </router-link>
          <!-- 启用/禁用按钮 -->
          <el-button
            size="mini"
            type="success"
            v-if="row.status === '1'"
            @click="toggleStatus(row)"
          >启用</el-button>
          <el-button size="mini" type="danger" v-else @click="toggleStatus(row)">禁用</el-button>
          <!-- 删除按钮 -->
          <!-- <el-button size="mini" type="danger" @click="deleteUser(row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination
      v-show="total>0"
      :total="total"
      :current-page.sync="queryParam.pageIndex"
      :page-sizes="[13, 26, 39, 58]"
      :page.sync="queryParam.pageIndex"
      :limit.sync="queryParam.pageSize"
      @size-change="search"
      @pagination="search"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // 引入分页组件
import {
  getUserList,
  resetPassword,
  deleteStudent,
  changeStatus,
  getUserTemplate
} from "@/api/userinfo"; // 引入API方法

export default {
  components: {
    Pagination
  },
  data() {
    return {
      // 查询参数
      queryParam: {
        userName: "", // 姓名查询条件
        role: 1, // 角色
        pageIndex: 1, // 当前页码
        pageSize: 13, // 每页大小
        collegeClassId: 1 // 班级ID
      },
      userTable: [], // 全部用户数据
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      formloading: true, // 加载状态
      selectedRows: [], // 选中的行数据
      uploadHeaders: {
        Authorization: localStorage.getItem("user_token")
      }, //上传文件时携带的请求头
      apiurl: process.env.VUE_APP_API // 上传的地址
    };
  },
  mounted() {
    this.search(); // 获取用户数据
  },
  methods: {
    // 获取用户列表
    search() {
      this.formloading = true; // 开启加载状态
      getUserList(this.queryParam).then(res => {
        if (res.code === 200) {
          this.userTable = res.data.records; // 获取全量用户数据
          this.total = res.data.total; // 获取总记录数
          this.formloading = false; // 关闭加载状态
        } else {
          this.$message.error(res.msg); // 错误提示
        }
      });
    },
    //重置列表
    reset() {
      this.queryParam = {
        userName: "", // 姓名查询条件
        role: 1, // 角色
        pageIndex: 1, // 当前页码
        pageSize: 13, // 每页大小
        collegeClassId: 1 // 班级ID
      };
      this.search();
    },
    // 批量重置密码
    handleRePassword() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请先选择要重置密码的学生！");
        return;
      }
      const ids = this.selectedRows.map(row => row.userId); // 获取选中的用户ID
      this.$confirm("确定要重置选中学生的密码吗？重置密码为123456", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        resetPassword(ids.join(",")).then(res => {
          if (res.code === 200) {
            this.$message.success("重置密码成功！");
            this.search(); // 刷新数据
          } else if(res.code === 500){
            this.$message.error(res.msg);
          }else{
            this.$message.error(res.msg);
          }
        });
      });
    },
    // 批量删除
    handleDeleteBatch() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请先选择要删除的学生！");
        return;
      }
      const userIds = this.selectedRows.map(row => row.userId); // 获取选中的用户ID
      this.$confirm("确定要删除选中的学生吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteStudent(userIds).then(res => {
          if (res.code === 200) {
            this.$message.success("删除成功！");
            this.search(); // 刷新数据
          } else  if(res.code === 500){
            this.$message.error(res.msg);
          }else{
            this.$message.error(res.msg);
          }
        });
      });
    },
    // 行选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection; // 更新选中的行数据
    },
    // 切换状态
    toggleStatus(row) {
      if (row.status === "0") {
        row.status = "1";
      } else {
        row.status = "0";
      }
      changeStatus(row).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功！");
          this.search(); // 刷新数据
        } else  if(res.code === 500){
            this.$message.error(res.msg);
          }else{
            this.$message.error(res.msg);
          }
      });
    },
    //获取导入模板
    async getTemplate() {
      try {
        const res = await getUserTemplate(1);

        // 创建Blob对象处理二进制数据
        const blob = new Blob([res], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        // 创建临时下载链接
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = downloadUrl;

        // 设置下载文件名（根据后端返回可调整）
        link.download = `批量导入用户模板.xlsx`;

        document.body.appendChild(link);
        link.click();

        // 清理资源
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(link);

        this.$message.success("模板下载成功！");
      } catch (error) {
        console.error("下载失败:", error);
        this.$message.error("模板下载失败，请稍后重试");

        // 处理Blob类型的错误响应（当HTTP状态码非200时）
        if (error.response.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorData = JSON.parse(reader.result);
              this.$message.error(errorData.msg || "服务器返回错误");
            } catch (e) {
              this.$message.error("服务器返回未知错误");
            }
          };
          reader.readAsText(error.response.data);
        }
      }
    },
    //批量导入
    handleSuccess(response, file) {
      // response是后端返回的数据，file是上传的文件对象
      // 这里可以对response进行处理，例如检查是否上传成功
      if (response.code === 200) {
        this.$message.success("导入成功：" + response.data);
        this.search(); // 刷新表格数据
      } else {
        this.$message.error("导入失败：" + response.msg);
      }
      // 调用handlePreview方法，可以根据需要传递参数
      this.handlePreview(file);
    },
    // 计算序号
    getRowIndex(index) {
      return (this.currentPage - 1) * this.queryParam.pageSize + index + 1;
    }
  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.link-left {
  margin-right: 10px;
}
.user-list .upload-demo {
  display: inline-block;
  margin-left: 10px;
}
</style>