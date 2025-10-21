<template>
  <div class="exam">
    <el-container>
      <!-- 头部 -->
      <el-header class="align-center">
        <h1>{{ testName }}学生手册统考</h1>
        <div class="exam-info-box">
          <span>考试总时长：{{form.duration }}分钟</span>||
          <span>考试总分：{{ form.settingTotalPoints }}分</span>||
          <span>得分:{{ form.totalPoints }}分</span>||
          <span>及格线：{{ (form.settingTotalPoints*form.passTotal)/100 }}分</span>||
          <span>提交时间：{{ form.endSubmitTime }}</span>
        </div>
        <div class="exam-info-box">
          <span>是否合格：{{form.isPass ? '合格' : '不合格' }}</span>||
          <span>每个题型分数占比：</span>
          <span>单选题:{{ form.singleChoicePointPercent }}%</span>||
          <span>多选题：{{ form.multipleChoicePointPercent }}%</span>||
          <span>判断题：{{ form.ifQuestionPointPercent }}%</span>
        </div>
        <div class="exam-info-box">
          <span>每个题型出现数量：</span>
          <span>单选题:{{ form.singleChoiceNum }}题</span>||
          <span>多选题：{{ form.multipleChoiceNum }}题</span>||
          <span>判断题：{{ form.ifQuestionNum }}题</span>
        </div>
      </el-header>

      <!-- 主体内容 -->
      <el-container>
        <!-- 题号显示区域 -->
        <div class="question-number-box">
          <!-- 单选题题号 -->
          <div class="question-type-title">单选题</div>
          <div
            v-for="(item, index) in form.singleChoice"
            :key="item.answerSheetId"
            class="question-number"
            :class="{'active': currentQuestionIndex === index}"
            @click="goToQuestion(index)"
          >{{ index + 1 }}</div>

          <!-- 多选题题号 -->
          <div class="question-type-title">多选题</div>
          <div
            v-for="(item, index) in form.multipleChoice"
            :key="item.answerSheetId"
            class="question-number"
            :class="{'active': currentQuestionIndex === (form.singleChoice.length + index)}"
            @click="goToQuestion(form.singleChoice.length + index)"
          >{{ form.singleChoice.length + index + 1 }}</div>

          <!-- 判断题题号 -->
          <div class="question-type-title">判断题</div>
          <div
            v-for="(item, index) in form.ifQuestions"
            :key="item.answerSheetId"
            class="question-number"
            :class="{'active': currentQuestionIndex === (form.singleChoice.length + form.multipleChoice.length + index)}"
            @click="goToQuestion(form.singleChoice.length + form.multipleChoice.length + index)"
          >{{ form.singleChoice.length + form.multipleChoice.length + index + 1 }}</div>
        </div>

        <!-- 题目内容区域 -->
        <el-main>
          <el-form
            :model="form"
            ref="form"
            v-loading="formLoading"
            label-width="100px"
            style="width:85%;float:right;"
          >
            <!-- 单选题 -->
            <h2 class="exme_title">单选题</h2>
            <el-form-item
              v-for="(danItem, index) in form.singleChoice"
              :key="danItem.answerSheetId"
              required
            >
              <h3
                class="question"
                :id="'single-choice-' + (index + 1)"
              >{{ index + 1 }}: {{ danItem.textContext }}</h3>
              <el-card class="exampaper-item-box">
                <el-radio-group v-model="dananswer[index].studentAnswer" :disabled="true">
                  <el-radio
                    :label="String(itemIndex)"
                    v-for="(item, itemIndex) in Object.values(danItem.arrOptions)"
                    :key="itemIndex"
                  >{{ item }}</el-radio>
                </el-radio-group>
                <!-- 显示正确答案 -->
                <div
                  class="correct-answer"
                  :style="getCorrectAnswerStyle(danItem.studentAnswer[0], danItem.correct[0])"
                >
                  [学生答案]：
                  <span
                    v-for="(studentAnswer, idx) in danItem.studentAnswer"
                    :key="idx"
                  >{{ getOptionText(danItem.arrOptions, studentAnswer) }}&nbsp;</span>
                  [正确答案]：
                  <span
                    v-for="(correctOption, idx) in danItem.correct"
                    :key="idx"
                  >{{ getOptionText(danItem.arrOptions, correctOption) }}&nbsp;</span>
                </div>
              </el-card>
            </el-form-item>

            <!-- 多选题 -->
            <h2 class="exme_title">多选题</h2>
            <el-form-item
              v-for="(duoItem, index) in form.multipleChoice"
              :key="duoItem.answerSheetId"
              required
            >
              <h3
                class="question"
                :id="'multiple-choice-' + (index + 1)"
              >{{ form.singleChoice.length + index + 1 }}: {{ duoItem.textContext }}</h3>
              <el-card class="exampaper-item-box">
                <el-checkbox-group v-model="duoanswer[index].studentAnswer" :disabled="true">
                  <el-checkbox
                    :label="itemIndex"
                    v-for="(item, itemIndex) in Object.values(duoItem.arrOptions)"
                    :key="itemIndex"
                  >{{ item }}</el-checkbox>
                </el-checkbox-group>
                <!-- 显示正确答案 -->
                <div
                  class="correct-answer"
                  :style="getCorrectAnswerStyleForMultiple(duoItem.studentAnswer, duoItem.correct)"
                >
                  [学生答案]：
                  <span
                    v-for="(studentAnswer, idx) in duoItem.studentAnswer"
                    :key="idx"
                  >{{ getOptionText(duoItem.arrOptions, studentAnswer) }}&nbsp;</span>
                  [正确答案]：
                  <span
                    v-for="(correctOption, idx) in duoItem.correct"
                    :key="idx"
                  >{{ getOptionText(duoItem.arrOptions, correctOption) }}&nbsp;</span>
                </div>
              </el-card>
            </el-form-item>

            <!-- 判断题 -->
            <h2 class="exme_title">判断题</h2>
            <el-form-item
              v-for="(ifItem, index) in form.ifQuestions"
              :key="ifItem.answerSheetId"
              required
            >
              <h3
                class="question"
                :id="'if-question-' + (index + 1)"
              >{{ form.singleChoice.length + form.multipleChoice.length + index + 1 }}: {{ ifItem.textContext }}</h3>
              <el-card class="exampaper-item-box">
                <el-radio-group v-model="ifanswer[index].studentAnswer" :disabled="true">
                  <el-radio :label="'0'">正确</el-radio>
                  <el-radio :label="'1'">错误</el-radio>
                </el-radio-group>
                <!-- 显示正确答案 -->
                <div
                  class="correct-answer"
                  :style="getCorrectAnswerStyle(ifanswer[index].studentAnswer, ifanswer[index].correct)"
                >
                  [学生答案]：
                  {{ formatAnswer(ifanswer[index].studentAnswer) }}
                  [正确答案]：
                  {{ formatAnswer(ifanswer[index].correct) }}
                </div>
              </el-card>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>

      <!-- 底部 -->
      <el-footer class="align-center">
        <el-button type="danger" @click="cancelForm">结束浏览</el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getTestPaperDetail } from "@/api/exam";

