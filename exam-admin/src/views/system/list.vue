<template>
  <!-- 容器div，用于包含整个页面的内容 -->
  <div class="app-container">
    <!-- 创建一个表单，用于输入查询参数 -->
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <!-- 学生姓名输入框 -->
      <el-form-item label="系统参数名称：">
        <el-input v-model="queryParam.configName"></el-input>
      </el-form-item>
      <!-- 查询和添加按钮 -->
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <!-- 添加新学生按钮，点击后跳转到添加页面 -->
        <router-link :to="{path:'/config/edit'}" class="link-left">
          <el-button type="primary">添加</el-button>
        </router-link>
        <!-- 批量导入按钮 -->
        <el-button type="primary" @click="resetList" style="margin-left: 10px;">重置列表</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格，用于展示学生数据 -->
    <el-table
      :data="tableData"
      v-loading="formloading"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <!-- 定义表格列 -->
      <el-table-column label="序号">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="configName" label="参数名称" />
      <el-table-column prop="configValue" label="参数值" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="createTime" label="创建时间" />
      <!-- 操作列，使用插槽自定义显示 -->
      <el-table-column width="220px" label="操作" align="center">
        <template slot-scope="{row}">
          <!-- 编辑学生信息按钮，点击后跳转到编辑页面 -->
          <router-link :to="{path:'/config/edit', query:{id:row.configId}}" class="link-left">
            <el-button size="mini">编辑</el-button>
          </router-link>
          <!-- 删除学生信息按钮 -->
          <el-button
            size="mini"
            type="danger"
            @click="deleteConfig(row.configId)"
            class="link-left"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件，用于分页显示数据 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[13, 26, 39, 48]"
      :current-page.sync="queryParam.current"
      :page.sync="queryParam.current"
      :limit.sync="queryParam.limit"
      @pagination="search"
      @size-change="search"
    />
  </div>
</template>

<script>
// 导入所需的辅助函数和组件
import Pagination from "@/components/Pagination";
import { getSysConfig, deleteSysConfig } from "@/api/config";

// 定义Vue组件
export default {
  components: { Pagination },
  data() {
    return {
      // 定义查询参数
      queryParam: {
        configName: "",
        configTyp: "Y",
        current: 1,
        limit: 13
      },
      formloading: true,
      tableData: [], // 表格数据
      total: 0 // 总数据条目数
    };
  },
  // 组件创建后执行的方法
  created() {
    this.search();
  },
  methods: {
    // 查询学生数据的方法
    search() {
      this.formloading = true;
      // TODO: 实现API调用获取数据
      getSysConfig(this.queryParam).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.formloading = false;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 删除系统参数的方法
    deleteConfig(row) {
      // TODO: 实现删除系统信息的逻辑
      const ids = [row];
      console.log(ids);
      deleteSysConfig(ids).then(res => {
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.search();
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 重置列表的方法
    resetList() {
      this.queryParam = {
        configName: "",
        configTyp: "Y",
        current: 1,
        limit: 13
      };
      this.search();
    }
  }
};
</script>