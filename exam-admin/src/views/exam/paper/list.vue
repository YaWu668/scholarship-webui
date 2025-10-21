<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="年度：">
        <el-input v-model="queryParam.yearTypeName" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button type="primary" @click="search" style="margin-left: 5px;">重置</el-button>
        <router-link :to="{path:'/education/paper/edit',query:{id:0}}" class="link-left">
          <el-button type="primary">添加</el-button>
        </router-link>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" align="center" width="50px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="yearTypeName" label="年度" />
      <el-table-column prop="beginTime" label="开始时间" width="160px" />
      <el-table-column prop="endTime" label="结束时间" width="160px" />
      <el-table-column prop="createTime" label="创建时间" width="160px" />
      <el-table-column label="操作" align="center" width="160px">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            @click="$router.push({path:`/education/paper/edit?`+`id=${row.yearTypeId}&yearTypeName=${row.yearTypeName}`})"
            class="link-left"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteItem(row.yearTypeId)"
            class="link-left"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
import Pagination from "@/components/Pagination";
import { getExamList, getExamListByinfo, deletePaper } from "@/api/exam";

export default {
  components: { Pagination },
  data() {
    return {
      queryParam: {
        yearTypeName: "",
        level: 1,
        subjectId: null,
        pageIndex: 1,
        pageSize: 13
      },
      subjectFilter: null,
      listLoading: true,
      tableData: [],
      total: 0,
      currentPage: 1
    };
  },
  created() {
    this.search();
  },
  methods: {
    submitForm() {
      getExamListByinfo(this.queryParam).then(res => {
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
    search() {
      getExamList(this.queryParam).then(res => {
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
    //删除年度信息
    deleteItem(id) {
      this.$confirm("此操作将永久删除这场考试, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletePaper(id).then(res => {
            if (res.code == 200) {
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
    }
  },
  computed: {}
};
</script>
