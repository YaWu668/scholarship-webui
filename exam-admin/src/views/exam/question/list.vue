<template>
  <div class="app-container">
    <div class="app-container-question">
      <el-form :model="queryParam" ref="queryForm" :inline="true">
        <el-form-item label="题干：">
          <el-input v-model="queryParam.textContext" clearable></el-input>
        </el-form-item>

        <el-form-item label="题型：">
          <el-select v-model="queryParam.questionType" @change="search" clearable>
            <el-option
              v-for="item in questionType"
              :key="item.key"
              :value="item.key"
              :label="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button size="medium" @click="resetSearch" type="primary">重置列表</el-button>
          <el-button size="medium" @click="getTemplate" type="primary">获取批量导入题目模板</el-button>
          <el-popover placement="bottom" trigger="click">
            <el-button
              type="warning"
              size="mini"
              v-for="item in editUrlEnum"
              :key="item.key"
              @click="$router.push({path:item.value})"
            >{{item.name}}</el-button>
          </el-popover>
          <el-upload
            class="upload-demo"
            :action="this.apiurl+`/exam/admin/importQuestionBank/`"
            :show-file-list="false"
            :on-success="handleSuccess"
            :headers="uploadHeaders"
            :limit="1"
          >
            <el-button size="medium" type="primary">批量导入题目</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
        <el-table-column label="序号" width="90px">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="questionType"
          label="题型"
          :formatter="questionTypeFormatter"
          width="70px"
        />
        <el-table-column prop="textContext" label="题干" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="160px" />
        <el-table-column label="操作" align="center" width="220px">
          <template slot-scope="{row}">
            <el-button size="mini" type="danger" @click="deleteQuestion(row)" class="link-left">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件，用于分页显示数据 -->
      <pagination
        v-show="total>0"
        :total="total"
        :current-page.sync="pageIndex"
        :page-sizes="[13, 26, 39, 58]"
        :page.sync="queryParam.pageIndex"
        :limit.sync="queryParam.pageSize"
        @size-change="search"
        @pagination="search"
      />
      <el-dialog :visible.sync="questionShow.dialog" style="width: 100%;height: 100%">
        <QuestionShow
          :qType="questionShow.qType"
          :question="questionShow.question"
          :qLoading="questionShow.loading"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Pagination from "@/components/Pagination";
import QuestionShow from "./components/Show";
import { getQuestionList, deleteQuestion,getQuestionTemplate } from "@/api/question";

export default {
  components: { Pagination, QuestionShow },
  data() {
    return {
      queryParam: {
        pageIndex: 1,
        pageSize: 13,
        questionType: null,
        textContext: ""
      },
      listLoading: true,
      tableData: [],
      total: 0, //总条数
      currentPage: 1, //当前页码
      questionShow: {
        qType: 0,
        dialog: false,
        question: null,
        loading: false
      },
      uploadHeaders: {
        Authorization: localStorage.getItem("user_token")
      },
      apiurl: process.env.VUE_APP_API // 上传的地址
    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.listLoading = true;
      getQuestionList(this.queryParam).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.total = res.data.total;
          this.listLoading = false;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //批量导入
    handleSuccess(response, file) {
      // response是后端返回的数据，file是上传的文件对象
      // 这里可以对response进行处理，例如检查是否上传成功
      if (response.code == 200) {
        this.$message.success("导入成功：" + response.data);
        this.search(); // 刷新表格数据
      } else if (response.code == 400) {
        this.$message.error(response.msg);
      } else if (response.code == 500) {
        this.$message.error(response.msg);
      }
      // 调用handlePreview方法，可以根据需要传递参数
      this.handlePreview(file);
    },
    //删除题目
    deleteQuestion(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteQuestion(row).then(res => {
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //重置列表
    resetSearch() {
      this.queryParam = {
        pageIndex: 1,
        pageSize: 13,
        questionType: null,
        textContext: ""
      };
      this.search();
    },
    questionTypeFormatter(row, column, cellValue, index) {
      return this.enumFormat(this.questionType, cellValue);
    },
    //获取批量导入学生违纪情况模板
    async getTemplate() {
      try {
        const res = await getQuestionTemplate();

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
        link.download = `批量导入题目模板.xlsx`;

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
    }
  },
  computed: {
    ...mapGetters("enumItem", ["enumFormat"]),
    ...mapState("enumItem", {
      questionType: state => state.exam.question.typeEnum,
      editUrlEnum: state => state.exam.question.editUrlEnum
    })
  }
};
</script>

<style>
.app-container-question .upload-demo {
  display: inline-block;
  margin-left: 10px;
}
</style>