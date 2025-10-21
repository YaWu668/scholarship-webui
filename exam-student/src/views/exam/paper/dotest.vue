<template>
  <div class="dotest">
    <!-- 显示答题统计信息 -->
    <div class="stats-container">
      <div class="stat-item">
        <span>已答题数：</span>
        <span>{{ answeredCount }}/20</span>
      </div>
      <div class="stat-item">
        <span>正确率：</span>
        <span>{{ correctRate }}%</span>
      </div>
      <div class="stat-item">
        <span>用时：</span>
        <span>{{ timeSpent }}</span>
      </div>
    </div>

    <!-- 题目内容 -->
    <div v-loading="loading">
      <h1>题库练习</h1>
      <div class="question-list">
        <p>
          <strong>题目类型：</strong>
          {{ getQuestionType(question.questionType) }}
        </p>
        <p>
          <strong>题目：</strong>
          {{ question.textContext }}
        </p>
        <div>
          <p>
            <strong>选项：</strong>
          </p>
          <ul>
            <li
              v-for="(option, index) in question.arrOptionsArr"
              :key="index"
              :class="getOptionClass(index)"
              @click="!isSubmitted && selectOption(index)"
            >
              {{ option }}
            </li>
          </ul>
        </div>
        <div v-if="isSubmitted">
          <p>
            你选择了：
            {{ selectedAnswersText }}
            <span
              :class="{ correct: isCorrectAnswer(), incorrect: !isCorrectAnswer() }"
            >
              ({{ isCorrectAnswer() ? "正确" : "错误" }})
            </span>
          </p>
          <p>正确答案是：{{ correctAnswersText }}</p>
        </div>
        <div v-else>
          <el-button @click="submitAnswer">提交答案</el-button>
        </div>
        <el-button v-if="isSubmitted" @click="fetchQuestion">下一题</el-button>
        <el-button v-else @click="exitPractice">退出练习</el-button>
      </div>
    </div>

    <!-- 完成20题后的弹窗 -->
    <el-dialog
      title="练习完成"
      :visible.sync="isDialogVisible"
      width="30%"
      center
    >
      <div class="dialog-content">
        <p>您已完成20题练习</p>
        <p>用时：{{ timeSpent }}</p>
        <p>正确率：{{ correctRate }}%</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exitPractice">退出练习</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPractice } from "@/api/question";

