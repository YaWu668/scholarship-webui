<template>
  <div class="MyCredit">
    <PageTitle :title="'我的学分'"></PageTitle>
    <div class="Credit-list">
      <el-table
        :data="tableData.filter(data => !search || data.classname.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item size="small" label="ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item size="small" label="学分名称">
                <span>{{ props.row.CreditName }}</span>
              </el-form-item>
              <el-form-item size="small" label="商品分类">
                <span>{{ props.row.CreditClass }}</span>
              </el-form-item>
              <el-form-item size="small" label="分值">
                <span>{{ props.row.CreditScore }}</span>
              </el-form-item>
              <el-form-item size="small" label="申请时间">
                <span>{{ props.row.ApplicationTime }}</span>
              </el-form-item>
              <el-form-item size="small" label="通过时间">
                <span>{{ props.row.PassTime }}</span>
              </el-form-item>
              <el-form-item size="small" label="学分描述">
                <span>{{ props.row.Creditdesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column size="small" label="序列号" prop="id"></el-table-column>
        <el-table-column size="small" label="学分名称" prop="CreditName"></el-table-column>
        <el-table-column size="small" label="分值" prop="CreditScore"></el-table-column>
        <el-table-column size="small" align="right">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="small" placeholder="输入关键字搜索" />
          </template>
          <!-- <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleStart(scope.$index, scope.row)"
            >查看</el-button>
          </template> -->
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
          id: 1,
          CreditName: "人文素质",
          CreditClass: "基础学分",
          CreditScore: 4,
          ApplicationTime: "2024-09-01",
          PassTime: "2024-09-10",
          Creditdesc: "通过后，可获得该课程的学习资料、作业、考试等资料。"
        },
        {
          id: 2,
          CreditName: "创新创业实践",
          CreditClass: "基础学分",
          CreditScore: 2,
          ApplicationTime: "2024-09-01",
          PassTime: "2024-09-10",
          Creditdesc: "通过后，可获得该课程的学习资料、作业、考试等资料。"
        },
        {
          id: 3,
          CreditName: "生产实习",
          CreditClass: "基础学分",
          CreditScore: 2,
          ApplicationTime: "2024-09-01",
          PassTime: "2024-09-10",
          Creditdesc: "通过后，可获得该课程的学习资料、作业、考试等资料。"
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
.MyCredit {
  min-height: 80%;
}
.Credit-list {
  margin-top: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>