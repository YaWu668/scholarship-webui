<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="130px" v-loading="formLoading">
      <el-form-item label="考试年度：" required>
        <el-input v-model="form.yearTypeName" />
      </el-form-item>
      <el-form-item label="开始时间" required>
        <el-date-picker
          v-model="form.beginTime"
          type="datetime"
          placeholder="选择开始考试日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" required>
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          placeholder="选择结束考试日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">退出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getExamListByinfo, createPaper, updatePaper } from "@/api/exam";

export default {
  data() {
    return {
      form: {
        yearTypeName: "",
        beginTime: "",
        endTime: ""
      },
      formLoading: false,
      currentTitleItem: null
    };
  },
  created() {
    this.search();
  },
  methods: {
    //提交表单
    submitForm() {
      let id = this.$route.query.id;
      let data = {
        yearTypeId: id,
        yearTypeName: this.form.yearTypeName,
        beginTime: this.form.beginTime,
        endTime: this.form.endTime
      };
      if (id && parseInt(id) !== 0) {
        //编辑年度信息
        updatePaper(data).then(res => {
          if (res.code === 200) {
            this.$message.success("编辑成功");
            this.$router.push({ path: "/education/paper/list" });
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else if (parseInt(id) === 0) {
        //新增年度信息
        createPaper(data).then(res => {
          if (res.code === 200) {
            this.$message.success("添加成功");
            this.$router.push({ path: "/education/paper/list" });
          } else if (res.code === 400) {
            this.$message.error(res.msg);
            this.form = {
              id: null,
              yearTypeName: "",
              beginTime: "",
              endTime: ""
            };
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
            this.form = {
              id: null,
              yearTypeName: "",
              beginTime: "",
              endTime: ""
            };
          }
        });
      }
    },
    //根据年度名称查询信息
    search() {
      let id = this.$route.query.id;
      if (id && parseInt(id) !== 0) {
        this.form.yearTypeName = this.$route.query.yearTypeName;
        getExamListByinfo(this.form).then(res => {
          if (res.code === 200) {
            this.form.beginTime = res.data.list[0].beginTime;
            this.form.endTime = res.data.list[0].endTime;
          }
        });
      }
    },
    resetForm() {
      this.$router.push({ path: "/education/paper/list" });
    }
  }
};
</script>
