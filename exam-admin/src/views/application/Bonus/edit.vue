<template>
  <div class="app-container-Bonus">
    <el-form :model="form" ref="form" label-width="130px" v-loading="formLoading">
      <el-form-item label="评奖年度名称：" required>
        <el-input v-model="form.annuPrizeName" placeholder="请输入评奖年度名称" />
      </el-form-item>
      <el-form-item v-if="this.typeId == 0" label="学生手册年度：" required>
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
      <el-form-item v-if="this.typeId == 0" label="年级要求：" required>
        <el-select v-model="form.gradeLevelRequired" filterable placeholder="请选择" multiple>
          <el-option
            v-for="item in gradeLeveloptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
          <el-option v-if="!gradeLeveloptions.length" disabled value label="请选择" />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" required>
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="选择开始申请日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" required>
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          placeholder="选择结束申请日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button v-if="this.typeId == 0" type="primary" @click="submitForm">新增</el-button>
        <el-button v-else type="primary" @click="submitForm">修改</el-button>
        <el-button type="danger" @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getExamList } from "@/api/exam";
import { createBonusYear, updateBonusYear } from "@/api/bonus";
import { getCollegeTree } from "@/api/class";

export default {
  data() {
    return {
      typeId: 0,
      form: {
        annuPrizeId: null, //评奖年度id
        annuPrizeName: "", //评奖年度名称
        yearTypeId: "", //学生手册年度
        startTime: "", //开始时间
        endTime: "", //结束时间
        gradeLevelRequired: [] //年级要求（改为数组）
      },
      queryParam: {
        pageIndex: 1,
        pageSize: 1000
      },
      options: [], //存储学生手册年度
      gradeLeveloptions: [], //存储年级要求
      formLoading: false
    };
  },
  created() {
    if (this.$route.query.row) {
      this.typeId = this.$route.query.row.annuPrizeId;
      this.form.annuPrizeId = this.$route.query.row.annuPrizeId;
      this.form.annuPrizeName = this.$route.query.row.annuPrizeName;
      this.form.startTime = new Date(this.$route.query.row.startTime);
      this.form.endTime = new Date(this.$route.query.row.endTime);
    }
    this.getYearType();
    this.getGradeLevelRequired();
  },
  methods: {
    // 获取学生手册年度
    getYearType() {
      getExamList(this.queryParam).then(res => {
        if (res.code === 200) {
          this.options = [
            { value: null, label: "请选择" },
            ...res.data.list.map(item => ({
              value: item.yearTypeId,
              label: item.yearTypeName.toString()
            }))
          ];
        }
      });
    },
    // 获取年级要求
    getGradeLevelRequired() {
      getCollegeTree().then(res => {
        if (res.code === 200) {
          // 提取所有type为Y的label
          const yTypeLabels = this.extractYTypeLabels(res.data);

          // 去重：确保每个label只出现一次
          const uniqueLabels = new Set();
          this.gradeLeveloptions = yTypeLabels.reduce((acc, label) => {
            if (!uniqueLabels.has(label)) {
              uniqueLabels.add(label);
              acc.push({
                value: label, // value绑定label
                label: label // label绑定label
              });
            }
            return acc;
          }, []);
        }
      });
    },
    // 递归提取type为Y的label
    extractYTypeLabels(data) {
      const labels = [];
      for (const item of data) {
        if (item.type === "Y") {
          labels.push(item.label);
        }
        if (item.children && item.children.length > 0) {
          labels.push(...this.extractYTypeLabels(item.children));
        }
      }
      return labels;
    },

    //提交表单
    submitForm() {
      // 表单验证（保持原逻辑不变）
      if (this.typeId == 0) {
        if (!this.form.yearTypeId) {
          this.$message.error("请选择学生手册年度");
          return;
        }
        if (this.form.gradeLevelRequired.length === 0) {
          this.$message.error("请选择年级要求");
          return;
        }
      }

      if (!this.form.annuPrizeName) {
        this.$message.error("请输入评奖年度名称");
        return;
      }
      if (this.form.startTime > this.form.endTime) {
        this.$message.error("开始时间不能大于结束时间");
        return;
      }
      console.log(this.form);
      // 移除转换 gradeLevelRequired 为字符串的代码

      if (this.typeId == 0) {
        createBonusYear(this.form)
          .then(res => {
            if (res.code === 200) {
              this.$message.success("操作成功");
              this.$router.go(-1);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            console.error("请求失败:", err);
            this.$message.error("请求失败，请联系管理员");
          });
      } else {
        this.form.annuPrizeId = this.typeId;
        this.form.startTime = this.formatDate(this.form.startTime);
        this.form.endTime = this.formatDate(this.form.endTime);
        updateBonusYear(this.form)
          .then(res => {
            if (res.code === 200) {
              this.$message.success("操作成功");
              this.$router.go(-1);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            console.error("请求失败:", err);
            this.$message.error("请求失败，请联系管理员");
          });
      }
    },
    // 日期格式化方法
    formatDate(dateString) {
      // 如果日期为空，直接返回空字符串
      if (!dateString) return "";

      // 如果 dateString 是 Date 对象，先转换为 ISO 格式字符串
      if (dateString instanceof Date) {
        dateString = dateString.toISOString();
      }

      // 使用正则表达式提取年、月、日、时、分、秒
      const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
      const match = dateString.match(regex);

      if (match) {
        // 重新组合成目标格式
        return `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}:${match[6]}`;
      }

      // 如果格式不匹配，返回原始值
      return dateString;
    }
  }
};
</script>

<style scoped>
.app-container-Bonus {
  padding: 20px;
  max-width: 50%;
}
</style>