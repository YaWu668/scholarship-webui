<template>
  <!-- 容器div，用于包含整个页面的内容 -->
  <div class="app-container role-container">
    <!-- 创建一个表单，用于输入查询参数 -->
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <!-- 角色名称输入框 -->
      <el-form-item label="角色名称：">
        <el-input v-model="queryParam.studentName"></el-input>
      </el-form-item>
      <!-- 查询和添加按钮 -->
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <!-- 添加新角色按钮，点击后跳转到添加页面 -->
        <router-link :to="{path:'/user/role/edit', query:{row:{},typeId:1}}" class="link-left">
          <el-button type="primary">添加</el-button>
        </router-link>
        <!-- 批量删除按钮 -->
        <el-button type="danger" @click="handleDeleteRole({},2)" style="margin-left: 10px;">批量删除</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格，用于展示角色数据 -->
    <el-table
      :data="RoleTable"
      v-loading="formloading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <!-- 选中列 -->
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- 序号列 -->
      <el-table-column prop="userName" label="序号">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- 角色名称列 -->
      <el-table-column prop="roleName" label="角色名称" />
      <!-- 权限字符列 -->
      <el-table-column prop="roleKey" label="权限字符" />
      <!-- 权限范围列，使用插槽自定义显示 -->
      <el-table-column prop="dataScope" label="权限范围" width="150px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.dataScope === '1'" type="success">全部数据权限</el-tag>
          <el-tag v-if="scope.row.dataScope === '2' " type="warning">自定义数据权限</el-tag>
        </template>
      </el-table-column>
      <!-- 人员数列 -->
      <el-table-column prop="userCount" label="人员数" width="80px" />
      <!-- 状态列，使用插槽自定义显示 -->
      <el-table-column label="状态" prop="status" width="70px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status === '1' " type="warning">禁用</el-tag>
        </template>
      </el-table-column>
      <!-- 操作列，使用插槽自定义显示 -->
      <el-table-column width="350px" label="操作" align="center">
        <template slot-scope="{row}">
          <!-- 查看人员列表按钮 -->
          <el-button size="mini" @click="getRoleUser(row)">人员列表</el-button>
          <!-- 权限设置链接 -->
          <!--<router-link
            :to="{path:'/user/role/permissions', query:{id:row.roleId, roleName:row.roleName}}"
            v-if="row.roleKey != 'admin'"
            class="link-left"
          >
            <el-button size="mini">权限设置</el-button>
          </router-link>-->
          <!-- 编辑角色链接 -->
          <router-link
            :to="{path:'/user/role/edit', query:{row:row,typeId:2}}"
            v-if="row.roleKey != 'admin'"
            class="link-left"
          >
            <el-button size="mini">编辑</el-button>
          </router-link>
          <!-- 删除角色按钮 -->
          <el-button
            size="mini"
            type="danger"
            @click="handleDeleteRole(row,1)"
            v-if="row.roleKey != 'admin'"
            class="link-left"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件，用于分页显示数据 -->
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

    <!-- 角色人员列表弹窗 S -->
    <el-dialog title="人员列表" :visible.sync="dialogVisible" width="80%" top="8vh">
      <el-form :model="queryParam" ref="queryForm" :inline="true">
        <el-form-item label="学号/工号：">
          <el-input v-model="RoleuserQuery.userName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchRoleUser">查询</el-button>
          <el-button type="primary" @click="getAllUser">添加用户</el-button>
          <!-- 批量取消授权按钮 -->
          <el-button @click="handleDeleteBatchUser()" type="danger">批量取消授权</el-button>
          <el-upload
            class="upload-demo"
            :action="apiurl + `/exam/admin/importUserUnbindingRole`"
            :show-file-list="false"
            :on-success="handleSuccess"
            :headers="uploadHeaders"
            :data="{ rolekey: Rolekey }"
            :limit="1"
            :http-request="customUpload"
          >
            <el-button size="medium" type="primary">导入用户解除授权角色信息</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 人员列表表格 -->
      <el-table
        :data="RoleUserTable"
        v-loading="roleloading"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <!-- 选中列 -->
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- 学号/工号列 -->
        <el-table-column align="center" prop="userName" label="学号/工号"></el-table-column>
        <!-- 姓名列 -->
        <el-table-column align="center" prop="nickName" label="姓名"></el-table-column>
        <!-- 性别列，使用插槽自定义显示 -->
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <span v-if="scope.row.sex === '0'">男</span>
            <span v-if="scope.row.sex === '1'">女</span>
          </template>
        </el-table-column>
        <!-- 状态列，使用插槽自定义显示 -->
        <el-table-column label="状态" prop="status" width="70px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '0'" type="success">正常</el-tag>
            <el-tag v-if="scope.row.status === '1' " type="warning">禁用</el-tag>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" align="center">
          <!-- 取消授权按钮 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteUser(scope.row.userId)"
              v-if="scope.row.roleKey != 'admin'"
              class="link-left"
            >取消授权</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination
        v-show="RoleuserQuery.total > 0"
        :total="RoleuserQuery.total"
        :current-page.sync="RoleuserQuery.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page.sync="RoleuserQuery.pageIndex"
        :limit.sync="RoleuserQuery.pageSize"
        @pagination="handleRolePagination"
        @size-change="handleRolePagination"
      />
      <!-- 弹窗底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false, search()">退 出</el-button>
      </span>
    </el-dialog>
    <!-- 角色人员列表弹窗 E -->

    <!-- 添加用户弹窗 S -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="60%">
      <el-form :model="UserQuery" ref="UserQuery" :inline="true">
        <el-form-item label="学号/工号：">
          <el-input v-model="UserQuery.userName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getAllUser">查询</el-button>
          <el-button type="primary" @click="getTemplate">获取模版</el-button>
          <el-upload
            class="upload-demo"
            :action="this.apiurl+`/exam/admin/importUserBindingRole`"
            :show-file-list="false"
            :on-success="handleSuccess"
            :headers="uploadHeaders"
            :data="{ rolekey: Rolekey }"
            :limit="1"
          >
            <el-button size="medium" type="primary">导入用户绑定角色信息</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="userloading"
        :data="UserTable"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <!-- 选中列 -->
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- 学号/工号列 -->
        <el-table-column align="center" prop="userName" label="学号/工号"></el-table-column>
        <!-- 姓名列 -->
        <el-table-column align="center" prop="nickName" label="姓名"></el-table-column>
        <!-- 性别列，使用插槽自定义显示 -->
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <span v-if="scope.row.sex === '0'">男</span>
            <span v-if="scope.row.sex === '1'">女</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pagination
        v-show="UserQuery.total > 0"
        :total="UserQuery.total"
        :current-page.sync="UserQuery.pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page.sync="UserQuery.pageIndex"
        :limit.sync="UserQuery.pageSize"
        @pagination="getAllUser"
        @size-change="getAllUser"
      />
      <!-- 弹窗底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false, getRoleUser(this.Roleid)">取 消</el-button>
        <el-button type="primary" @click="addUser">确认授权</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户弹窗 E -->
  </div>
