<template>
  <div class="app-container">
    <div class="add-class">
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="用户角色：" required>
          <el-select v-model="form.UserRole" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
            <el-option v-if="!options.length" disabled value label="请选择" />
          </el-select>
          <el-button style="margin-left: 10px;" type="primary" @click="getimportTemplate">获取导入模板</el-button>
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
import {   getTemplate,importStudentAndTeacher } from "@/api/class";

export default {
  data() {
    return {
      form: {
        UserRole: ""
      },
      options: [
        {
          value: null,
          label: "请选择"
        },
        {
          value: "student",
          label: "学生"
        },
        {
          value: "teacher",
          label: "教师"
        },
        {
          value: "college",
          label: "学院"
        }
      ],
      fileList: []
    };
  },
  methods: {
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
      if (!this.form.UserRole) {
        this.$message.error("请选择用户角色");
        return;
      }
      if (this.fileList.length === 0) {
        this.$message.error("请先选择文件");
        return;
      }

      // 创建FormData对象并添加文件
      const formData = new FormData();
      formData.append("file", this.fileList[0].raw); // Element上传组件的文件对象在raw字段

      // 调用API上传
      importStudentAndTeacher(formData, this.form.UserRole)
        .then(response => {
          if (response.code === 200) {
            this.$message.success("上传成功");
            this.resetForm();
          } else {
            this.$message.error(response.msg || "上传失败");
          }
        })
        .catch(error => {
          console.error("上传失败:", error);
          this.$message.error("上传失败，请检查文件格式或联系管理员");
        });
    },

    // 下载模板
    async getimportTemplate() {
      try {
        const res = await getTemplate();
        const blob = new Blob([res], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `组织绑定模板(一个班级只能有一个老师).xlsx`;
        link.click();
      } catch (error) {
        this.$message.error("模板下载失败");
      }
    },

    // 重置表单
    resetForm() {
      this.$refs.upload.clearFiles();
      this.form.UserRole = "";
      this.fileList = [];
      this.$router.push("/college/class/list");
    }
  }
};
</script>

<style>
.add-class .el-upload-list {
  max-width: 500px;
}
</style>