export default {
  data() {
    return {
      form: {
        singleChoice: [], // 单选题
        multipleChoice: [], // 多选题
        ifQuestions: [] // 判断题
      },
      formLoading: true, // 表单加载状态
      dananswer: [], // 单选题答案
      duoanswer: [], // 多选题答案
      ifanswer: [], // 判断题答案
      testPaperId: null, // 试卷ID
      testName: "", // 试卷名称
      currentQuestionIndex: -1 // 当前选中的题号索引
    };
  },
  created() {
    // 获取路由参数中的试卷ID
    this.testPaperId = this.$route.query.testPaperId;
    if (!this.testPaperId) {
      this.$message.error("试卷ID无效");
      this.$router.push({ path: "/classroom/ExmaRecord" });
      return;
    }
    // 获取试卷详情
    this.getTestPaperDetail();
  },
  methods: {
    // 获取试卷详情
    getTestPaperDetail() {
      getTestPaperDetail(this.testPaperId).then(res => {
        console.log("API 返回的数据:", res.data); // 检查数据结构
        if (res.code === 200) {
          this.form = res.data;
          this.form.singleChoice = Array.isArray(res.data.singleChoice)
            ? res.data.singleChoice
            : [];
          this.form.multipleChoice = Array.isArray(res.data.multipleChoice)
            ? res.data.multipleChoice
            : [];
          this.form.ifQuestions = Array.isArray(res.data.ifQuestions)
            ? res.data.ifQuestions
            : [];
          this.testName = res.data.yearTypeName;
          this.initializeAnswers();
          this.formLoading = false;
        }
      });
    },

    // 初始化答案
    initializeAnswers() {
      // 单选题答案初始化
      // 单选题答案初始化
      this.dananswer = this.form.singleChoice.map(item => ({
        answerSheetId: item.answerSheetId,
        testPaperId: this.testPaperId,
        studentAnswer:
          item.studentAnswer && item.studentAnswer.length > 0
            ? String(item.studentAnswer[0]) // 转为字符串
            : null,
        correct:
          item.correct && item.correct.length > 0
            ? String(item.correct[0])
            : null
      }));

      // 多选题答案初始化
      this.duoanswer = this.form.multipleChoice.map(item => ({
        answerSheetId: item.answerSheetId,
        testPaperId: this.testPaperId,
        studentAnswer:
          item.studentAnswer && item.studentAnswer.length > 0
            ? item.studentAnswer.map(Number)
            : [],
        correct: item.correct && item.correct.length > 0 ? item.correct : []
      }));

      // 判断题答案初始化
      this.ifanswer = this.form.ifQuestions.map(item => ({
        answerSheetId: item.answerSheetId,
        testPaperId: this.testPaperId,
        studentAnswer:(item.studentAnswer && String(item.studentAnswer[0])) || null,
        correct: (item.correct && String(item.correct[0])) || null
      }));
      console.log("判断题答案初始化", this.ifanswer);
    },

    // 获取选项文本
    getOptionText(arrOptions, optionIndex) {
      // 获取选项数组
      const options = Object.values(arrOptions);
      // 返回指定索引的选项文本
      return options[optionIndex];
    },

    // 获取正确答案样式（单选题和判断题）
    getCorrectAnswerStyle(studentAnswer, correctAnswer) {
      // 如果学生答案与正确答案一致，返回绿色背景样式，否则返回红色背景样式
      return studentAnswer === correctAnswer
        ? {
            backgroundColor: "#f0f9eb",
            color: "#67c23a",
            border: "1px solid #e1f3d8"
          }
        : {
            backgroundColor: "#fef0f0",
            color: "#f56c6c",
            border: "1px solid #fde2e2"
          };
    },

    // 获取正确答案样式（多选题）
    getCorrectAnswerStyleForMultiple(studentAnswers, correctAnswers) {
      // 对学生答案和正确答案进行排序，以便比较
      const sortedStudentAnswers = [...studentAnswers].sort();
      const sortedCorrectAnswers = [...correctAnswers].sort();
      // 如果学生答案与正确答案一致，返回绿色背景样式，否则返回红色背景样式
      return JSON.stringify(sortedStudentAnswers) ==
        JSON.stringify(sortedCorrectAnswers)
        ? {
            backgroundColor: "#f0f9eb",
            color: "#67c23a",
            border: "1px solid #e1f3d8"
          }
        : {
            backgroundColor: "#fef0f0",
            color: "#f56c6c",
            border: "1px solid #fde2e2"
          };
    },

    //格式化判断题答案
    formatAnswer(answer) {
      return answer == 0 ? "正确" : "错误";
    },

    // 跳转到指定题目
    goToQuestion(index) {
      // 设置当前选中的题号索引
      this.currentQuestionIndex = index;
      let questionElement = null;

      // 判断题号所属题型
      if (index < this.form.singleChoice.length) {
        // 单选题
        questionElement = document.getElementById(`single-choice-${index + 1}`);
      } else if (
        index <
        this.form.singleChoice.length + this.form.multipleChoice.length
      ) {
        // 多选题
        questionElement = document.getElementById(
          `multiple-choice-${index - this.form.singleChoice.length + 1}`
        );
      } else {
        // 判断题
        questionElement = document.getElementById(
          `if-question-${index -
            this.form.singleChoice.length -
            this.form.multipleChoice.length +
            1}`
        );
      }

      // 如果找到题目元素，滚动到该位置
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: "smooth" });
      }
    },
    // 退出考试
    cancelForm() {
      this.$confirm("此操作将退出浏览, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message.success("退出成功!");
          this.$router.push({ path: "/classroom/ExmaRecord" });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.exam .el-header {
  padding: 0;
  height: auto !important;
}

.align-center {
  text-align: center;
}

.exam .exme_title {
  margin: 40px 0 20px 100px;
}

.exam .el-radio__original[aria-hidden="true"] {
  display: none !important;
}

/* 正确答案样式 */
.correct-answer {
  margin-top: 5px;
  padding: 5px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}

/* 题号显示样式 */
.question-number-box {
  position: fixed;
  left: 20px; // 离左边有 20px 的距离
  top: 100px; // 离顶部有 100px 的距离
  background-color: #ffffff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(5, 1fr); // 每行显示 5 个题号
  gap: 10px; // 题号之间的间距
  height: calc(100vh - 120px); // 设置题号显示区域高度
  overflow-y: auto; // 如果题号过多，显示滚动条
  z-index: 1000; // 确保题号显示在最上层
}

.question-type-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #606266;
  grid-column: 1 / -1; // 题型标题占据整行
  text-align: center;
}

.question-number {
  width: 40px;
  height: 40px;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #606266;
}

.el-radio__input .is-disabled+span .el-radio__label{
  color: #409EFF !important;
}

.question-number.active {
  background-color: #409eff;
  color: #ffffff;
  border-color: #409eff;
}

.question {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

.exam-info-box {
  width: 50%;
  margin: 10px auto;
  font-size: 18px;
  // text-align: left;
}
.exam-info-box span{
  margin: 0 5px;
}
</style>