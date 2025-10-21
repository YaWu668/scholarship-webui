<template>
  <div>
    <PageTitle :title="'奖学金申请'"></PageTitle>
    <div class="Apply-list">
      <el-form :inline="true" :model="qureyForm" class="demo-form-inline">
        <el-form-item label="年度">
          <el-select
            v-model="qureyForm.annuPrizeId"
            @change="getBonusListByYearId"
            placeholder="请选择申请年度"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <!-- 学分绩列 -->
        <el-table-column prop="creditCredits" align="center" label="学分绩">
          <template slot-scope="{ row }">{{ formatScore(row.creditCredits) }}</template>
        </el-table-column>

        <!-- 英语四级成绩列 -->
        <el-table-column prop="englishLevelFour" align="center" label="英语四级">
          <template slot-scope="{ row }">
            <!-- 高亮显示逻辑 -->
            <span
              :class="highlightEnglishFour(row.englishLevelFour)"
            >{{ formatScore(row.englishLevelFour) }}</span>
          </template>
        </el-table-column>

        <!-- 英语平均分列 -->
        <el-table-column prop="averageEnglishScore" align="center" label="英语平均分">
          <template slot-scope="{ row }">
            <!-- 高亮显示逻辑 -->
            <span
              :class="highlightEnglishAverage(row.averageEnglishScore)"
            >{{ formatScore(row.averageEnglishScore) }}</span>
          </template>
        </el-table-column>

        <!-- 其他列保持不变 -->
        <el-table-column prop="totalPoints" align="center" label="学生手册分数">
          <template slot-scope="{ row }">{{ formatScore(row.totalPoints) }}</template>
        </el-table-column>
        <el-table-column prop="moralEducationPoints" align="center" label="德育分">
          <template slot-scope="{ row }">{{ formatScore(row.moralEducationPoints) }}</template>
        </el-table-column>
        <el-table-column prop="physicalTestScores" align="center" label="体育成绩">
          <template slot-scope="{ row }">{{ formatScore(row.physicalTestScores) }}</template>
        </el-table-column>

        <!-- 动态课程成绩列 -->
        <el-table-column v-if="courseColumns.length > 0" align="center" label="课程成绩">
          <el-table-column
            v-for="(course, index) in courseColumns"
            :key="index"
            :label="course.courseName"
            align="center"
            min-width="120"
          >
            <template slot-scope="{ row }">{{ getCourseScore(row.scores, course.courseName) }}</template>
          </el-table-column>
        </el-table-column>

        <!-- 其他列保持不变 -->
        <el-table-column prop="isDisciplinary" align="center" label="是否违纪">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isDisciplinary === 'N'" type="success">无违纪</el-tag>
            <el-tag v-else-if="scope.row.isDisciplinary === 'Y'" type="danger">有违纪</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="disciplinary" align="center" label="违纪情况说明">
          <template slot-scope="scope">{{ formatDiscipline(scope.row.disciplinary) }}</template>
        </el-table-column>
        <el-table-column prop="isFail" align="center" label="是否有挂科">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isFail === 'N'" type="success">无挂科</el-tag>
            <el-tag v-else-if="scope.row.isFail === 'Y'" type="danger">有挂科</el-tag>
          </template>
        </el-table-column>
        <el-table-column porp="status" align="center" label="状态" width="150px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '-2'" type="danger">学校驳回</el-tag>
            <el-tag v-else-if="scope.row.status === '-1'" type="danger">学院驳回</el-tag>
            <el-tag v-else-if="scope.row.status === '0'" type="danger">辅导员驳回</el-tag>
            <el-tag v-else-if="scope.row.status === '1'" type="info">未申请</el-tag>
            <el-tag v-else-if="scope.row.status === '2'">辅导员待审核</el-tag>
            <el-tag v-else-if="scope.row.status === '3'">学院待审核</el-tag>
            <el-tag v-else-if="scope.row.status === '4'">学校待审核</el-tag>
            <el-tag v-else-if="scope.row.status === '5'" type="success">申请成功</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isUpdateGrade" align="center" label="是否申请修改成绩" width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isUpdateGrade === '0'" type="danger">申请失败</el-tag>
            <el-tag v-else-if="scope.row.isUpdateGrade === '1'">没有申请</el-tag>
            <el-tag v-else-if="scope.row.isUpdateGrade === '2'" type="warning">已申请</el-tag>
            <el-tag v-else-if="scope.row.isUpdateGrade === '3'" type="success">申请成功</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="awardLevel" align="center" label="奖项等级"></el-table-column>
        <el-table-column prop="material" align="center" label="成绩修改材料证明">
          <template slot-scope="scope">
            <img
              v-if="!extractImgUrl(scope.row.material)"
              src="@/assets/photo.png"
              @click="getMaterial(scope.row)"
              style="max-width: 100px; cursor: pointer;"
            />
            <p v-else>-</p>
          </template>
        </el-table-column>
        <el-table-column prop="material" align="center" label="修改成绩材料说明" width="200px">
          <template slot-scope="scope">{{ getExplain(scope.row.material) }}</template>
        </el-table-column>
        <el-table-column prop="remark" align="center" label="拒绝理由" width="200px">
          <template slot-scope="scope">{{ formatRemark(scope.row.remark) }}</template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column fixed="right" align="center" label="操作" width="240">
          <template slot-scope="scope">
            <!-- 按钮仍保持原有v-if逻辑 -->
            <el-button
              v-if="scope.row.status === '1'"
              type="primary"
              size="mini"
              style="margin-right: 10px;"
              @click="handleApply(scope.row)"
            >提交申请</el-button>
            <router-link
              :to="{ path: '/ApplyChangeGrades', query: { applyId: scope.row.annuPrizeApplyId } }"
            >
              <el-button type="primary" size="mini">申请修改成绩</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import PageTitle from "@/components/PageTitle";
