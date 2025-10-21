<template>
  <!-- 容器div，用于包含整个页面的内容 -->
  <div class="app-container Bonus">
    <!-- 创建一个表单，用于输入查询参数 -->
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <!-- 学生姓名输入框 -->
      <el-form-item label="评奖年度名称：">
        <el-input v-model="queryParam.annuPrizeName"></el-input>
      </el-form-item>
      <!-- 查询和添加按钮 -->
      <el-form-item>
        <el-button style="margin-right: 10px;" type="primary" @click="search">查询</el-button>
        <router-link v-if="role != 'teacher'" :to="{path:'/bonus/edit', query:{row:null}}">
          <el-button type="primary" @click="AddBounsDialog= true">创建评奖年度</el-button>
        </router-link>
        <el-button style="margin-left: 10px;" type="primary" @click="getTemplate">获取批量导入学生违纪情况模板</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格，用于展示学生数据 -->
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="annuPrizeName" label="评奖年度" />

      <!-- 年级列，格式化展示 -->
      <el-table-column label="年级">
        <template slot-scope="{row}">{{ formatGrade(row.gradeLevelRequired) }}</template>
      </el-table-column>

      <!-- 关联学生手册年度列 -->
      <el-table-column prop="yearTypeName" label="关联学生手册年度" />

      <!-- 开始时间列，格式化展示 -->
      <el-table-column label="开始时间">
        <template slot-scope="{row}">{{ formatDate(row.startTime) }}</template>
      </el-table-column>

      <!-- 结束时间列，格式化展示 -->
      <el-table-column label="结束时间">
        <template slot-scope="{row}">{{ formatDate(row.endTime) }}</template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" align="center" width="400px">
        <template slot-scope="{row}">
          <el-upload
            class="upload-demo upload-disciplinary"
            :action="apiurl+`/exam/school/batchImportDisciplinary`"
            :show-file-list="false"
            :on-success="handleSuccess"
            :headers="uploadHeaders"
            :data="{ annuPrizeId: row.annuPrizeId }"
            :limit="1"
          >
            <el-button size="mini" type="primary">导入违纪情况</el-button>
          </el-upload>

          <el-popover placement="top" width="200" trigger="click">
            <!-- 关键修改：添加 trigger 属性 -->
            <div style="display: flex;">
              <router-link :to="{path:'/bonus/import', query:{type:1}}">
                <el-button size="mini" type="primary" class="link-left">基础成绩</el-button>
              </router-link>
              <router-link :to="{path:'/bonus/import', query:{type:2}}">
                <el-button size="mini" type="primary" class="link-left">课程成绩</el-button>
              </router-link>
            </div>
            <el-button class="link-left" type="primary" size="mini" slot="reference">导入成绩</el-button>
          </el-popover>
          <router-link :to="{path:'/bonus/edit', query:{row:row}}">
            <el-button class="link-left" size="mini">编辑</el-button>
          </router-link>
          <el-button size="mini" type="danger" @click="deleteBonus(row)" class="link-left">删除</el-button>
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
      @pagination="search"
      @size-change="search"
    />
  </div>
</template>

<script>
// 导入所需的辅助函数和组件
import Pagination from "@/components/Pagination";
import {
  getBonusYear,
  getDisciplinaryTemplate,
  deleteBonusYearly
} from "@/api/bonus";

// 定义Vue组件
export default {
  components: { Pagination },
  data() {
    return {
      role: "", //用户角色
      // 弹窗是否可见
      dialogVisible: false,
      // 定义查询参数
      queryParam: {
        annuPrizeName: "",
        pageIndex: 1,
        pageSize: 13
      },
      // 表格数据
      tableData: [],
      addBounsForm: {},
      // 总数据条目数
      total: 0,
      AddBounsDialog: false, //添加奖励弹窗
      value: "",
      visible: false,
      uploadHeaders: {
        Authorization: localStorage.getItem("user_token")
      }, //上传文件时携带的请求头
      apiurl: process.env.VUE_APP_API // 上传的地址
    };
  },
  // 组件创建后执行的方法
  created() {
    this.role = localStorage.getItem("user_role");
    this.search();
  },
  methods: {
    // 查询学生数据的方法
    search() {
      // TODO: 实现API调用获取数据
      getBonusYear(this.queryParam).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //删除评奖年度
    deleteBonus(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteBonusYearly({ annuPrizeId: row.annuPrizeId }).then(res => {
          if (res.code === 200) {
            this.$message.success("删除成功！");
            this.search();
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    //获取批量导入学生违纪情况模板
    async getTemplate() {
      try {
        const res = await getDisciplinaryTemplate();

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
        link.download = `批量导入学生违纪情况模板.xlsx`;

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
    //批量导入学生违纪情况
    handleSuccess(response, file) {
      if (response.code === 200) {
        this.$message.success("导入成功！");
        this.f;
      } else if (response.code === 500) {
        this.$message.error(response.msg);
      } else {
        this.$message.error(response.msg);
      }
    },

    // 格式化时间，只展示日期部分
    formatDate(time) {
      if (!time) return "";
      // 使用split方法提取日期部分
      return time.split("T")[0];
    },

    // 格式化年级，去掉多余的符号
    formatGrade(grade) {
      if (!grade) return "";
      // 去掉开头的[和结尾的]，然后split分割成数组
      const grades = grade.replace(/^\[|\"|\]$/g, "").split('","');
      // 如果有多个年级，用逗号分隔展示
      return grades.join("、");
    }
  }
};
</script>

<style>
.Bonus .link-left {
  margin-left: 10px;
}
.Bonus .upload-disciplinary {
  display: inline-block;
}
</style>