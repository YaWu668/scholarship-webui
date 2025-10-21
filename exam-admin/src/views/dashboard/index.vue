<template>
  <div class="dashboard-container">
    <h2>欢迎使用智能评奖评优系统</h2>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="exam" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">教师与学生总数</div>
            <count-to
              :start-val="0"
              :end-val="examPaperCount"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="question" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">班级总数</div>
            <count-to :start-val="0" :end-val="ClassCount" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="doexampaper" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">试卷总数</div>
            <count-to
              :start-val="0"
              :end-val="doExamPaperCount"
              :duration="3600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="doquestion" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">题目总数</div>
            <count-to
              :start-val="0"
              :end-val="doQuestionCount"
              :duration="3200"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import resize from "./components/mixins/resize";
import CountTo from "vue-count-to";
import { getClasslist, getSearchUserList } from "@/api/class";
import { getExamList } from "@/api/exam";
import { getQuestionList } from "@/api/question";
export default {
  mixins: [resize],
  components: {
    CountTo
  },
  data() {
    return {
      examPaperCount: 0, //学生总数
      ClassCount: 0, //班级总数
      doExamPaperCount: 0, //试卷总数
      doQuestionCount: 0, //题目总数
      queryParam: {
        pageIndex: 1,
        pageSize: 50000,
        userName: ""
      },
      loading: false
    };
  },
  mounted() {
    this.getUserLength();
    this.getClassLength();
    this.getExamLength();
    this.getQuestionLength();
  },
  methods: {
    //获取学生总数
    getUserLength() {
      getSearchUserList(this.queryParam).then(res => {
        if (res.code == 200) {
          this.examPaperCount = res.data.records.length;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取班级总数
    getClassLength() {
      getClasslist(this.queryParam).then(res => {
        if (res.code == 200) {
          this.ClassCount = res.data.list.length;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //试卷数量
    getExamLength() {
      getExamList(this.queryParam).then(res => {
        if (res.code == 200) {
          this.doExamPaperCount = res.data.list.length;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getQuestionLength() {
      getQuestionList(this.queryParam).then(res => {
        if (res.code == 200) {
          this.doQuestionCount = res.data.total;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}

.echarts-line {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}
</style>
