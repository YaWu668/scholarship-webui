<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="100px" v-loading="formLoading">
      <el-form-item label="学号/工号：" required>
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名：" required>
        <el-input v-model="form.nickName"></el-input>
      </el-form-item>
      <el-form-item label="性别：">
        <el-select v-model="form.sex" placeholder="性别">
          <el-option v-for="item in sexEnum" :key="item.key" :value="item.key" :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" required>
        <el-select v-model="form.status" placeholder="状态">
          <el-option
            v-for="item in statusEnum"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button type="danger" @click="back">退出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { getUserInfoById, updateUser } from "@/api/userinfo";

export default {
  data() {
    return {
      form: {
        id: null,
        userName: "",
        nickName: "",
        status: "0",
        sex: "0"
      },
      formLoading: false
    };
  },
  mounted() {
    this.form.id = this.$route.query.id;
    console.log(this.form.id);
    this.getInfo();
  },
  methods: {
    getInfo() {
      if (!this.form.id) {
        return;
      }
      getUserInfoById(this.form.id).then(res => {
        if (res.code == 200) {
          this.form = res.data.user;
          console.log(this.form);
        }
      });
    },
    submitForm() {
      updateUser(this.form).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.$router.push({ path: "/user/student/list" });
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    back() {
      this.form.id = null;
      this.$router.push({ path: "/user/student/list" });
    }
  },
  computed: {
    ...mapGetters("enumItem", ["enumFormat"]),
    ...mapState("enumItem", {
      sexEnum: state => state.user.sexEnum,
      roleEnum: state => state.user.roleEnum,
      statusEnum: state => state.user.statusEnum,
      levelEnum: state => state.user.levelEnum
    })
  }
};
</script>