import {
  getBonusList,
  getBonusListByYearId,
  submitBonus,
  downloadScoreChangeFile
} from "@/api/bonus";

export default {
  data() {
    return {
      qureyForm: {
        annuPrizeId: null, // 奖学金年度id
        pageIndex: 1,
        pageSize: 10
      },
      listLoading: true,
      tableData: [],
      courseColumns: [], // 课程列
      options: [], // 年度列表下拉菜单
      search: ""
    };
  },
  created() {
    this.getBonusList();
  },
  methods: {
    // 获取奖学金年度列表
    getBonusList() {
      getBonusList().then(res => {
        if (res.code === 200) {
          // 格式化后端返回的数据为 options 的结构
          this.options = res.data.list.map(item => ({
            label: item.annuPrizeName,
            value: item.annuPrizeId
          }));

          // 默认选中第一项
          if (this.options.length > 0) {
            this.qureyForm.annuPrizeId = this.options[0].value;
          }
          this.getBonusListByYearId();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取可申请的奖学金列表
    getBonusListByYearId() {
      getBonusListByYearId(this.qureyForm).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.courseColumns = [];
          if (this.tableData.length > 0) {
            const firstStudent = this.tableData[0];
            if (firstStudent.scores && firstStudent.scores.length > 0) {
              this.courseColumns = firstStudent.scores;
            }
          }
          this.listLoading = false;
        } else if (res.code == 500) {
          this.$message.error(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },

    // 提交申请
    handleApply(row) {
      this.$confirm("请仔细核对成绩无误！确认提交申请？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        submitBonus(row.annuPrizeApplyId).then(res => {
          if (res.code === 200) {
            this.$message.success("提交成功");
            this.getBonusListByYearId();
          } else if (res.code == 500) this.$message.error(res.message);
          else this.$message.error(res.message);
        });
      });
    },

    // 搜索功能
    handleSearch() {
      this.getBonusListByYearId();
    },

    // 重置功能
    handleReset() {
      this.qureyForm.annuPrizeId = null;
      this.search = "";
      this.getBonusListByYearId();
    },

    // 格式化课程成绩
    getCourseScore(scoresList, courseName) {
      if (!scoresList) return "-";
      const course = scoresList.find(item => item.courseName === courseName);
      return course ? course.scores : "-";
    },
    formatScore(score) {
      if (score === "" || score === undefined) {
        return "-";
      }
      return score;
    },
    // 格式化违纪情况说明
    formatDiscipline(discipline) {
      if (discipline === "" || discipline === undefined) {
        return "-";
      }
      return discipline;
    },
    // 格式化拒绝理由
    formatRemark(remark) {
      if (!remark) return "-";
      try {
        const remarkObj = JSON.parse(remark);
        let formattedRemark = "";
        if (remarkObj.teacher) {
          formattedRemark += `辅导员：${remarkObj.teacher}`;
        }
        if (remarkObj.admin) {
          formattedRemark += formattedRemark
            ? "，管理员：${remarkObj.admin}"
            : `管理员：${remarkObj.admin}`;
        }
        return formattedRemark || "-";
      } catch (error) {
        return remark;
      }
    },
    // 英语四级高亮显示
    highlightEnglishFour(value) {
      if (value >= 350) {
        return "highlight";
      }
      return "";
    },
    // 英语平均分高亮显示
    highlightEnglishAverage(value) {
      if (value >= 70) {
        return "highlight";
      }
      return "";
    },
    // 获取explain的值
    getExplain(material) {
      if (!material) return "-"; // 如果material为空，返回"-"
      try {
        const materialObj = JSON.parse(material);
        return materialObj.explain || "-"; // 如果explain不存在，返回"-"
      } catch (error) {
        return "-"; // 解析失败时返回"-"
      }
    },
    // 获取imgUrls的值
    extractImgUrl(material) {
      if (!material) return "-"; // 如果material为空，返回"-"
      try {
        const materialObj = JSON.parse(material);
        return (materialObj.imgUrls && materialObj.imgUrls[0]) || "-"; // 如果explain不存在，返回"-"
      } catch (error) {
        return "-"; // 解析失败时返回"-"
      }
    },

    getMaterial(row) {
      const imgUrl = this.getimgUrls(row.material);
      const data = { url: imgUrl[0] }; // 修正这里的拼写错误，假设原本是 imgUrl[0]

      downloadScoreChangeFile(data)
        .then(res => {
          const blob = new Blob([res], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          const fileName =
            res.fileName ||
            `修改成绩证明材料.${this.getFileType(res)}`;

          link.href = url;
          link.setAttribute("download", fileName); // 修改文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.$message.success("下载成功");
        })
        .catch(error => {
          this.$message.error(`下载失败: ${error.message || "网络错误"}`);
        });
    },
    // 辅助函数：根据文件数据获取文件类型
    getFileType(fileData) {
      const signature = new Uint8Array(fileData).subarray(0, 4);
      if (signature[0] === 0xff && signature[1] === 0xd8) return "jpg"; // JPEG
      if (
        signature[0] === 0x89 &&
        signature[1] === 0x50 &&
        signature[2] === 0x4e &&
        signature[3] === 0x47
      )
        return "png"; // PNG
      // 可以添加更多文件类型检测
      return "jpg"; // 默认返回 JPG
    },
    getimgUrls(material) {
      if (!material) return "-"; // 如果material为空，返回"-"
      try {
        const materialObj = JSON.parse(material);
        return materialObj.imgUrls || "-"; // 如果explain不存在，返回"-"
      } catch (error) {
        return "-"; // 解析失败时返回"-"
      }
    },
  },
  computed: {
    hasCourses() {
      return this.courseColumns.length > 0;
    }
  },
  components: {
    PageTitle
  }
};
</script>

<style>
.Apply-list {
  margin-top: 20px;
}
</style>