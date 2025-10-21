<template>
  <div class="app-container">
    <div class="add-class">
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="奖项年度：" required>
          <el-select v-model="form.annuPrizeId" filterable placeholder="请选择">
            <el-option
              v-for="item in yearoptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
            <el-option v-if="!yearoptions.length" disabled value label="请选择" />
          </el-select>
          <el-button style="margin-left: 10px;" type="primary" @click="getimportTemplate">获取导入模板</el-button>
        </el-form-item>
        <el-form-item v-if="id == 1" label="成绩类型：" required>
          <el-select v-model="form.type" filterable placeholder="请选择">
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
          <el-upload
            ref="upload"
            :auto-upload="false"
            :on-change="handleChange"
            :file-list="fileList"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >批量导入</el-button>
            <el-button size="small" type="danger" @click="resetForm">退出</el-button>
            <div slot="tip" class="el-upload__tip">只能上传一个Excel文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getGradesTemplate,
  getBatchGradesTemplate,
  importStudentGrades,
  importBatchStudentGrades,
  getBonusYear
} from "@/api/bonus";

export default {
  data() {
    return {
      id: 0, //判断导入学生成绩类型（1：基础成绩:2：课程成绩）
      form: {
        annuPrizeId: null,
        type: null
      },
      yearoptions: [], //年份数据
      options: [
        {
          value: null,
          label: "请选择"
        },
        {
          value: 1,
          label: "英语四级"
        },
        {
          value: 2,
          label: "英语平均分"
        },
        {
          value: 3,
          label: "体测成绩"
        },
        {
          value: 4,
          label: "德育分"
        }
      ],

      fileList: []
    };
  },
  created() {
    this.id = this.$route.query.type;
    this.getBonusYear();
  },
  methods: {
    // 获取评奖年度数据，用于填充奖项下拉选择框
    getBonusYear() {
      const data = {
        pageIndex: 1,
        pageSize: 1000
      };
      getBonusYear(data).then(res => {
        if (res.code === 200) {
          // 将后端返回的数据中的annuPrizeName绑定到options的label，annuPrizeId绑定到value
          this.yearoptions = [
            { value: null, label: "请选择" }, // 添加默认选项
            ...res.data.list.map(item => ({
              value: item.annuPrizeId,
              label: item.annuPrizeName.toString() // 确保 label 是字符串类型
            }))
          ];
          // 默认选中第一项
          if (this.yearoptions.length > 0) {
            this.value = this.yearoptions[0].value;
          }
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 处理文件选择变化
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1); // 只保留最后一个文件
    },
    // 处理文件超出限制
    handleExceed() {
      this.$message.warning("只能上传一个文件");
    },
    // 提交上传
    submitUpload() {
      // 表单验证
      if (this.id == 1 && !this.form.type) {
        this.$message.error("请选择导入成绩的类型");
        return;
      }
      if (!this.form.annuPrizeId) {
        this.$message.error("请选择年份");
        return;
      }
      if (this.fileList.length === 0) {
        this.$message.error("请先选择文件");
        return;
      }
      // 创建 formData
      const formData = new FormData();
      formData.append("file", this.fileList[0].raw);
      console.log([...formData.entries()]); // 检查 formData 是否正确
      // 调用API上传
      if (this.id == 1) {
        importStudentGrades({
          annuPrizeId: this.form.annuPrizeId,
          type: this.form.type,
          file: formData.get("file")
        })
          .then(res => {
            if (res.code === 200) {
              this.$message.success("上传成功");
              this.resetForm();
            } else {
              this.$message.error(res.msg || "上传失败");
            }
          })
          .catch(error => {
            console.error("上传失败:", error);
            this.$message.error(res.msg);
          });
      } else {
        importBatchStudentGrades({
          annuPrizeId: this.form.annuPrizeId,
          file: formData.get("file")
        })
          .then(res => {
            if (res.code === 200) {
              this.$message.success("上传成功");
              this.resetForm();
            } else {
              this.$message.error(res.msg || "上传失败");
            }
          })
          .catch(error => {
            console.error("上传失败:", error);
            this.$message.error(res.msg);
          });
      }
    },

    // 下载模板
    async getimportTemplate() {
      try {
        let res;
        if (this.id == 1) {
          res = await getGradesTemplate();
        } else {
          res = await getBatchGradesTemplate();
        }

        const blob = new Blob([res], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        if (this.id == 1) {
          link.download = `基础成绩导入模板.xlsx`;
        } else {
          link.download = `课程成绩导入模板.xlsx`;
        }
        link.click();
      } catch (error) {
        this.$message.error(res.msg);
      }
    },

    // 重置表单
    resetForm() {
      this.$refs.upload.clearFiles();
      this.form.annuPrizeId = null;
      this.form.type = null;
      this.fileList = [];
      this.$router.push("/bonus/BonusList");
    }
  }
};
</script>

<style>
.add-class .el-upload-list {
  max-width: 500px;
}
</style>