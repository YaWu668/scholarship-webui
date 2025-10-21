<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="100px">
      <el-form-item label="角色名称：" required>
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item label="权限字符：" required>
        <el-input v-model="form.roleKey"></el-input>
      </el-form-item>
      <el-form-item v-if="this.typeId == 1" label="显示顺序">
        <el-input-number v-model="form.roleSort" controls-position="right" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="角色状态：">
        <el-radio-group v-model="form.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getRoleDetail,addRole, updataRole } from "@/api/role";
export default {
  data() {
    return {
      typeId: 0, //1添加 2编辑
      form: {
        id: null,
        roleName: "",
        roleKey: "",
        roleSort: 1,
        status: "0"
      }
    };
  },
  created() {
    if (this.$route.query.typeId == 1) {
      this.typeId = this.$route.query.typeId;
    } else {
      this.typeId = this.$route.query.typeId;
      this.form = this.$route.query.row;
      this.getRoleDetail();
    }
  },
  methods: {
    //提交表单
    submitForm() {
      if (this.typeId === 1) {
        addRole(this.form).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.$router.go(-1);
          } else if (res.code == 500) {
            this.$message({
              message: res.msg,
              type: "error"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        });
      } else if(this.typeId === 2){
        updataRole(this.form).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.$router.go(-1);
          } else if (res.code == 500) {
            this.$message({
              message: res.msg,
              type: "error"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        });
      }
    },

    //获取当前角色详细信息
    getRoleDetail() {
      getRoleDetail(this.$route.query.row.roleId).then(res => {
        this.form = res.data;
      });
    },

    resetForm() {
      this.$refs["form"].resetFields();
      this.$router.go(-1);
    }
  }
};
</script>
