<template>
  <div>
    <PageTitle :title="'我的申请'"></PageTitle>
    <div class="Apply-list">
      <el-table
        :data="tableData.filter(data => !search || data.classname.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%"
      >
      <el-table-column size="small" label="序号" prop="number"></el-table-column>
        <el-table-column size="small" label="奖项名称" prop="BounsName"></el-table-column>
        <el-table-column size="small" label="奖项类型" prop="BonusClass"></el-table-column>

        <el-table-column size="small" label="申请时间" prop="startdate"></el-table-column>
        <el-table-column size="small" label="状态" prop="state">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === '已通过'">{{ scope.row.state }}</el-tag>
            <el-tag v-if="scope.row.state === '待审核'" type="warning">{{ scope.row.state }}</el-tag>
            <el-tag v-if="scope.row.state === '未通过'" type="danger">{{ scope.row.state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column size="small" align="right">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
          </template>
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.state === '待审核' "
              size="small"
              type="primary"
              @click="handleStart(scope.$index, scope.row)"
            >查看详情</el-button>
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
          number:1,
          BounsName: "国家一等奖",
          BonusClass:"国家级奖学金",
          startdate: "2016-05-02",
          enddate: "2016-05-02",
          state: "已通过",
        },
        {
          number:2,
          BounsName: "优秀学生一等奖",
          BonusClass:"校级奖学金",
          startdate: "2016-05-02",
          enddate: "2016-05-02",
          state: "待审核",
        },
        {
          number:3,
          BounsName: "优秀学生二等奖",
          BonusClass:"校级奖学金",
          startdate: "2016-05-02",
          enddate: "2016-05-02",
          state: "未通过",
        }
      ],
      search: ""
    };
  },
  methods: {
    handleStart(index, row) {
      console.log(index, row);
    }
  },
  components: {
    PageTitle
  }
};
</script>

<style>
.Apply-list {
  margin-top: 20px;
}
</style>
