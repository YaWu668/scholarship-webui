<template>
  <div class="app-container role-per">
    <el-form>
      <el-form-item>
        <span class="title">{{ role }}权限</span>
        <el-button type="primary" @click="submitForm">确认修改</el-button>
        <el-button @click="go(-1)" type="danger">返回</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
    <!-- 权限表格树 -->
    <el-table
      ref="permissionsTable"
      v-loading="Traaloading"
      :data="permissionsTableData"
      :default-expand-all="false"
      @selection-change="handleSelectionChange"
      :tree-props="{ children: 'children' }"
      row-key="menuId"
    >
      <!-- 选中列 -->
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="menuName" label="名称"></el-table-column>
      <el-table-column align="center" prop="menuType" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.menuType === 'M'">目录</el-tag>
          <el-tag v-if="scope.row.menuType === 'C'" type="success">菜单</el-tag>
          <el-tag v-if="scope.row.menuType === 'F'" type="warning">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'">正常</el-tag>
          <el-tag v-if="scope.row.status === '1'" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllmenu, getRoleMenuList, setRoleMenu } from "@/api/role";

export default {
  data() {
    return {
      role: "",
      roleId: "",
      form: {},
      Traaloading: true,
      permissionsTableData: [],
      selectedRows: [] // 选中行数据
    };
  },
  created() {
    this.role = this.$route.query.roleName;
    this.roleId = this.$route.query.id;
    this.getRoleMenu();
  },
  methods: {
    // 获取角色权限树
    getRoleMenu() {
      getAllmenu().then(res => {
        this.permissionsTableData = res.data;
        this.Traaloading = false;

        getRoleMenuList(this.roleId).then(roleRes => {
          // 提取所有 menuId
          const menuIds = roleRes.data.map(item => item.menuId);

          // 等待 DOM 更新后设置选中状态
          this.$nextTick(() => {
            this.setCheckedKeys(menuIds);
          });
        });
      });
    },

    // 核心方法：设置选中状态
    setCheckedKeys(menuIds) {
      const table = this.$refs.permissionsTable;
      if (!table) return;

      // 先清空已有选择
      table.clearSelection();

      // 递归遍历树形数据设置选中
      const traverse = data => {
        data.forEach(row => {
          if (menuIds.includes(row.menuId)) {
            // 找到对应行并设置选中
            table.toggleRowSelection(row, true);
          }
          if (row.children && row.children.length) {
            traverse(row.children);
          }
        });
      };
      traverse(this.permissionsTableData);
    },
    // 存储选中的行数据
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },
    // 提交修改
    submitForm() {
      const menuIds = this.selectedRows.map(item => item.menuId);
      console.log(menuIds);
      setRoleMenu(this.roleId, menuIds).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        }else {
          this.$message.error(res.msg);
        }
      });
    },
    submit() {
      this.submitForm(this.roleId, this.selectedRows);
    },
    go(n) {
      this.$router.go(n);
    }
  },
  computed: {}
};
</script>
<style>
.role-per .title {
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
}
</style>