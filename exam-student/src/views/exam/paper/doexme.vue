<template>
  <div class="exam" @scroll="handleScroll">
    <el-container>
      <!-- 题号显示盒子 -->
      <el-aside class="question-number-box">
        <div class="question-number-container">
          <!-- 单选题题号 -->
          <div class="question-type-title">单选题</div>
          <div class="question-numbers">
            <div
              v-for="(item, index) in form.singleChoice"
              :key="index"
              :class="['question-number', { active: dananswer[index] && dananswer[index].studentAnswer  != null }]"
              @click="scrollToQuestion('singleChoice', index)"
            >{{ index + 1 }}</div>
          </div>

          <!-- 多选题题号 -->
          <div class="question-type-title">多选题</div>
          <div class="question-numbers">
            <div
              v-for="(item, index) in form.multipleChoice"
              :key="index"
              :class="['question-number', { active: duoanswer[index] && duoanswer[index].studentAnswer && duoanswer[index].studentAnswer.length > 0 }]"
              @click="scrollToQuestion('multipleChoice', index)"
            >{{ form.singleChoice.length + index + 1 }}</div>
          </div>

          <!-- 判断题题号 -->
          <div class="question-type-title">判断题</div>
          <div class="question-numbers">
            <div
              v-for="(item, index) in form.ifQuestions"
              :key="index"
              :class="['question-number', { active: ifanswer[index] && ifanswer[index].studentAnswer  != null }]"
              @click="scrollToQuestion('ifQuestions', index)"
            >{{ form.singleChoice.length + form.multipleChoice.length + index + 1 }}</div>
          </div>
        </div>
      </el-aside>

      <!-- 保留的 Header -->
      <el-header class="align-center" style="height: 160px;">
        <h1>学生手册统考</h1>
        <div class="exam_info" :class="{ fixed: isFixed }">
          <span class="question-title-padding">试卷总分：{{ totalpoint }}</span>
          <span class="question-title-padding">考试时长：{{ remainingTime.minutes }}</span>
          <span class="question-title-padding">交卷计时：{{ formatTime(remainingTime) }}</span>
        </div>
      </el-header>

      <!-- 主体内容 -->
      <el-main>
        <el-form :model="form" ref="form" v-loading="formLoading" label-width="100px">
          <!-- 单选题 -->
          <h2 class="exme_title">单选题</h2>
          <el-form-item
            v-for="(danItem, index) in form.singleChoice"
            :key="danItem.answerSheetId"
            required
            :data-question-type="'singleChoice'"
            :data-question-index="index"
          >
            <h3>{{ index + 1 }}: {{ danItem.textContext }}</h3>
            <el-card class="exampaper-item-box">
              <el-form-item label-width="50px">
                <el-radio-group
                  v-model="dananswer[index].studentAnswer"
                  @change="() => submitAnswer('singleChoice', index, danItem.answerSheetId, dananswer[index].studentAnswer)"
                >
                  <el-radio
                    :label="itemIndex"
                    v-for="(item, itemIndex) in danItem.arrOptions"
                    :key="itemIndex"
                  >{{ item }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-card>
          </el-form-item>

          <!-- 多选题 -->
          <h2 class="exme_title">多选题</h2>
          <el-form-item
            v-for="(duoItem, index) in form.multipleChoice"
            :key="duoItem.answerSheetId"
            required
            :data-question-type="'multipleChoice'"
            :data-question-index="index"
          >
            <h3>{{ form.singleChoice.length + index + 1 }}: {{ duoItem.textContext }}</h3>
            <el-card class="exampaper-item-box">
              <el-form-item label-width="50px">
                <el-checkbox-group
                  v-model="duoanswer[index].studentAnswer"
                  @change="() => submitAnswer('multipleChoice', index, duoItem.answerSheetId, duoanswer[index].studentAnswer)"
                >
                  <el-checkbox
                    :label="itemIndex"
                    v-for="(item, itemIndex) in duoItem.arrOptions"
                    :key="itemIndex"
                  >{{ item }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-card>
          </el-form-item>

          <!-- 判断题 -->
          <h2 class="exme_title">判断题</h2>
          <el-form-item
            v-for="(ifItem, index) in form.ifQuestions"
            :key="ifItem.answerSheetId"
            required
            :data-question-type="'ifQuestions'"
            :data-question-index="index"
          >
            <h3>{{ form.singleChoice.length + form.multipleChoice.length + index + 1 }}: {{ ifItem.textContext }}</h3>
            <el-card class="exampaper-item-box">
              <el-form-item label-width="50px">
                <el-radio-group
                  v-model="ifanswer[index].studentAnswer"
                  @change="() => submitAnswer('ifQuestions', index, ifItem.answerSheetId, ifanswer[index].studentAnswer)"
                >
                  <el-radio :label="0">正确</el-radio>
                  <el-radio :label="1">错误</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-card>
          </el-form-item>
        </el-form>
      </el-main>

      <!-- Footer -->
      <el-footer class="align-center">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button type="danger" @click="cancelForm">取消</el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { applyStartExam, submitAnswerSheet, submitTestPaper } from "@/api/exam";

export default {
  data() {
    return {
      yearId: null,
      totalpoint: 100, // 试卷总分
      form: {
        singleChoice: [], // 单选题数组
        multipleChoice: [], // 多选题数组
        ifQuestions: [] // 判断题数组
      },
      formLoading: true,
      dananswer: [], // 单选题答案
      duoanswer: [], // 多选题答案
      ifanswer: [], // 判断题答案
      remainingTime: {
        minutes: 60, // 剩余分钟
        duration: 60, // 总分钟
        seconds: 0 // 剩余秒
      },
      timer: null,
      isFixed: false,
      testPaperId: null // 试卷ID
    };
  },
  created() {
    this.yearId = this.$route.query.yearId;
    this.StartExam();
    this.startCountdown();
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    clearInterval(this.timer);
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    // 初始化每个答案对象
    initializeAnswers() {
      this.dananswer = this.form.singleChoice.map(item => ({
        answerSheetId: item.answerSheetId,
        testPaperId: this.testPaperId,
        studentAnswer: null // 初始化为null
      }));

      this.duoanswer = this.form.multipleChoice.map(item => ({
        answerSheetId: item.answerSheetId,
        testPaperId: this.testPaperId,
        studentAnswer: [] // 多选题保持数组
      }));

      this.ifanswer = this.form.ifQuestions.map(item => ({
        answerSheetId: item.answerSheetId,
        testPaperId: this.testPaperId,
        studentAnswer: null // 初始化为null
      }));
    },

    //申请开始考试
    StartExam() {
      applyStartExam(this.yearId).then(res => {
        if (res.code === 200) {
          this.formLoading = false;
          this.testPaperId = res.data.testPaperId;
          this.remainingTime.duration = res.data.duration;
          this.remainingTime.minutes = res.data.duration;
          this.totalpoint = res.data.settingTotalPoints;
          this.form.singleChoice = res.data.singleChoice; //单选题
          this.form.multipleChoice = res.data.multipleChoice; //多选题
          this.form.ifQuestions = res.data.ifQuestions; //判断题
          this.initializeAnswers();
        } else if (res.code === 500) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          this.$router.push({ path: "/classroom/exam" });
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
          this.$router.push({ path: "/classroom/exam" });
        }
      });
    },

    // 提交单个答案
    submitAnswer(questionType, index, answerSheetId, answer) {
      // 根据题目类型更新答案数组
      if (questionType === "singleChoice") {
        this.dananswer[index].studentAnswer = answer;
      } else if (questionType === "multipleChoice") {
        this.duoanswer[index].studentAnswer = answer;
      } else if (questionType === "ifQuestions") {
        this.ifanswer[index].studentAnswer = answer;
      }
      console.log(answer, answerSheetId);
      // 可以在这里调用一个方法来提交答案，但不立即提交试卷
      this.submitSingleAnswer(questionType, answerSheetId, answer);
    },

    // 提交单个题目答案到服务器
    submitSingleAnswer(questionType, answerSheetId, answer) {
      // 构建答案对象
      let answerValue;
      if (questionType === "multipleChoice") {
        answerValue = answer;
      } else {
        // 将单选和判断的答案包装为数组
        answerValue = [answer];
      }

      const answerObj = {
        answerSheetId: answerSheetId,
        testPaperId: this.testPaperId,
        studentAnswer: JSON.stringify(answerValue)
      };
      //提交答案
      submitAnswerSheet(answerObj)
        .then(res => {
          if (res.code === 200) {
            console.log(res.data);
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "提交失败: " + res.msg
          });
        });
    },

    // 提交试卷
    submitForm() {
      if (!this.checkAnswers()) {
        this.$message({
          type: "warning",
          message: "请完成所有题目后再提交！"
        });
        return; // 直接返回，避免后续的确认对话框执行
      }
      this.$confirm("此操作将提交试卷, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          submitTestPaper(this.testPaperId)
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: "提交成功!"
                });
                this.$router.push({ path: "/classroom/exam" });
              } else {
                this.$message({
                  type: "error",
                  message: res.msg
                });
              }
            })
            .catch(error => {
              this.$message({
                type: "error",
                message: "提交失败: " + error.message
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 取消考试
    cancelForm() {
      this.$confirm("此操作将退出考试, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          this.$router.push({ path: "/classroom/exam" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },

    // 开始倒计时
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.remainingTime.seconds > 0) {
          this.remainingTime.seconds--;
        } else if (this.remainingTime.duration > 0) {
          this.remainingTime.duration--;
          this.remainingTime.seconds = 59;
        } else {
          clearInterval(this.timer);
          this.$alert("考试时间到！将会为你自动交卷。", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$message({
                type: "success",
                message: `交卷成功`
              });
            }
          });
          this.$router.push({ path: "/classroom/exam" });
        }
      }, 1000);
    },

    formatTime(time) {
      const duration = String(time.duration).padStart(2, "0");
      const seconds = String(time.seconds).padStart(2, "0");
      return `${duration}:${seconds}`;
    },
    handleScroll() {
      const examInfo = this.$el.querySelector(".exam_info");
      const offsetTop = examInfo.offsetTop;
      this.isFixed = window.scrollY > offsetTop;
    },
    scrollToQuestion(questionType, index) {
      const questionElement = this.$el.querySelector(
        `[data-question-type="${questionType}"][data-question-index="${index}"]`
      );
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: "smooth" });
      }
    },

    // 检查所有题目是否已完成
    checkAnswers() {
      return (
        this.dananswer.every(item => item.studentAnswer !== null) &&
        this.duoanswer.every(item => item.studentAnswer.length > 0) &&
        this.ifanswer.every(item => item.studentAnswer !== null)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.exam {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.question-number-box {
  width: 300px;
  position: fixed;
  left: 20px;
  top: 200px;
  height: calc(90vh - 160px);
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;

  .question-number-container {
    .question-type-title {
      font-size: 18px;
      font-weight: bold;
      margin: 20px 0 10px;
      color: #333;
    }

    .question-numbers {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;

      .question-number {
        width: 40px;
        height: 40px;
        background: #ddd;
        border: 1px solid #ccc;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        transition: background 0.3s, color 0.3s;

        &.active {
          background: #007bff;
          color: #fff;
          border-color: #007bff;
        }
      }
    }
  }
}

.exam .el-header,
.el-footer {
  text-align: center;
}

.exam_info {
  width: 100%;
  height: 100px;
  background: #77d4ff;
  font-size: 28px;
  line-height: 100px;
  transition: top 0.3s;

  &.fixed {
    position: fixed;
    top: 0;
    z-index: 1000;
  }
}

.el-main {
  flex: 1;
  margin-left: 320px;
  padding: 20px;
}

.el-footer {
  .align-center {
    text-align: center;
  }
}
</style>