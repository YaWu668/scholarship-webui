<template>
  <!-- 分页器容器 -->
  <div :class="{'hidden': hidden}" class="pagination-container">
    <!-- Element UI的分页组件 -->
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      v-bind="$attrs"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import { scrollTo } from "@/utils/scroll-to"; // 导入滚动到顶部的工具函数

export default {
  name: "Pagination", // 组件名称
  props: {
    total: {
      // 总数据条数，必需属性
      required: true,
      type: Number
    },
    page: {
      // 当前页码，默认值为1
      type: Number,
      default: 1
    },
    limit: {
      // 每页显示条数，默认值为10
      type: Number,
      default: 10
    },
    pageSizes: {
      // 每页显示条数的可选值数组，默认值为[20, 30, 40, 50]
      type: Array,
      default() {
        return [20, 30, 40, 50];
      }
    },
    layout: {
      // 分页布局，默认值为'total, prev, pager, next, jumper'
      type: String,
      default: "total, prev, pager, next, jumper, sizes" 
    },
    background: {
      // 是否显示背景色，默认值为true
      type: Boolean,
      default: true
    },
    autoScroll: {
      // 是否自动滚动到顶部，默认值为true
      type: Boolean,
      default: true
    },
    hidden: {
      // 是否隐藏分页器，默认值为false
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      // 当前页码的计算属性
      get() {
        return this.page; // 返回父组件传递的page值
      },
      set(val) {
        this.$emit("update:page", val); // 通知父组件更新page值
      }
    },
    pageSize: {
      // 每页显示条数的计算属性
      get() {
        return this.limit; // 返回limit值
      },
      set(val) {
        this.$emit("update:limit", val); // 通知父组件更新limit值
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      // 每页显示条数变化时触发的方法
      this.$emit("pagination", { page: this.currentPage, limit: val }); // 通知父组件分页参数变化
      if (this.autoScroll) {
        scrollTo(0, 800); // 滚动到顶部
      }
    },
    handleCurrentChange(val) {
      // 当前页码变化时触发的方法
      this.$emit("pagination", { page: val }); // 通知父组件当前页码变化
      if (this.autoScroll) {
        scrollTo(0, 800); // 滚动到顶部
      }
    }
  }
};
</script>

<style scoped>
.pagination-container {
  background: #fff; /* 分页器容器背景色为白色 */
}
.pagination-container.hidden {
  /* 当hidden为true时隐藏分页器 */
  display: none;
}
</style>