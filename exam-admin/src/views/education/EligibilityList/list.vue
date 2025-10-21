<template>
  <!-- 容器div，用于包含整个页面的内容 -->
  <div class="app-container">
    <!-- 创建一个表单，用于输入查询参数 -->
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="试卷名称：">
        <el-select v-model="queryParam.yearTypeName" @change="search" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
          <el-option v-if="!options.length" disabled value label="请选择" />
        </el-select>
      </el-form-item>
      <!-- 学生姓名输入框 -->
      <el-form-item label="学生姓名：">
        <el-input v-model="queryParam.nickName"></el-input>
      </el-form-item>
      <!-- 查询和添加按钮 -->
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="add">批量导入考试资格</el-button>
        <el-button type="primary" @click="getEligibilityTemplate">获取导入考试资格模板</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格，用于展示学生数据 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <!-- 定义表格列 -->
      <el-table-column prop="userName" label="学号" />
      <el-table-column prop="nickName" label="学生姓名" />
      <el-table-column prop="yearTypeName" label="年度" />
      <!-- 操作列，使用插槽自定义显示 -->
      <el-table-column width="220px" label="操作" align="center">
        <template slot-scope="{row}">
          <!-- 编辑学生信息按钮，点击后跳转到编辑页面 -->
          <!-- <router-link
            :to="{path:`/education/EligibilityList/edit?`+`nickName=${row.nickName}&userName=${row.userName}`}"
            class="link-left"
          >
            <el-button size="mini" type="primary">分配资格</el-button>
          </router-link> -->
          <!-- 删除学生信息按钮 -->
          <el-button size="mini" type="danger" @click="deleteUser(row)" class="link-left">删除</el-button>
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
      @size-change="getEligibilityList"
      @pagination="getEligibilityList"
    />
  </div>
</template>

<script>
// 导入所需的辅助函数和组件
import { mapGetters, mapState } from "vuex";
import Pagination from "@/components/Pagination";
import {
  getEligibilityList,
  deleteEligibility,
  getExamList,
  getEligibilityListByinfo,
  getEligibilityTemplate
} from "@/api/exam";

// 定义Vue组件
export default {
  components: { Pagination },
  data() {
    return {
      // 定义查询参数
      queryParam: {
        nickName: "",
        role: 1,
        yearTypeName: "",
        pageIndex: 1,
        pageSize: 13
      },
      currentPage: 1,
      // 表格数据
      tableData: [],
      // 总数据条目数
      total: 0,
      // 试卷年度枚举
      options: [],
      yearvalue: "", //年度类型
      loading: true
    };
  },
  // 组件创建后执行的方法
  created() {
    this.getEligibilityList();
    this.getyearType();
  },
  methods: {
    // 获取学生考试资格列表
    getEligibilityList() {
      getEligibilityList(this.queryParam).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else if (res.code === 400) {
          this.$message.error(res.msg);
          logout();
        }
      });
    },
    //获取试卷年度列表
    getyearType() {
      this.queryParam.pageSize = 10000;
      getExamList(this.queryParam).then(res => {
        if (res.code === 200) {
          this.options = [
            { value: null, label: "请选择" }, // 添加默认选项
            ...res.data.list.map(item => ({
              value: item.yearTypeName.toString(),
              label: item.yearTypeName.toString() // 确保 label 是字符串类型
            }))
          ];
        }
      });
      this.queryParam.pageSize = 13;
    },

    // 查询学生数据的方法
    search() {
      getEligibilityListByinfo(this.queryParam).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        }
      });
      // TODO: 实现API调用获取数据
    },
    add() {
      this.$router.push("/education/EligibilityList/add");
    },
    async getEligibilityTemplate() {
      try {
        const res = await getEligibilityTemplate();

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
        link.download = `学生手册年度考试资格批量导入模板.xlsx`;

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
    // 删除学生信息的方法
    deleteUser(row) {
      // TODO: 实现删除学生信息的逻辑
      this.$confirm("此操作将删除该同学的考试资格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteEligibility(row.examEligibilityId).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getEligibilityList();
            } else if (res.code === 401) {
              this.$alert("登录状态过期，请重新登录", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.$message({
                    type: "error",
                    message: `请重新登录`
                  });
                }
              });
              localStorage.removeItem("user_token");
              this.$router.push("/login");
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 提交表单的方法
    submitForm() {
      this.queryParam.pageIndex = 1;
      this.search();
    },
    // 格式化状态的方法
    statusFormatter(status) {
      return this.enumFormat(this.statusEnum, status);
    },
    // 格式化状态标签的方法
    statusTagFormatter(status) {
      return this.enumFormat(this.statusTag, status);
    }
  },
  // 计算属性，从Vuex映射状态和计算属性
  computed: {
    ...mapGetters("enumItem", ["enumFormat"]),
    ...mapState("enumItem", {
      statusEnum: state => state.education.statusEnum,
      statusTag: state => state.education.statusTag
    })
  }
};
</script>