<template>
  <div>
    <PageTitle :title="'在线考试'"></PageTitle>
    <div class="test-list">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column size="small" label="序号" width="50">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column size="small" label="考试年度" prop="yearTypeName"></el-table-column>
        <el-table-column size="small" label="状态" prop="state">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === '正常'">{{ scope.row.state }}</el-tag>
            <el-tag v-if="scope.row.state === '未开始'" type="warning">{{ scope.row.state }}</el-tag>
            <el-tag v-if="scope.row.state === '已结束'" type="danger">{{ scope.row.state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column size="small" label="开始时间" prop="beginTime"></el-table-column>
        <el-table-column size="small" label="结束时间" prop="endTime"></el-table-column>
        <el-table-column align="right">
          <template slot="header">
            <el-input v-model="search" size="small" placeholder="输入关键字搜索" />
          </template>
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.state === '已结束' || scope.row.state === '未开始'"
              size="small"
              type="primary"
              @click="handleStart(scope.row)"
            >开始考试</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 当过滤后的数据为空时不显示分页器 -->
      <pagination
        v-show="tableData.length > 0"
        :total="tableData.length"
        :page.sync="queryParam.pageIndex"
        :limit="queryParam.pageSize"
        @pagination="getTestPaperList"
        style="margin-top: 20px"
      />
    </div>
  </div>
</template>

<script>
import PageTitle from "@/components/PageTitle";
import Pagination from "@/components/Pagination";
import { getTestPaperList } from "@/api/exam";

export default {
  data() {
    return {
      tableData: [],
      search: "",
      queryParam: {
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      loading: true,
    };
  },
  computed: {
    // 移除了 filteredTableData 过滤计算属性
  },
  created() {
    this.getTestPaperList();
  },
  methods: {
    async getTestPaperList() {
      let pageIndex = this.queryParam.pageIndex;
      let pageSize = this.queryParam.pageSize;
      getTestPaperList(pageIndex, pageSize).then(res => {
        if (res.code === 200) {
          this.loading = false;
          this.total = res.data.total;
          // 处理每个考试项的状态
          this.tableData = res.data.list.map(exam => {
            const beginTime = new Date(exam.beginTime);
            const endTime = new Date(exam.endTime);
            const now = new Date();

            let state = "";

            if (now >= beginTime && now <= endTime) {
              state = "正常";
            } else if (now < beginTime) {
              state = "未开始";
            } else if (now > endTime) {
              state = "已结束";
            }

            // 返回新的考试对象，包含计算后的状态
            return {
              ...exam,
              state
            };
          });
        } else if (res.code === 401) {
          this.$message.error(res.msg);
          localStorage.removeItem("user_token");
          this.$router.push({ path: "/login" });
        }
      });
    },
    handleStart(row) {
      // 传递当前行数据
      this.$router.push({ path: "/enInfo", query: { examId: row.yearTypeId,yearTypeName:row.yearTypeName } });
    }
  },
  components: {
    PageTitle,
    Pagination
  }
};
</script>

<style>
.test-list {
  margin-top: 20px;
}
</style>