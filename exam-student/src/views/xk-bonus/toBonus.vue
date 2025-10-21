<template>
  <div class="toBonus test">
    <!-- 用户信息表单 -->
    <div class="Applyinfo">
      <div class="userinfo">
        <div class="toBonus_title">
          <h2>{{ title }}</h2>
        </div>
        <el-form :model="form" label-width="80px">
          <!-- 学号、姓名、班级 -->
          <div class="form-item">
            <el-form-item label="学号">
              <el-input v-model="form.usersno"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="班级">
              <el-input v-model="form.userclass"></el-input>
            </el-form-item>
          </div>
          <!-- 学院、专业、手机号 -->
          <div class="form-item">
            <el-form-item label="学院">
              <el-input v-model="form.academy"></el-input>
            </el-form-item>
            <el-form-item label="专业">
              <el-input v-model="form.userprofess"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="form.userphone"></el-input>
            </el-form-item>
          </div>
          <!-- 四级成绩、德育分 -->
          <div class="form-item">
            <el-form-item label="四级最高成绩/英语平均分:" label-width="210px">
              <el-input v-model="form.englist"></el-input>
            </el-form-item>
            <el-form-item label="德育分:">
              <el-input v-model="form.education"></el-input>
            </el-form-item>
          </div>
          <!-- 违纪情况 -->
          <div class="form-item">
            <el-form-item label="学年内有无违纪情况:" label-width="180px">
              <el-radio-group v-model="form.disciplinary">
                <el-radio label="有"></el-radio>
                <el-radio label="无"></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="line"></div>

      <!-- 获得奖项表单 -->
      <div class="cl toBonus_title">
        <h2>获得奖项</h2>

        <el-form :model="form" label-width="80px">
          <!-- 动态添加的奖项项 -->
          <div class="cl-form-item" v-for="(material, index) in form.materials" :key="index">
            <!-- 年度、奖项名称 -->
            <div class="cl-item">
              <el-form-item label="年度">
                <el-input v-model="material.year"></el-input>
              </el-form-item>
              <el-form-item label="奖项名称">
                <el-input v-model="material.awardname"></el-input>
              </el-form-item>
            </div>
            <!-- 级别、等级 -->
            <div class="cl-item">
              <el-form-item label="级别">
                <el-input v-model="material.level"></el-input>
              </el-form-item>
              <el-form-item label="等级">
                <el-input v-model="material.grade"></el-input>
              </el-form-item>
            </div>
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
                    >{{ file }}</p>
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
    </div>
    <div class="line"></div>

    <!-- 提交和取消按钮 -->
    <div class="submit">
      <el-button @click="submitApplication()" type="primary">提交申请</el-button>
      <el-button @click="layout()">取消申请</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "奖学金申请",
      form: {
        usersno: "",
        username: "",
        userclass: "",
        academy: "",
        userprofess: "",
        userphone: "",
        englist: "",
        education: "",
        disciplinary: "",
        materials: [], // 修改为数组
        uploadedFileNames:[] // 上传文件名列表
      }
    };
  },
  methods: {
    layout() {
      this.$router.push({ path: "/Bonus/BonusApply" });
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
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeUpload(file) {
      const fileType = file.name
        .split(".")
        .pop()
        .toLowerCase();
      if (fileType !== "jpg" && fileType !== "png" && fileType !== "jpeg") {
        this.$message.error("只能上传jpg/png/jpeg文件格式！");
        return false;
      }
      const isLt500Kb = file.size / 1024 < 500;
      if (!isLt500Kb) {
        this.$message.error("文件大小不能超过500kb！");
        return false;
      }
      return true;
    },
    handleChange(file, fileList) {
      // 更新文件名列表
      this.uploadedFileNames = fileList.map(f => ({ ...f, uid: f.uid }));
    },
    validateForm() {
      for (let key in this.form) {
        if (this.form[key] === "") {
          this.$message.warning("请填写完整表单后再提交");
          return false;
        }
      }
      return true;
    },
    submitApplication() {
      if (!this.validateForm()) {
        return;
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
          this.$router.push({ path: "/Bonus/BonusApply" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    addMaterialItem() {
      this.form.materials.push({
        year: "",
        awardname: "",
        level: "",
        grade: "",
        uploadedFileNames: [] // 确保初始化为空数组
      });
    },
    deleteMaterialItem(index) {
      this.form.materials.splice(index, 1);
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
.toBonus .cl,
.toBonus .submit {
  width: 90%;
  margin: 20px auto;
}
.toBonus .submit {
  margin-top: 40px;
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
.test .form-item .el-input,
.test .cl-form-item .el-input {
  width: 300px;
}
.form-item .el-radio {
  margin-left: 20px;
}

.toBonus .cl-form-item .cl-item {
  display: flex;
}

.toBonus .line {
  width: 90%;
  margin: 20px auto;
  height: 2px;
  background-color: #ccc;
}
.toBonus .upload .upload-demo {
  width: 500px;
}

.toBonus .upload .file-names {
  margin-top: 10px;
}
.toBonus .upload .file-names p {
  margin: 0;
}
</style>