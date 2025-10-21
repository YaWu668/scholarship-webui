<template>
  <div class="app-container">
    <div class="app-container-class">
      <!-- 查询表单 -->
      <div>
        <el-form :inline="true">
          <el-form-item>
            <router-link :to="{path:'/college/class/edit', query:{row:[],id:0}}">
              <el-button type="primary">新增学院树结点</el-button>
            </router-link>
            <el-button
              size="medium"
              style="margin-left:10px"
              @click="getTemplate"
              type="primary"
            >获取批量导入模板</el-button>
            <router-link :to="{path:'/college/class/add'}">
              <el-button size="medium" style="margin:0 10px" type="primary">批量导入老师或学生绑定组织</el-button>
            </router-link>
            <!-- 查看在校人员列表按钮 -->
            <el-button type="primary" @click="openList">查看所有在校人员</el-button>
          </el-form-item>
        </el-form>

        <!-- 树形表格 -->
        <el-table
          v-loading="Traaloading"
          :data="CollegetableData"
          :default-expand-all="false"
          :tree-props="{ children: 'children' }"
          row-key="id"
        >
          <el-table-column prop="label" label="名称"></el-table-column>
          <el-table-column align="center" prop="type" label="类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type === 'C'">学院</el-tag>
              <el-tag v-if="scope.row.type === 'Y'" type="success">年级</el-tag>
              <el-tag v-if="scope.row.type === 'M'" type="warning">专业</el-tag>
              <el-tag v-if="scope.row.type === 'G'" type="info">班级</el-tag>
            </template>
          </el-table-column>
          <!-- 新增人数列 -->
          <el-table-column align="center" label="学生人数">
            <template slot-scope="scope">
              <span>{{ scope.row.studentCount || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{row}">
              <router-link :to="{path:'/college/class/edit', query:{row:row,id:row.id}}">
                <el-button style="margin-right: 10px;" size="mini">编辑</el-button>
              </router-link>
              <el-button
                v-if="row.type === 'C' || row.type === 'G'"
                type="primary"
                size="mini"
                @click="handleRowClick(row)"
              >人员列表</el-button>
              <el-button
                style="margin-left: 10px;"
                type="danger"
                size="mini"
                @click="deleteItem(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 班级信息弹窗 -->
      <el-dialog title="人员列表" :visible.sync="dialogVisible" width="80%" top="8vh">
        <el-form :model="classQueryParam" ref="classQueryForm" :inline="true">
          <el-form-item label="学号/工号：">
            <el-input v-model="classQueryParam.userName"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input v-model="classQueryParam.nickName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchClass">查询</el-button>
            <el-button type="primary" @click="resetClass" style="margin-left: 10px;">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 班级信息表格 -->
        <el-table :data="ClassUserTable" v-loading="classloading" border fit highlight-current-row>
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="collegeOrClassName" label="所属学院/班级名称" />
          <el-table-column prop="userName" label="工号/学号" />
          <el-table-column prop="nickName" label="姓名" />
          <!-- 角色列：使用作用域插槽处理多角色显示 -->
          <el-table-column label="角色" width="160">
            <template slot-scope="{row}">
              <!-- 使用v-for遍历分割后的角色数组 -->
              <span v-for="role in row.roles.split(',')" :key="role">
                <!-- 根据角色类型显示不同颜色的tag -->
                <el-tag :type="getRoleType(role.trim())" style="margin: 2px;">{{ role.trim() }}</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="70" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === '0'" type="success">正常</el-tag>
              <el-tag v-else type="warning">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="deleteUserByUserId(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <pagination
          v-show="classTotal > 0"
          :total="classTotal"
          :current-page.sync="classQueryParam.pageIndex"
          :page-sizes="[7, 14, 21, 28]"
          :page.sync="classQueryParam.pageIndex"
          :limit.sync="classQueryParam.pageSize"
          @pagination="fetchClassData"
          @size-change="fetchClassData"
        />

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>

      <!-- 在校人员列表弹窗 -->
      <el-dialog title="在校人员列表" :visible.sync="inschoolDialog" width="80%" top="8vh">
        <el-form :model="schoolQueryParam" ref="schoolQueryForm" :inline="true">
          <el-form-item label="学号/工号：">
            <el-input v-model="schoolQueryParam.userName"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input v-model="schoolQueryParam.nickName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSchool">查询</el-button>
            <el-button type="primary" @click="resetSchool" style="margin-left: 10px;">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="inschollTable" border fit highlight-current-row>
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="userName" label="工号/学号" />
          <el-table-column prop="nickName" label="姓名" />
          <el-table-column prop="collegeOrClassName" label="所属学院/班级名称" />

          <el-table-column label="角色" width="160">
            <template slot-scope="{row}">
              <span v-for="role in row.roles.split(',')" :key="role">
                <el-tag :type="getRoleType(role.trim())" style="margin: 2px;">{{ role.trim() }}</el-tag>
              </span>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="70" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === '0'" type="success">正常</el-tag>
              <el-tag v-else type="warning">禁用</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <pagination
          v-show="schoolTotal > 0"
          :total="schoolTotal"
          :current-page.sync="schoolQueryParam.pageIndex"
          :page-sizes="[7, 14, 21]"
          :page.sync="schoolQueryParam.pageIndex"
          :limit.sync="schoolQueryParam.pageSize"
          @pagination="fetchSchoolData"
          @size-change="fetchSchoolData"
        />

        <span slot="footer" class="dialog-footer">
          <el-button @click="inschoolDialog = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  getCollegeTree,
  getClassUserListByNode,
  getSearchUserList,
  getStudentCountByNodeId,
  deleteTreeNode,
  getTemplateByUser,
  deleteUserByUserId
} from "@/api/class";

export default {
  components: { Pagination },
  data() {
    return {
      // 学院树数据
      CollegetableData: [],

      // 班级人员查询参数
      classQueryParam: {
        userName: "",
        nickName: "",
        nodeId: null,
        nodeType: "",
        pageIndex: 1,
        pageSize: 7
      },
      // 在校人员查询参数
      schoolQueryParam: {
        userName: "",
        nickName: "",
        pageIndex: 1,
        pageSize: 7
      },

      // 表格数据
      Traaloading: true,
      ClassUserTable: [],
      inschollTable: [],

      // 分页总数
      classTotal: 0,
      schoolTotal: 0,

      // 控制弹窗
      dialogVisible: false,
      inschoolDialog: false,

      // 其他状态
      classloading: true,
      uploadHeaders: { Authorization: localStorage.getItem("user_token") },
      apiurl: process.env.VUE_APP_API
    };
  },
  created() {
    this.getCollegeTree();
  },
  methods: {
    // 获取学院树
    async getCollegeTree() {
      try {
        const res = await getCollegeTree();
        if (res.code === 200) {
          this.CollegetableData = res.data;
          // 初始化时获取每个结点的人数
          this.updateStudentCountForAllNodes(this.CollegetableData);
          this.Traaloading = false;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        this.$message.error("学院数据加载失败");
      }
    },

    // 递归更新所有结点的人数
    async updateStudentCountForAllNodes(nodes) {
      if (!nodes || nodes.length === 0) return;

      for (let node of nodes) {
        // 获取当前结点的人数
        await this.getStudentCountByNodeId(node);
        // 如果有子结点，递归更新子结点的人数
        if (node.children && node.children.length > 0) {
          await this.updateStudentCountForAllNodes(node.children);
        }
      }
    },

    // 获取结点对应人数
    async getStudentCountByNodeId(data) {
      try {
        const res = await getStudentCountByNodeId(data.id, data.type);
        if (res.code === 200) {
          // 将人数数据存储到结点对象中
          data.studentCount = res.data;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        this.$message.error("获取班级人数失败");
      }
    },

    // 点击树节点
    handleRowClick(row) {
      if (!["C", "G"].includes(row.type)) return;
      this.classQueryParam = {
        ...this.classQueryParam,
        nodeId: row.id,
        nodeType: row.type,
        pageIndex: 1 // 重置页码
      };
      this.fetchClassData();
      this.dialogVisible = true;
    },

    //删除树节点
    deleteItem(id) {
      this.$confirm(
        "删除节点需保证节点下无子节点！且没有绑定人员！此操作将永久删除该节点, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        deleteTreeNode(id).then(res => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getCollegeTree();
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    // 获取班级人员数据
    async fetchClassData() {
      this.classloading = true;
      try {
        const res = await getClassUserListByNode(this.classQueryParam);
        if (res.code === 200) {
          this.ClassUserTable = res.data.records;
          this.classTotal = res.data.total;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      } finally {
        this.classloading = false;
      }
    },

    // 班级查询
    searchClass() {
      this.classQueryParam.pageIndex = 1;
      this.fetchClassData();
    },

    // 班级重置
    resetClass() {
      this.classQueryParam.userName = "";
      this.classQueryParam.nickName = "";
      this.searchClass();
    },

    // 打开在校人员列表
    openList() {
      this.schoolQueryParam.pageIndex = 1;
      this.fetchSchoolData();
      this.inschoolDialog = true;
    },

    // 获取在校人员数据
    async fetchSchoolData() {
      try {
        const res = await getSearchUserList(this.schoolQueryParam);
        if (res.code === 200) {
          this.inschollTable = res.data.records;
          this.schoolTotal = res.data.total;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        this.$message.error("数据加载失败");
      }
    },

    // 在校人员查询
    searchSchool() {
      this.schoolQueryParam.pageIndex = 1;
      this.fetchSchoolData();
    },

    // 在校人员重置
    resetSchool() {
      this.schoolQueryParam.userName = "";
      this.schoolQueryParam.nickName = "";
      this.searchSchool();
    },

    //删除学生/教师
    deleteUserByUserId(row) {
      const data = {
        userId: row.userId,
        nodeId: this.classQueryParam.nodeId
      };
      this.$confirm("此操作将永久删除该用户，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteUserByUserId(this.schoolQueryParam).then(res => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.fetchSchoolData();
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    //获取批量导入模板
    async getTemplate() {
      try {
        const res = await getTemplateByUser();

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
        link.download = `组织绑定模板(一个班级只能有一个老师).xlsx`;

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

    // 处理文件上传成功
    handleSuccess(res) {
      if (res.code === 200) {
        this.$message.success("导入成功");
        this.fetchClassData(); // 刷新当前列表
      } else if (res.code === 500) {
        this.$message.error(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },

    // 角色类型颜色映射方法
    getRoleType(role) {
      switch (role) {
        case "管理员":
          return "danger"; // 红色表示管理员
        case "老师":
          return "primary"; // 蓝色表示老师
        case "学生":
          return "warning"; // 黄色表示学生
        default:
          return "info"; // 其他角色使用默认颜色
      }
    }
  }
};
</script>

<style>
.upload-demo {
  display: inline-block;
  margin: 0 10px;
}
</style>