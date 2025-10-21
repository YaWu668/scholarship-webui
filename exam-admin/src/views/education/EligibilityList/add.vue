<template>
  <div class="app-container">
    <div class="add-EligibilityList">
      <el-form :model="form" ref="form" label-width="130px">
        <el-form-item label="学生手册年度：" required>
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
import { getExamList, importEligibility } from "@/api/exam";

export default {
  data() {
    return {
      queryform:{
        pageIndex:1,
        pageSize:1000
      },
      form: {
        yearTypeId: ""
      },
      options: [],
      fileList: []
    };
  },
  created() {
    this.getYearType();
  },
  methods: {
    getYearType() {
      getExamList(this.queryform).then(res => {
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
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1); // 只保留最后一个文件
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传一个文件`);
    },
    submitUpload() {
      if (!this.form.yearTypeId) {
        this.$message.error("请选择试卷名称");
        return;
      }
      if (this.fileList.length === 0) {
        this.$message.error("请先选择文件");
        return;
      }

      const formData = new FormData();
      formData.append("file", this.fileList[0].raw);
      formData.append("yearTypeId", this.form.yearTypeId);

      importEligibility(formData)
        .then(response => {
          if (response.code === 200) {
            this.$message.success("上传成功");
            this.resetForm();
          } else {
            this.$message.error(response.msg);
          }
        })
        .catch(error => {
          this.$message.error("上传失败");
        });
    },
    resetForm() {
      this.$refs.upload.clearFiles();
      this.form.yearTypeId = "";
      this.fileList = [];
      this.$router.push("/education/EligibilityList/list");
    }
  }
};
</script>

<style>
.add-EligibilityList .el-upload-list {
  max-width: 500px;
}
</style>