</template>

<script>
// 导入所需的辅助函数和组件
import Pagination from "@/components/Pagination";
import { getUserTemplate } from "@/api/userinfo";
import {
  getRoleList,
  getRoleUser,
  getRoleMenu,
  addlAuthUser,
  cancelRoleUser,
  delRole,
  batchUnbindRole
} from "@/api/role";

// 定义Vue组件
export default {
  components: { Pagination },
  data() {
    return {
      // 定义查询参数
      queryParam: {
        userName: "",
        role: 1,
        pageIndex: 1,
        pageSize: 13,
        collegeClassId: 1
      },
      RoleTable: [], // 角色列表
      total: 1, // 总数据条目数
      formloading: true, // 角色列表的加载状态
      selectedRows: [], // 选中的角色行数据
      dialogVisible: false, // 人员列表弹窗的显示状态
      RoleuserQuery: {
        userName: "",
        id: null,
        total: 0,
        currentPage: 1,
        pageIndex: 1,
        pageSize: 10
      },
      RoleUserTable: [], // 人员列表数据
      roleloading: true, // 人员列表的加载状态
      roleuserRows: [], // 人员列表行数据
      Roleid: "", // 当前角色id
      Rolekey: "", //当前角色key
      addDialogVisible: false, // 添加用户弹窗的显示状态
      userloading: true, // 添加用户列表的加载状态
      UserTable: [], // 用户列表数据
      UserQuery: {
        userName: "",
        total: 0,
        currentPage: 1,
        pageIndex: 1, // 当前页码
        pageSize: 10 // 每页大小
      }, // 用户查询参数
      uploadHeaders: {
        Authorization: localStorage.getItem("user_token")
      }, //上传文件时携带的请求头
      apiurl: process.env.VUE_APP_API // 上传的地址
    };
  },
  // 组件创建后执行的方法
  mounted() {
    this.search();
  },
  methods: {
    // 查询角色列表
    search() {
      getRoleList().then(res => {
        if (res.code === 200) {
          this.RoleTable = res.data.records;
          this.total = res.data.records.length;
          this.formloading = false;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //删除角色信息 1单独删除 2批量删除
    handleDeleteRole(row, type) {
      let ids = [];
      if (type == 1) {
        ids = [row.roleId];
        console.log(ids);
      } else if (type == 2) {
        ids = this.selectedRows.map(row => row.roleId);
      }
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delRole(ids).then(res => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.search();
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      });
      this.search(); // 刷新角色列表
    },

    // 获取绑定当前角色的用户
    getRoleUser(row) {
      this.dialogVisible = true;
      this.Roleid = row.roleId;
      this.Rolekey = row.roleKey;
      this.RoleuserQuery.id = row.roleId;
      // this.RoleuserQuery.pageIndex = 1; // 初始页码为1
      this.fetchRoleUsers(); // 初始化加载
    },
    // 加载分页数据
    fetchRoleUsers() {
      const params = {
        id: this.RoleuserQuery.id,
        pageIndex: this.RoleuserQuery.pageIndex,
        pageSize: this.RoleuserQuery.pageSize
      };
      getRoleUser(params).then(res => {
        if (res.code === 200) {
          this.RoleUserTable = res.data.records;
          this.RoleuserQuery.total = res.data.total; // 更新总数据量
          this.roleloading = false;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //搜索绑定当前角色的用户
    searchRoleUser() {
      getRoleUser(this.RoleuserQuery).then(res => {
        if (res.code === 200) {
          this.RoleUserTable = res.data.records;
          this.RoleuserQuery.total = res.data.total; // 更新总数据量
          this.roleloading = false;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 分页处理
    handleRolePagination({ page }) {
      this.RoleuserQuery.pageIndex = page; // 更新当前页码
      this.fetchRoleUsers(); // 重新加载分页数据
    },
    // 获取所有非当前角色用户列表
    getAllUser() {
      this.addDialogVisible = true;
      getRoleMenu(this.Roleid, this.UserQuery).then(res => {
        if (res.code === 200) {
          this.UserTable = res.data.records;
          this.UserQuery.total = res.data.total;
          this.userloading = false;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 存储选中的行数据
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },

    // 批量删除角色信息
    handleDeleteBatch() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请先选择要删除的角色信息！");
        return;
      }
      let data = {
        collegeClassId: this.queryParam.collegeClassId,
        userIds: this.selectedRows.map(row => row.userId)
      };
      this.$confirm("确定要删除选中的角色信息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // TODO: 实现批量删除的逻辑;
          deleteStudent(data).then(res => {
            if (res.code == 200) {
              this.$message.success("删除成功！");
              this.search();
            } else if (res.code === 500) {
              this.$message.error(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除操作");
        });
    },

    // 为用户绑定角色
    addUser() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请先选择要授权的用户！");
        return;
      }
      // 将选中的 userIds 拼接成逗号分隔的字符串，并进行 URL 编码
      const userIds = this.selectedRows.map(row => row.userId).join(",");
      addlAuthUser(this.Roleid, userIds).then(res => {
        if (res.code === 200) {
          this.$message.success("授权成功！");
          this.addDialogVisible = false;
          this.getRoleUser({ roleId: this.Roleid });
          this.selectedRows = [];
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 取消授权
    deleteUser(userIds) {
      this.$confirm("确定要取消授权吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        cancelRoleUser(this.Roleid, userIds).then(res => {
          if (res.code === 200) {
            this.$message.success("取消授权成功！");
            this.getRoleUser({ roleId: this.Roleid });
            this.selectedRows = [];
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    // 批量取消授权
    handleDeleteBatchUser() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请先选择要取消授权的用户！");
        return;
      }
      // 直接拼接 userIds 字符串，不再进行 encodeURIComponent 编码
      const userIds = this.selectedRows.map(row => row.userId).join(",");
      this.deleteUser(userIds);
    },
    //获取导入模板
    async getTemplate() {
      try {
        const res = await getUserTemplate(0);

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
        link.download = `用户角色关系绑定/解绑模板.xlsx`;

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

    //导入取消授权
    customUpload(params) {
      const file = params.file; // 获取上传的文件
      const formData = new FormData();
      formData.append("file", file); // 将文件添加到 FormData 中
      formData.append("rolekey", this.Rolekey); // 添加其他参数
      // 使用 axios 发送 DELETE 请求
      batchUnbindRole(formData)
        .then(response => {
          // 处理响应
          if (response.code === 200) {
            this.$message.success(response.data);
          } else if (response.code === 500) {
            this.$message.error(response.msg);
          } else {
            this.$message.error(response.msg);
          }
        })
        .catch(error => {
          console.error("上传失败:", error);
          this.$message.error("导入失败，请稍后重试");
        });
    },

    // 新增：处理导入成功时刷新列表
    handleSuccess(response, file) {
      if (response.code === 200) {
        this.$message.success("导入成功！");
        this.getRoleUser(this.Roleid); // 刷新当前角色用户列表
      } else if (res.code === 500) {
        this.$message.error(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    }
  }
};
</script>

<style>
.role-container .upload-demo {
  display: inline-block;
  margin-left: 10px;
}
</style>