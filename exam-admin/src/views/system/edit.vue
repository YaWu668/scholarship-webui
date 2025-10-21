<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="100px">
      <el-form-item label="参数名称：" required>
        <el-input v-model="form.configName"></el-input>
      </el-form-item>
      <el-form-item label="参数值：" required>
        <el-input v-model="form.configValue"></el-input>
      </el-form-item>
      <el-form-item label="参数键名：" required>
        <el-input v-model="form.configKey"></el-input>
      </el-form-item>
      <el-form-item label="备注：" required>
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button type="danger" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSysConfigById, updateSysConfig, addSysConfig } from "@/api/config";
export default {
  data() {
    return {
      form: {
        configId: "", //唯一id
        configName: "", //参数名称
        configKey: "", //参数键
        configValue: "", //参数值
        remark: "", //备注
        configTyp: "Y" //参数类型（Y：系统内置参数，N：系统外置参数）
      }
    };
  },
  created() {
    this.form.configId = this.$route.query.id;
    if (this.form.configId && this.form.configId != "") {
      this.getSysConfigById(this.form.configId);
    }
    console.log(this.form.configId);
  },
  methods: {
    getSysConfigById(id) {
      getSysConfigById(id).then(res => {
        if (res.code == 200) {
          this.form = res.data;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //提交
    submitForm() {
      if (this.form.configId != undefined) {
        //修改
        updateSysConfig(this.form).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.$router.push("/config/list");
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        // 新增
        addSysConfig(this.form).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.$router.push("/config/list");
          } else if (res.code === 500) {
            this.$message.error(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    //取消
    cancel() {
      this.form.configId = "";
      this.$router.push("/config/list");
    }
  }
};
</script>
