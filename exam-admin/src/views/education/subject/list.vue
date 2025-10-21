<template>
  <!-- 容器div，用于包含整个页面的内容 -->
  <div class="app-container">
    <!-- 创建一个表单，用于输入查询参数 -->
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="年度名称：">
        <el-select v-model="queryParam.yearTypeId" @change="search" filterable placeholder="请选择">
          <el-option
            v-for="item in yearoptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
          <el-option v-if="!options.length" disabled value label="请选择" />
        </el-select>
      </el-form-item>

      <el-form-item label="考试状态：">
        <el-select v-model="queryParam.isPass" @change="search" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            @change="search"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 学生姓名输入框 -->
      <el-form-item label="学生姓名：">
        <el-input v-model="queryParam.userName"></el-input>
      </el-form-item>
      <!-- 查询和添加按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
        <!-- <el-button type="primary">批量导出</el-button> -->
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
      <el-table-column label="序号" width="80px">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="学号" />
      <el-table-column prop="nickName" label="学生姓名" />
      <el-table-column prop="yearTypeName" label="试卷名称" />
      <el-table-column prop="endTime" label="学生考试时间" />
      <el-table-column prop="totalPoints" label="学生成绩" width="160px" />
      <!-- 状态列，使用插槽自定义显示 -->
      <el-table-column label="考试状态" prop="status" width="80px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isPass === 1" type="success">已通过</el-tag>
          <el-tag v-if="scope.row.isPass === 0 " type="warning">不及格</el-tag>
        </template>
      </el-table-column>
      <!-- 操作列，使用插槽自定义显示 -->
      <el-table-column width="220px" label="操作" align="center">
        <template slot-scope="{row}">
          <!-- 编辑学生信息按钮，点击后跳转到编辑页面 -->
          <!-- <router-link :to="{path:'/user/student/edit', query:{id:row.id}}" class="link-left">
            <el-button size="mini">编辑</el-button>
          </router-link>-->
          <!-- 删除学生信息按钮 -->
          <el-button size="mini" type="danger" @click="deleteUser(row.testPaperId)" class="link-left">删除</el-button>
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
  </div>
</template>

<script>
// 导入所需的辅助函数和组件
import { mapGetters, mapState } from "vuex";
import Pagination from "@/components/Pagination";
import { getStudentExamList, getExamList, deleteStudentExam } from "@/api/exam";

// 定义Vue组件
export default {
  components: { Pagination },
  data() {
    return {
      // 定义查询参数
      queryParam: {
        role: 3,
        pageIndex: 1,
        pageSize: 13,
        nickName: "", //姓名
        userName: "", //学号
        yearTypeId: null,
        isPass: null
      },
      loading: true,
      // 表格数据
      tableData: [],
      // 总数据条目数
      total: 0,
      // 当前页码
      currentPage: 1,
      // 状态枚举
      options: [
        {
          value: null,
          label: "所有学生"
        },
        {
          value: 1,
          label: "已通过"
        },
        {
          value: 0,
          label: "不及格"
        }
      ], // 试卷年度枚举
      yearoptions: [],
      yearvalue: "", //年度类型
      value: ""
    };
  },
  // 组件创建后执行的方法
  created() {
    this.isAdmin();
    this.search();
    this.getyearType();
  },
  methods: {
    //判断用户是否为管理员
    isAdmin() {
      const user = localStorage.getItem("user_role");
      if (user === "admin") {
        this.queryParam.role = 3;
      } else if (user === "teacher") {
        this.queryParam.role = 2;
      }
    },
    // 查询学生数据的方法
    search() {
      getStudentExamList(this.queryParam).then(res => {
        if (res.code == 200) {
          this.loading = false;
          this.tableData = res.data.list;
          this.total = res.data.total;
          console.log(res.data);
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
      // .catch(err => {
      //   this.$message.error(res.msg);
      // });
    },
    //获取试卷年度列表
    getyearType() {
      getExamList(this.queryParam).then(res => {
        if (res.code === 200) {
          this.yearoptions = [
            { value: null, label: "请选择" }, // 添加默认选项
            ...res.data.list.map(item => ({
              value: item.yearTypeId,
              label: item.yearTypeName.toString() // 确保 label 是字符串类型
            }))
          ];
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 删除学生数据的方法
    deleteUser(id) {
      this.$confirm("此操作将永久删除该学生, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteStudentExam(id).then(res => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.search();
          }else if (res.code === 500) {
            this.$message.error(res.msg);
          }else{
            this.$message.error(res.msg);
          }
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