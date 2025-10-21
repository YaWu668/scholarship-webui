<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="100px" v-loading="formLoading">
      <el-form-item label="学生姓名：" required>
        <el-input v-model="form.nickName"></el-input>
      </el-form-item>
      <el-form-item label="试卷名称：" required>
        <el-select v-model="form.yearTypeId" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
          <el-option v-if="!options.length" disabled value label="请选择" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getExamList, addEligibility } from "@/api/exam";

export default {
  data() {
    return {
      queryform:{
        pageIndex:1,
        pageSize:1000
      },
      form: {
        nickName: "",
        userName:"",
        yearTypeId: "", // 修改这里，使其与 options 的 value 对应
        levelName: ""
      },
      options: [], // 年度类型
      formLoading: false
    };
  },
  created() {
    this.form.nickName = this.$route.query.nickName;
    this.form.userName = this.$route.query.userName;
    this.getyearType();
  },
  methods: {
    getyearType() {
      getExamList(this.queryform).then(res => {
        if (res.code === 200) {
          this.options = [
            { value: null, label: "请选择" }, // 添加默认选项
            ...res.data.list.map(item => ({
              value: item.yearTypeId,
              label: item.yearTypeName.toString() // 确保 label 是字符串类型
            }))
          ];
        }
      });
    },
    submitForm() {
      if (this.form.level === null) {
        this.$message.error("请选择试卷名称");
        return;
      }
      addEligibility(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success("分配成功");
          this.$router.push("/education/EligibilityList/list");
        }else{
          this.$message.error(res.msg);
        }
      });
    },
    resetForm() {
      this.$router.push("/education/EligibilityList/list");
    }
  }
};
</script>