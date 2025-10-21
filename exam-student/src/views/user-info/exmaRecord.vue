<template>
  <div>
    <PageTitle :title="'考试记录'"></PageTitle>
    <div class="test-list">
      <el-table :data="filteredTableData" v-loading="loading" style="width: 100%">
        <el-table-column size="small" label="序号" width="50">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column size="small" label="考试年度" prop="yearTypeName" width="400"></el-table-column>
        <el-table-column size="small" label="状态" prop="state" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isPass === 1" type="success">已通过</el-tag>
            <el-tag v-if="scope.row.isPass === 0 " type="danger">未及格</el-tag>
          </template>
        </el-table-column>
        <el-table-column size="small" label="考试时间" prop="endTime"></el-table-column>
        <el-table-column size="small" label="成绩" prop="totalPoints"></el-table-column>
        <el-table-column size="small" align="right">
          <template slot="header">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
          </template>
          <template slot-scope="scope">
            <router-link :to="{ path: '/ExamDestail', query: { testPaperId: scope.row.testPaperId } }">
              <el-button size="small" type="primary">查看详细</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParam.pageIndex"
        :limit="queryParam.pageSize"
        @pagination="searchdata"
        style="margin-top: 20px"
      />
    </div>
  </div>
</template>
  
  <script>
import PageTitle from "@/components/PageTitle";
import Pagination from "@/components/Pagination";
import { getHistoryExamRecord } from "@/api/exam";

export default {
  data() {
    return {
      queryParam: {
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      search: "",
      total: 0,
      loading: true
    };
  },
  created() {
    this.searchdata();
  },
  methods: {
    searchdata() {
      let pageIndex = this.queryParam.pageIndex;
      let pageSize = this.queryParam.pageSize;
      getHistoryExamRecord(pageIndex, pageSize)
        .then(res => {
          if (res.code === 200) {
            this.loading = false;
            this.total = res.data.total;
            this.tableData = res.data.list;
          } else {
            console.error("数据请求失败，错误码：", res.code); // 打印错误码方便排查问题
            // 可以在这里添加提示用户的逻辑，比如使用Element UI的消息提示组件
            this.$message.error("数据获取失败，请稍后再试");
          }
        })
        .catch(err => {
          console.error("请求发生异常：", err); // 捕获请求过程中的异常并打印
          this.$message.error("请求出现异常，请联系管理员");
        });
    }
    // search() {}
  },
  computed: {
    filteredTableData() {
      return this.tableData.filter(
        data =>
          !this.search ||
          data.yearTypeName.toLowerCase().includes(this.search.toLowerCase())
      );
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
.test-list .cell {
  text-align: center;
}
</style>
  