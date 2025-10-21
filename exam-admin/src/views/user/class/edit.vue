<template>
  <div class="app-container-classEdit">
    <el-form :model="form" ref="form" label-width="100px" v-loading="formLoading">
      <el-form-item label="父级节点：" required>
        <!-- 父级节点下拉框 -->
        <el-select v-model="form.parentId" :disabled="typeID != 0" filterable placeholder="请选择">
          <!-- 遍历处理后的数据，渲染下拉选项 -->
          <el-option
            v-for="item in filteredCollegeData"
            :key="item.id"
            :value="item.id"
            :label="item.label"
          />
          <!-- 如果没有数据，显示请选择 -->
          <el-option v-if="!filteredCollegeData.length" disabled value label="请选择" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="typeID == 0" label="节点类型：" required>
        <!-- 节点类型下拉框 -->
        <el-select v-model="form.type" filterable placeholder="请选择">
          <el-option
            v-for="item in Options"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
          <el-option v-if="!Options.length" disabled value label="请选择" />
        </el-select>
      </el-form-item>
      <el-form-item label="结点名称：" required>
        <el-input v-model="form.collegeName"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- 提交和退出按钮 -->
        <el-button v-if="this.typeID == 0" type="primary" @click="submitForm">新增</el-button>
        <el-button v-else type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">退出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入相关API
import {
  seachClassDetail,
  getCollegeTree,
  createTreeNode,
  updateTreeNode
} from "@/api/class";

export default {
  data() {
    return {
      typeID: 0, // 用于判断是新增还是编辑
      form: {
        collegeName: "", // 结点名称
        nodeId: null, // 节点ID
        parentId: null, // 父级节点ID
        type: "" // 节点类型
      },
      // 原始学院信息数据
      CollegetableData: [],
      // 节点类型选项
      Options: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "C",
          label: "学院"
        },
        {
          value: "Y",
          label: "年级"
        },
        {
          value: "M",
          label: "专业"
        },
        {
          value: "G",
          label: "班级"
        }
      ],
      formLoading: false, // 表单加载状态
      // 用于存储筛选后的学院数据（type为C、Y、M）
      filteredCollegeData: []
    };
  },
  created() {
    // 获取路由参数中的id
    this.typeID = this.$route.query.id;
    // 如果是编辑状态，初始化表单数据
    if (this.typeID != 0) {
      // 确保 this.$route.query.row 是一个对象
      const row = this.$route.query.row || {};
      this.form = {
        ...this.form,
        ...row
      };
      // 如果 row 中有 label 属性，赋值给 collegeName
      if (row.label) {
        this.form.collegeName = row.label;
      }
    }
    // 页面创建时调用方法获取学院数据
    this.getCollege();
  },
  methods: {
    // 提交表单
    submitForm() {
      // 添加班级信息
      if (this.typeID == 0) {
        createTreeNode(this.form).then(res => {
          if (res.code === 200) {
            this.$message.success("添加成功");
            // 跳转到列表页
            this.$router.push({ path: "/college/class/list" });
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        // 修改班级信息
        updateTreeNode(this.form).then(res => {
          if (res.code === 200) {
            this.$message.success("修改成功");
            // 跳转到列表页
            this.$router.push({ path: "/college/class/list" });
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    // 根据班级名称查询信息
    search() {
      let id = this.$route.query.id;
      if (id !== 0) {
        this.form.collegeName = this.$route.query.collegeName;
        seachClassDetail(this.form).then(res => {
          if (res.code === 200) {
            this.form = res.data.list[0];
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        return;
      }
    },
    // 获取学院信息并筛选
    getCollege() {
      getCollegeTree().then(res => {
        if (res.code == 200) {
          // 获取原始数据
          this.CollegetableData = res.data;
          // 筛选type为C、Y、M的数据
          this.filterCollegeData(this.CollegetableData);
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 筛选学院数据（递归处理嵌套数据）
    filterCollegeData(data) {
      data.forEach(item => {
        // 如果当前节点的type是C、Y、M，则添加到筛选后的数据中
        if (["C", "Y", "M"].includes(item.type)) {
          this.filteredCollegeData.push({
            id: item.id,
            label: item.label
          });
        }
        // 如果有子节点，递归处理子节点
        if (item.children && item.children.length > 0) {
          this.filterCollegeData(item.children);
        }
      });
    },
    // 退出
    resetForm() {
      // 跳转到列表页
      this.$router.push({ path: "/college/class/list" });
    }
  }
};
</script>

<style scoped>
/* 添加样式（如有需要） */
.app-container-classEdit {
  padding: 20px;
  max-width: 50%;
}
</style>