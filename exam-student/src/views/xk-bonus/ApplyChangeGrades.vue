<template>
  <div class="bonus-detailed">
    <div class="toBonus_title">
      <h2>申请修改成绩</h2>
    </div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="申请说明">
        <el-input v-model="form.explanation" type="textarea" :rows="5" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-demo"
          ref="upload"
          :on-remove="handleRemove"
          :file-list="form.imgUrls"
          :auto-upload="false"
          :http-request="customUpload"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :limit="1"
          :on-exceed="handleExceed"
          action
        >
          <el-button slot="trigger" type="primary">选取证明材料</el-button>
          <el-button style="margin-left: 10px;" type="success" @click="submitUpload">提交申请</el-button>
          <el-button style="margin-left: 10px;" type="danger" @click="refresh">取消申请</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { submitScoreChangeApply, uploadScoreChangeFile } from "@/api/exam";

export default {
  data() {
    return {
      form: {
        applyId: null,
        explanation: "",
        imgUrls: []
      }
    };
  },
  created() {
    this.form.applyId = this.$route.query.applyId;
  },
  methods: {
    // 自定义文件上传方法
    customUpload(options) {
      const { file, onSuccess, onError } = options;
      const formData = new FormData();
      formData.append("file", file); // 根据后端接口调整参数名
      console.log(formData.files);
      uploadScoreChangeFile(formData)
        .then(response => {
          if (response.code === 200) {
            // 触发上传成功回调，传递响应数据和文件对象
            onSuccess(response, file);
          } else {
            onError(new Error(response.msg || "文件上传失败"));
          }
        })
        .catch(error => {
          onError(error);
        });
    },

    // 提交上传
    submitUpload() {
      // 表单验证
      if (!this.form.explanation.trim()) {
        this.$message.error("请填写申请说明");
        return;
      }
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.error("请选择证明材料");
        return;
      }
      // 触发文件上传
      this.$refs.upload.submit();
    },

    // 文件上传成功处理
    handleUploadSuccess(response, file) {
      if (response.code === 200) {
        // 添加文件URL到数组
        this.form.imgUrls.push(response.data);
        // 提交申请
        this.submitScoreChangeApply();
      } else {
        this.$message.error(response.msg);
      }
    },

    // 提交申请接口
    submitScoreChangeApply() {
      const data = {
        applyId: this.form.applyId,
        explanation: this.form.explanation,
        imgUrls: [this.form.imgUrls[0].url]
      };
      submitScoreChangeApply(data)
        .then(response => {
          if (response.code === 200) {
            this.$message.success("申请提交成功");
            this.refresh();
          } else {
            this.$message.error(response.msg || "提交失败");
          }
        })
        .catch(error => {
          this.$message.error(error.message || "请求失败");
        });
    },
    // 超出文件数量限制时的回调
    handleExceed(files, fileList) {
      this.$message.warning("只能上传一个文件");
    },
    // 移除文件
    handleRemove(file, fileList) {
      // 从form.imgUrls中移除对应的文件
      this.form.imgUrls = this.form.imgUrls.filter(url => url !== file.url);
    },
    // 限制文件大小不超过500kb
    beforeUpload(file) {
      const isLt500KB = file.size / 1024 < 500; // 将文件大小转换为KB
      if (!isLt500KB) {
        this.$message.error("上传文件大小不能超过500KB");
      }
      return isLt500KB; // 返回false时会终止上传
    },
    // 取消申请
    refresh() {
      // 重置表单
      this.form.applyId = null;
      this.form.explanation = "";
      this.form.imgUrls = [];
      this.$refs.upload.clearFiles();
      this.$router.go(-1);
    }
  },
  components: {}
};
</script>

<style>
.bonus-detailed {
  width: 1400px;
  min-height: 80%;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 25px;
  margin: 60px auto;
}
.bonus-detailed h1 {
  margin: 0;
}
.bonus-detailed .el-form {
  width: 100%;
}
.bonus-detailed .el-form-item {
  width: 100%;
}
.bonus-detailed .el-form .el-form-item__content {
  width: 90%;
}
</style>