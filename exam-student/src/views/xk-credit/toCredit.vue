<template>
  <div class="toBonus">
    <div class="Applyinfo">
      <div class="userinfo">
        <div class="toBonus_title">
          <h2>{{ title }}</h2>
        </div>
        <el-form :model="form" label-width="80px">
          <div class="form-item">
            <el-form-item label="学院">
              <el-input v-model="form.academy"></el-input>
            </el-form-item>
            <el-form-item label="专业">
              <el-input v-model="form.userprofess"></el-input>
            </el-form-item>
            <el-form-item label="班级">
              <el-input v-model="form.userclass"></el-input>
            </el-form-item>
          </div>
          <div class="form-item">
            <el-form-item label="学号">
              <el-input v-model="form.usersno"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="line"></div>
      <div class="material">
        <div class="toBonus_title">
          <h2>认定内容：</h2>
        </div>
        <div class="credit">
          <el-form :model="form" label-width="80px">
            <div class="form-item">
              <el-form-item label="认定类型" label-width="90px">
                <el-input v-model="form.username" width="230px"></el-input>
              </el-form-item>

              <el-form-item label="学分认定成果名称" label-width="145px">
                <el-input v-model="form.usersno" style="width: 445px;"></el-input>
              </el-form-item>
              <span>例：2024年全国大学生数学建模竞赛广西赛区三等奖</span>
              <el-form-item label="获奖等级" label-width="90px">
                <el-input v-model="form.userclass"></el-input>
              </el-form-item>
              <span style="margin-left: 100px;">例：一等奖</span>
              <el-form-item label="认定学分" label-width="90px">
                <el-input v-model="form.s"></el-input>
              </el-form-item>
              <el-form-item label="获奖时间" label-width="90px">
                <el-input v-model="form.s"></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="line"></div>
      <div class="material">
        <div class="toBonus_title">
          <h2>佐证材料：</h2>
        </div>
        <el-form :model="form" label-width="80px">
          <!-- 动态添加的奖项项 -->
          <div class="cl-form-item" v-for="(material, index) in form.materials" :key="index">
            <!-- 佐证材料 -->
            <div>
              <el-form-item label="佐证材料">
                <div class="upload">
                  <el-upload
                    class="upload-demo"
                    :on-change="(file, fileList) => handleChange(index, file, fileList)"
                    :file-list="material.uploadedFileNames"
                    :before-upload="beforeUpload"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                  <div class="file-names">
                    <p
                      v-for="(file, fileIndex) in material.uploadedFileNames"
                      :key="fileIndex"
                    >{{ file.name }}</p>
                  </div>
                </div>
                <!-- 删除按钮 -->
                <el-button type="danger" @click="deleteMaterialItem(index)">删除</el-button>
              </el-form-item>
            </div>
          </div>

          <!-- 添加新的奖项项按钮 -->
          <el-button type="primary" @click="addMaterialItem">+</el-button>
        </el-form>
      </div>
      <div class="submit">
        <el-button @click="submitApplication()" type="primary">提交申请</el-button>
        <el-button @click="layout()">取消申请</el-button>
      </div>
    </div>
  </div>
</template>
    
<script>
export default {
  data() {
    return {
      title: "学分认定",
      form: {
        usersno: "",
        username: "",
        userclass: "",
        academy: "",
        userprofess: "",
        materials: [] // 修改为数组
      },
      fileList: [],
      uploadedFileNames: [] // 新增数据属性来存储文件名
    };
  },
  mounted() {},
  methods: {
    layout() {
      this.$router.push({ path: "/Credit/CreditApply" });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    // 动态添加奖项项
    addMaterialItem() {
      this.form.materials.push({
        year: "",
        awardname: "",
        level: "",
        grade: "",
        uploadedFileNames: []
      });
    },
    // 删除奖项项
    deleteMaterialItem(index) {
      this.form.materials.splice(index, 1);
    },
    beforeUpload(file) {
      // 检查文件格式
      const fileType = file.name
        .split(".")
        .pop()
        .toLowerCase();
      if (fileType !== "jpg" && fileType !== "png") {
        this.$message.error("只能上传jpg/png文件格式！");
        return false; // 阻止文件上传
      }
      // 可以添加更多的检查，例如文件大小
      const isLt500Kb = file.size / 1024 < 500;
      if (!isLt500Kb) {
        this.$message.error("文件大小不能超过500kb！");
        return false; // 阻止文件上传
      }
      return true; // 允许文件上传
    },
    handleChange(file, fileList) {
      // 更新文件名列表
      this.uploadedFileNames = fileList.map(f => ({ ...f, uid: f.uid }));
    },
    // 验证表单是否填写完整
    validateForm() {
      for (let key in this.form) {
        if (this.form[key] === "") {
          this.$message.warning("请填写完整表单后再提交");
          return false; // 如果有未填写的字段，返回false
        }
      }
      return true; // 所有字段都已填写，返回true
    },
    // 提交申请
    submitApplication() {
      if (!this.validateForm()) {
        return; // 如果表单验证失败，不执行后续操作
      }

      this.$confirm("此操作将提交申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "提交成功!"
          });
          this.$router.push({ path: "/Credit/CreditApply" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>
    
    <style>
.toBonus {
  width: 1400px;
  min-height: 80%;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 25px;
  margin: 60px auto;
}
.toBonus h2 {
  margin: 0;
}
.toBonus .userinfo,
.toBonus .material,
.toBonus .submit {
  width: 90%;
  margin: 20px auto;
}
.toBonus .submit {
  margin-top: 40px;
}
.toBonus .userinfo .el-input {
  width: 280px;
}
.toBonus .userinfo span {
  line-height: 36px;
}
.toBonus .el-form {
  margin-top: 20px;
}
.form-item {
  display: flex;
}
.form-item .el-input {
  width: 300px;
}
.form-item .el-radio {
  margin-left: 20px;
}

.toBonus .line {
  width: 90%;
  margin: 20px auto;
  height: 2px;
  background-color: #ccc;
}
.toBonus .credit .form-item {
  display: block;
}
.toBonus .credit .form-item .el-form-item {
  margin-top: 22px;
  margin-bottom: 0;
}
.toBonus .credit .form-item .el-form-item .el-input {
  width: 500px;
}
.toBonus .credit .form-item span {
  color: #666;
  font-size: 14px;
  margin-left: 145px;
}
.toBonus .material .upload-demo {
  width: 500px;
}
.toBonus .upload .file-names {
  margin-top: 10px;
}
.toBonus .upload .file-names p {
  margin: 0;
}
</style>