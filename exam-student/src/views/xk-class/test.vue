<template>
  <div>
    <PageTitle :title="'题库练习'"></PageTitle>
    <div class="test-list">
      <el-table
        :data="tableData.filter(data => !search || data.classname.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%"
      >
        <el-table-column size="small" label="序列号" prop="number"></el-table-column>
        <el-table-column size="small" label="练习名称" prop="classname"></el-table-column>
        <el-table-column size="small" label="状态" prop="state">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === '正常'">{{ scope.row.state }}</el-tag>
            <el-tag v-if="scope.row.state === '未开始'" type="warning">{{ scope.row.state }}</el-tag>
            <el-tag v-if="scope.row.state === '已结束'" type="danger">{{ scope.row.state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column size="small" label="开始时间" prop="startdate"></el-table-column>
        <el-table-column size="small" label="结束时间" prop="enddate"></el-table-column>
        <el-table-column size="small" align="right">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
          </template>
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.state === '已结束' || scope.row.state === '未开始'"
              size="small"
              type="primary"
              @click="handleStart(scope.$index, scope.row)"
            >前往练习</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import PageTitle from "@/components/PageTitle";
export default {
  data() {
    return {
      tableData: [
        {
          number: 1,
          classname: "学生手册",
          startdate: "2016-05-02",
          enddate: "2016-05-02",
          state: "未开始",
        },
        {
          number: 2,
          classname: "通识课程",
          startdate: "2016-05-02",
          enddate: "2016-05-02",
          state: "正常",
        },
        {
          number: 3,
          classname: "其他课程",
          startdate: "2016-05-02",
          enddate: "2016-05-02",
          state: "已结束",
        }
      ],
      search: ""
    };
  },
  methods: {
    handleStart(index, row) {
      this.$router.push('/dotest');
      console.log(index, row);
    }
  },
  components: {
    PageTitle
  }
};
</script>

<style>
.test-list {
  margin-top: 20px;
}
</style>
