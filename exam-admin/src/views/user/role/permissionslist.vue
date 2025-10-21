<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="openDialog(1,{})">添加权限</el-button>
      </el-form-item>
    </el-form>
    <!-- 权限表格树 -->
    <el-table
      v-loading="Traaloading"
      :data="permissionsTableData"
      :default-expand-all="false"
      :tree-props="{ children: 'children' }"
      row-key="menuId"
    >
      <!-- 选中列 -->
      <el-table-column prop="menuName" label="名称"></el-table-column>

      <el-table-column align="center" prop="menuType" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.menuType === 'M'">目录</el-tag>
          <el-tag v-if="scope.row.menuType === 'C'" type="success">菜单</el-tag>
          <el-tag v-if="scope.row.menuType === 'F'" type="warning">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="组件路径"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'">正常</el-tag>
          <el-tag v-if="scope.row.status === '1'" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="perms" label="权限标识"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <el-button @click="openDialog(2,row)" size="mini">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteItem(row.menuId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑权限弹窗 S-->
    <el-dialog :title="DialogTitle" :visible.sync="Adddialog">
      <el-form :model="editform" :rules="rules" label-width="80px">
        <el-form-item label="权限名称">
          <el-input v-model="editform.menuName"></el-input>
        </el-form-item>
        <el-form-item label="组件路径">
          <el-input v-model="editform.component"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <treeselect
            v-model="editform.parentId"
            :options="menuOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="权限类型">
          <el-select v-model="editform.menuType" placeholder="请选择权限类型">
            <el-option label="目录" value="M"></el-option>
            <el-option label="菜单" value="C"></el-option>
            <el-option label="按钮" value="F"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number v-model="editform.orderNum" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="权限状态">
          <el-radio-group v-model="editform.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑权限弹窗 E-->
  </div>
</template>

<script>
import { getAllmenu, addPermission, updataPermission } from "@/api/role";

export default {
  data() {
    return {
      typeId: null, //1添加 2编辑
      role: "",
      roleId: "",
      editform: {
        menuName: "",
        parentId: "0",
        menuType: "",
        status: "0",
        orderNum: 1,
        component: "",
        path: ""
      },
      Traaloading: true,
      permissionsTableData: [],
      Adddialog: false,
      DialogTitle: "添加权限",
      menuOptions: [], //菜单列表
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getRoleMenu();
  },
  methods: {
    //获取角色权限树
    getRoleMenu() {
      getAllmenu().then(res => {
        this.permissionsTableData = res.data;
        this.Traaloading = false;
        const menu = { menuId: 0, menuName: "主类目", children: res.data };
        this.menuOptions.push(menu);
        console.log(res);
      });
    },
    openDialog(type, row) {
      this.typeId = type;
      // 1添加 2编辑
      if (type === 1) {
        this.DialogTitle = "添加权限";
      } else {
        this.DialogTitle = "编辑权限";
        this.editform = row;
      }
      this.Adddialog = true;
    },
    submitForm() {
      if (this.typeId === 1) {
        addPermission(this.editform).then(res => {
          if (res.code === 200) {
            this.$message.success("添加成功");
            this.Adddialog = false;
            this.getRoleMenu();
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        updataPermission(this.editform).then(res => {
          if (res.code === 200) {
            this.$message.success("修改成功");
            this.Adddialog = false;
            this.getRoleMenu();
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },

    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    //关闭弹窗
    closeDialog() {
      (this.editform = {
        menuName: "",
        parentId: "0",
        menuType: "",
        status: "0",
        orderNum: 1
      }),
        (this.Adddialog = false);
    }
  },
  computed: {}
};
</script>