export default {
  data() {
    return {
      loading: true, // 加载状态
      question: {}, // 当前题目
      userSelected: [], // 用户选择的答案（数组）
      isSubmitted: false, // 是否已提交
      answeredCount: 0, // 已答题数
      correctCount: 0, // 正确答题数
      startTime: null, // 开始时间
      endTime: null, // 结束时间
      isDialogVisible: false, // 弹窗显示状态
    };
  },
  computed: {
    // 正确答案索引
    correctAnswerIndex() {
      return this.question.correctArr ? +this.question.correctArr[0] : null;
    },
    // 用户选择的答案文本
    selectedAnswersText() {
      if (this.question.questionType === 3) {
        return this.question.arrOptionsArr[this.userSelected];
      } else {
        return this.userSelected.map(idx => this.getOptionText(idx)).join(", ");
      }
    },
    // 正确答案文本
    correctAnswersText() {
      if (this.question.questionType === 2) {
        return this.question.correctArr
          .map(idx => this.getOptionText(idx))
          .join(", ");
      } else if (this.question.questionType === 3) {
        return this.getOptionText(this.correctAnswerIndex);
      } else {
        return this.getOptionText(this.correctAnswerIndex);
      }
    },
    // 正确率
    correctRate() {
      return this.answeredCount > 0 ? Math.round((this.correctCount / this.answeredCount) * 100) : 0;
    },
    // 用时
    timeSpent() {
      if (!this.startTime || !this.endTime) return "00:00:00";
      const diff = this.endTime - this.startTime;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    },
  },
  methods: {
    // 获取新题目
    async fetchQuestion() {
      if (this.answeredCount >= 20) {
        this.showCompletionDialog();
        return;
      }

      this.loading = true;
      this.userSelected = [];
      this.isSubmitted = false;

      try {
        const response = await getPractice();
        const data = response.data;
        let questionData = {
          questionType: data.questionType,
          textContext: data.textContext,
          correctArr: data.correctArr,
          arrOptionsArr: [],
        };

        if (data.questionType === 3) {
          questionData.arrOptionsArr = ["对", "错"];
          questionData.correctArr = [parseInt(data.correctArr[0])];
        } else {
          questionData.arrOptionsArr = data.arrOptionsArr;
          questionData.correctArr = data.correctArr.map(Number);
        }

        this.question = questionData;
      } catch (error) {
        console.error("加载题目失败：", error);
      } finally {
        this.loading = false;
      }
    },

    // 用户选择答案
    selectOption(index) {
      if (this.question.questionType === 2) {
        // 多选题逻辑：允许用户选择和取消选择
        if (this.userSelected.includes(index)) {
          // 如果已经选择，就取消选择
          this.userSelected = this.userSelected.filter(idx => idx !== index);
        } else {
          // 如果未选择，就添加选择
          this.userSelected.push(index);
        }
      } else {
        // 单选题或判断题逻辑：直接替换选择
        this.userSelected = [index];
      }
    },

    // 提交答案
    submitAnswer() {
      this.isSubmitted = true;
      const isCorrect = this.isCorrectAnswer();

      if (isCorrect) {
        this.correctCount++;
      }

      this.answeredCount++;
      this.endTime = new Date();

      if (this.answeredCount >= 20) {
        this.showCompletionDialog();
      }
    },

    // 判断答案是否正确
    isCorrectAnswer() {
      if (this.question.questionType === 2) {
        const selectedSorted = [...this.userSelected].sort();
        const correctSorted = [...this.question.correctArr].sort();
        return JSON.stringify(selectedSorted) === JSON.stringify(correctSorted);
      } else if (this.question.questionType === 3) {
        return this.userSelected[0] === this.correctAnswerIndex;
      } else {
        return this.userSelected[0] === this.correctAnswerIndex;
      }
    },

    // 显示完成练习的弹窗
    showCompletionDialog() {
      this.isDialogVisible = true;
      this.loading = false; // 确保加载状态关闭
    },

    // 退出练习
    exitPractice() {
      this.resetPractice();
      this.$router.go(-1); // 返回上一页
    },

    // 重置练习数据
    resetPractice() {
      this.answeredCount = 0;
      this.correctCount = 0;
      this.startTime = null;
      this.endTime = null;
      this.isDialogVisible = false;
      this.fetchQuestion(); // 加载新题目
    },

    // 获取题目类型文本
    getQuestionType(type) {
      const types = { 1: "单选题", 2: "多选题", 3: "判断题" };
      return types[type] || "未知类型";
    },

    // 获取选项文本
    getOptionText(index) {
      if (this.question.questionType === 3) {
        return this.question.arrOptionsArr[index];
      } else {
        return ` ${this.question.arrOptionsArr[index]}`;
      }
    },

    // 获取选项样式
    getOptionClass(index) {
      if (this.isSubmitted) {
        if (this.question.questionType === 3) {
          if (index === this.correctAnswerIndex) {
            return "correct-option";
          } else if (index === this.userSelected[0]) {
            return "incorrect-option";
          }
        } else {
          if (this.question.correctArr.includes(index)) {
            return "correct-option";
          } else if (this.userSelected.includes(index)) {
            return "incorrect-option";
          }
        }
      } else {
        if (this.userSelected.includes(index)) {
          return "selected-option";
        }
      }
      return "";
    },
  },
  created() {
    this.startTime = new Date(); // 记录开始时间
    this.fetchQuestion();
  },
};
</script>

<style scoped>
.dotest {
  width: 60%;
  min-height: 700px;
  background: #fff;
  border-radius: 2%;
  margin: 8vh auto 0;
  padding: 20px;
}

.dotest h1 {
  text-align: center;
  margin-bottom: 20px;
}

.dotest ul {
  list-style-type: none;
  padding: 0;
}

.dotest li {
  padding: 8px;
  border: 1px solid #ddd;
  margin: 10px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dotest li:hover {
  background-color: #f4f4f4;
}

.dotest .correct-option {
  background-color: #d4edda;
  color: #155724;
}

.dotest .selected-option {
  background-color: #f0f8ff;
  color: #00008b;
}

.dotest .incorrect-option {
  background-color: #f8d7da;
  color: #721c24;
}

.dotest .correct {
  color: green;
}

.dotest .incorrect {
  color: red;
}

.dotest .question-list {
  width: 100%;
  margin: 0 auto;
}

/* 统计信息样式 */
.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.stat-item {
  font-size: 14px;
  color: #606266;
}

/* 弹窗内容样式 */
.dialog-content {
  text-align: center;
  padding: 20px 0;
  position: relative;
  z-index: 9999;
}

.dialog-content p {
  margin-bottom: 10px;
  font-size: 16px;
}
</style>