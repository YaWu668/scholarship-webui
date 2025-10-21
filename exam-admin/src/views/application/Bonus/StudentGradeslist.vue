<template>
  <!-- 容器div，用于包含整个页面的内容 -->
  <div class="app-container Bonus">
    <!-- 查询表单 -->
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <!-- 查询和添加按钮 -->
      <el-form-item>
        <h3>
          {{ yearName }}
          <span v-if="grandParent != undefined">--{{ grandParent.label }}</span>
          <span v-if="parent != null">--{{ parent.label }}</span>
          --{{ row.label }}
        </h3>
      </el-form-item>

      <!-- 状态下拉框 -->
      <el-form-item label="状态：">
        <el-select
          v-model="queryParam.statusvalue"
          @change="getStudentGrades"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 英语四级下拉框 -->
      <el-form-item label="英语四级成绩：">
        <el-select
          v-model="queryParam.englishQualified"
          @change="getStudentGrades"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in englishQualifiedoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 英语平均分下拉框 -->
      <el-form-item label="英语平均分：">
        <el-select
          v-model="queryParam.englishAverageQualified"
          @change="getStudentGrades"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in englishoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 德育分下拉框 -->
      <el-form-item label="德育分：">
        <el-select
          v-model="queryParam.moralQualified"
          @change="getStudentGrades"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in moralQualifioptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 是否挂科下拉框 -->
      <el-form-item label="挂科情况：">
        <el-select
          v-model="queryParam.fail"
          @change="getStudentGrades"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in failoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 是否违纪下拉框 -->
      <el-form-item label="是否违纪：">
        <el-select
          v-model="queryParam.isDisciplinary"
          @change="getStudentGrades"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in isDisciplinaryoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 学生手册下拉框 -->
      <el-form-item label="学生手册成绩：">
        <el-select
          v-model="queryParam.totalPoints"
          @change="getStudentGrades"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in totalPointsoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 体测成绩下拉框 -->
      <el-form-item label="体测成绩：">
        <el-select
          v-model="queryParam.physicalMeasurements"
          @change="getStudentGrades"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in physicalMeasurementsoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 成绩更新情况下拉框 -->
      <el-form-item label="成绩更新情况：">
        <el-select
          v-model="queryParam.isUpdateGrade"
          @change="getStudentGrades"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in isUpdateGradeoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 批量操作按钮 -->
      <el-form-item>
        <el-button type="primary" @click="batchEditStatus(1)">批量通过</el-button>
        <el-button type="danger" @click="openbatchDialog(2)">批量驳回</el-button>
        <el-button type="primary" @click="resetForm">重置列表</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格，用于展示学生数据 -->
    <el-table
      :data="tableData"
      v-loading="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- 多选列 -->
      <el-table-column type="selection" width="55"></el-table-column>

      <!-- 排名列 -->
      <el-table-column prop="creditRank" fixed align="center" label="排名">
        <template slot-scope="{row}">{{ formatScore(row.creditRank) }}</template>
      </el-table-column>

      <!-- 学号列 -->
      <el-table-column prop="userName" fixed align="center" label="学号"></el-table-column>

      <!-- 姓名列 -->
      <el-table-column prop="nickName" fixed align="center" label="姓名"></el-table-column>

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
          <template slot-scope="{ row }">{{ getCourseScore(row.scoresList, course.courseName) }}</template>
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
          <el-tag v-else-if="scope.row.status === '2'" type="warning">辅导员待审核</el-tag>
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
      <el-table-column prop="levelUrl" align="center" label="成绩修改材料证明">
        <template slot-scope="scope">
          <img
            v-if="scope.row._cachedImgUrl"
            :src="apiurl +`/file/download?fileUrl=`+ extractImgUrl(scope.row.material)"
            @click="getMaterial(scope.row)"
            style="max-width: 100px; cursor: pointer;"
          />
          <p v-else>-</p>
        </template>
      </el-table-column>
      <el-table-column prop="material" align="center" label="修改成绩材料说明" width="200px">
        <template slot-scope="scope">{{ getExplain(scope.row.material) }}</template>
      </el-table-column>
      <el-table-column prop="remark" align="center" label="拒绝理由" width="250px">
        <template slot-scope="scope">
          <span style="white-space: pre-line;">{{ formatRemark(scope.row.remark) }}</span>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column fixed="right" align="center" label="操作" width="450">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handlelist(scope.row)">查看课程成绩详情</el-button>
          <el-popover
            v-if="scope.row.isUpdateGrade == '2'"
            placement="top"
            width="150"
            trigger="click"
          >
            <!-- 关键修改：添加 trigger 属性 -->
            <div style="display: flex;">
              <el-button size="mini" type="primary" @click="audit(scope.row,1)" class="link-left">同意</el-button>
              <el-button size="mini" type="danger" @click="audit(scope.row,0)" class="link-left">驳回</el-button>
            </div>
            <el-button class="link-left" type="primary" size="mini" slot="reference">审批成绩修改申请</el-button>
          </el-popover>
          <el-button size="mini" type="primary" @click="handleEditStatus(scope.row)">通过</el-button>
          <el-button size="mini" type="danger" @click="openDialog(scope.row, 4)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination
      v-show="total > 0 && Nodetype == 'M'"
      :total="total"
      :page-sizes="[20, 30, 40, 50]"
      :page.sync="queryParam.pageIndex"
      :limit.sync="queryParam.pageSize"
      @size-change="getStudentGrades"
      @pagination="getStudentGrades"
    />
    <pagination
      v-show="total > 0 && (Nodetype == 'Y' || Nodetype == 'C')"
      :total="total"
      :page-sizes="[200, 300, 400, 500]"
      :page.sync="queryParam.pageIndex"
      :limit.sync="queryParam.pageSize"
      @size-change="getStudentGrades"
      @pagination="getStudentGrades"
    />
    <router-link :to="{ path: '/bonus/BonusStudentList' }">
      <el-button style="float: right; margin: 25px 80px 0 0" type="danger">返回</el-button>
    </router-link>

    <!-- 弹窗部分保持不变 -->
    <el-dialog title="课程成绩详情" :visible.sync="dialogVisible" top="8vh" width="80%">
      <el-form :model="dialogParam" label-width="100px">
        <el-form-item label="姓名:">{{ dialogParam.userName }}</el-form-item>
        <el-form-item label="学号:">{{ dialogParam.nickName }}</el-form-item>
      </el-form>
      <el-table :data="dialogtable" border style="width: 100%">
        <el-table-column prop="courseName" label="课程名称" align="center"></el-table-column>
        <el-table-column prop="scores" label="课程成绩" align="center">
          <template slot-scope="{ row }">{{ formatScore(row.scores) }}</template>
        </el-table-column>
        <el-table-column prop="credits" label="学分" align="center"></el-table-column>
        <el-table-column prop="gradeCategory" label="成绩级别" align="center"></el-table-column>
        <el-table-column prop="isCreditCredits" label="是否参与学分绩计算" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isCreditCredits === 'Y'" type="success">是</el-tag>
            <el-tag v-else-if="scope.row.isCreditCredits === 'N'" type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="semester" label="学期" align="center"></el-table-column>
        <el-table-column label="操作列" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deleteStudentGrades(scope.row.scoresId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 备注弹窗保持不变 -->
    <el-dialog title="备注" :visible.sync="dialogremarks" top="8vh" width="80%">
      <el-form :model="addBounsForm" label-width="100px">
        <el-form-item label="理由:">
          <el-input v-model="remarks" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogremarks = false">取 消</el-button>
        <el-button v-if="this.type == 2" type="danger" @click="batchEditStatus()">驳 回</el-button>
        <el-button v-if="this.type == 4" type="danger" @click="handleEdit(2)">驳 回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  getBonusRank,
  updateBonusStatus,
  DELETEStudentGrades,
  downloadScoreChangeFile,
  auditScoreChange
} from "@/api/bonus";

export default {
  components: { Pagination },
  data() {
    return {
      Nodetype: null, // 用于判断节点类型
      queryParam: {
        nodeId: null,
        yearlyId: "",
        statusvalue: "",
        englishQualified: "", //四级
        englishAverageQualified: "", //英语平均分
        moralQualified: "", //德育分
        fail: "", //是否挂科
        isDisciplinary: "", //是否违纪
        totalPoints: "", //学生手册是否合格
        physicalMeasurements: "", //体侧是否合格
        isUpdateGrade: "", //是否更新成绩
        pageIndex: 1,
        pageSize: 20
      },
      yearName: "",
      yearId: "",
      row: "",
      parent: {},
      grandParent: {},
      listLoading: true,
      tableData: [],
      scoresList: [],
      courseColumns: [],
      dialogVisible: false,
      type: null,
      studentids: [],
      dialogtable: [],
      selectedRows: [],
      dialogParam: {
        userName: "",
        nickName: ""
      },
      addBounsForm: {},
      total: 0,
      options: [
        { value: "", label: "所有信息" },
        { value: "5", label: "申请成功" },
        { value: "4", label: "学校待审核" },
        { value: "3", label: "学院待审核" },
        { value: "2", label: "辅导员待审核" },
        { value: "1", label: "未申请" },
        { value: "0", label: "系统自动驳回" },
        { value: "-1", label: "学院驳回" },
        { value: "-2", label: "学校驳回" }
      ], //状态
      englishQualifiedoptions: [
        { value: "", label: "所有信息" },
        { value: true, label: "合格" },
        { value: false, label: "不合格" }
      ], //四级
      englishoptions: [
        { value: "", label: "所有信息" },
        { value: true, label: "合格" },
        { value: false, label: "不合格" }
      ], //英语平均分
      moralQualifioptions: [
        { value: "", label: "所有信息" },
        { value: true, label: "合格" },
        { value: false, label: "不合格" }
      ], //德育分
      failoptions: [
        { value: "", label: "所有信息" },
        { value: true, label: "有挂科" },
        { value: false, label: "未挂科" }
      ], //挂科情况
      isDisciplinaryoptions: [
        { value: "", label: "所有信息" },
        { value: false, label: "无违纪" },
        { value: true, label: "有违纪" }
      ], //违纪情况
      totalPointsoptions: [
        { value: "", label: "所有信息" },
        { value: true, label: "合格" },
        { value: false, label: "不合格" }
      ], //学生手册
      physicalMeasurementsoptions: [
        { value: "", label: "所有信息" },
        { value: true, label: "合格" },
        { value: false, label: "不合格" }
      ], //体测
      isUpdateGradeoptions: [
        { value: "", label: "所有信息" },
        { value: 0, label: "申请不通过" },
        { value: 1, label: "没有申请" },
        { value: 2, label: "申请通过" }
      ], //是否更新成绩

      remarks: "",
      dialogremarks: false,
      apiurl: process.env.VUE_APP_API
    };
  },
  created() {
    this.row = JSON.parse(this.$route.query.row);
    this.Nodetype = this.row.type;
    this.yearName = this.$route.query.bonusYearLabel;
    this.yearId = this.$route.query.bonusYearValue;
    if (this.$route.query.parent != null) {
      this.parent = JSON.parse(this.$route.query.parent);
    }
    if (this.$route.query.grandParent != null) {
      this.grandParent = JSON.parse(this.$route.query.grandParent);
    }
    this.getStudentGrades();
  },
  methods: {
    getStudentGrades() {
      this.listLoading = true;
      this.queryParam.nodeId = this.row.id;
      this.queryParam.yearlyId = this.yearId;
      getBonusRank(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list;

          //预处理图片路径
          this.tableData = res.data.list.map(item => ({
            ...item,
            _cachedImgUrl: this.extractImgUrl(item.material) // 预处理数据
          }));

          this.courseColumns = [];
          // 动态处理课程列（仅当Nodetype为C或Y时）
          const courseMap = new Map();
          this.tableData.forEach(student => {
            if (student.scoresList) {
              student.scoresList.forEach(course => {
                // 使用课程名称作为唯一标识
                if (!courseMap.has(course.courseName)) {
                  courseMap.set(course.courseName, {
                    courseName: course.courseName,
                    // 保留其他可能需要展示的字段
                    credits: course.credits,
                    gradeCategory: course.gradeCategory
                  });
                }
              });
            }
          });
          this.courseColumns = Array.from(courseMap.values());

          // 原有逻辑（取第一个学生的课程）
          if (this.tableData.length > 0) {
            const firstStudent = this.tableData[0];
            if (firstStudent.scoresList && firstStudent.scoresList.length > 0) {
              this.courseColumns = firstStudent.scoresList;
            }
          }

          this.total = Number(res.data.total) || 0;
          this.listLoading = false;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handlelist(row) {
      this.dialogtable = row.scoresList;
      this.dialogParam = {
        userName: row.userName,
        nickName: row.nickName
      };
      this.dialogVisible = true;
    },

    //审批通过
    handleEditStatus(row) {
      const status = true;
      const ids = [row.annuPrizeApplyId];
      const remark = "";
      updateBonusStatus({ ids, status, remark }).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功");
          this.getStudentGrades();
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //打开备注框
    openDialog(row, type) {
      this.type = type;
      this.ids = [row.annuPrizeApplyId];
      this.dialogremarks = true;
    },

    // 批量审批
    handleEdit(type) {
      const status = type === 1 ? true : false;
      const remark = this.remarks;
      const ids = this.ids;
      if (remark === "") {
        this.$message.warning("请输入备注");
        return;
      }
      updateBonusStatus({ ids, status, remark }).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功");
          this.getStudentGrades();
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
      this.dialogremarks = false;
      this.remarks = "";
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    openbatchDialog(type) {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请先选择要操作的数据");
        return;
      }
      this.type = type;
      this.dialogremarks = true;
    },
    //批量拒绝   1：通过  2：拒绝
    batchEditStatus(type) {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请先选择要操作的数据");
        return;
      }
      const ids = this.selectedRows.map(row => row.annuPrizeApplyId);
      const status = type === 1 ? true : false;
      const remark = this.remarks;
      updateBonusStatus({ ids, status, remark }).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功");
          this.getStudentGrades();
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
      this.remarks = "";
    },

    //审核学生申请修改成绩
    audit(row, action) {
      const data = {
        annuPrizeApplyId: row.annuPrizeApplyId,
        action: action
      };
      auditScoreChange(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.getStudentGrades();
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //根据成绩id删除学生成绩
    deleteStudentGrades(id) {
      DELETEStudentGrades(id).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功");
          this.getStudentGrades();
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //下载学生申请修改成绩材料
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
            `${row.nickName}_修改成绩证明材料.${this.getFileType(res)}`;

          link.href = url;
          link.setAttribute("download", fileName); // 修改文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.$message.success("下载成功");
        })
        .catch(error => {
          console.error("请求失败:", error);
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
    //格式化分数
    getCourseScore(scoresList, courseName) {
      if (!scoresList) return "-";
      const course = scoresList.find(item => item.courseName === courseName);
      return course ? course.scores : "-";
    },
    //格式化分数
    formatScore(score) {
      if (score === "" || score === undefined) {
        return "-";
      }
      return score;
    },
    //格式化违纪情况说明
    formatDiscipline(discipline) {
      if (discipline === "" || discipline === undefined) {
        return "-";
      }
      return discipline;
    },

    //格式化备注
    formatRemark(remark) {
      // 如果remark为空，直接返回"-"
      if (!remark) return "-";

      try {
        // 尝试解析JSON字符串
        const remarkObj = JSON.parse(remark);
        let formattedRemark = "";
        let isFirst = true; // 用于判断是否是第一个备注项

        // 检查辅导员备注是否存在
        if (remarkObj.teacher) {
          if (!isFirst) {
            formattedRemark += "\n"; // 如果不是第一个，添加换行符
          }
          formattedRemark += `辅导员：${remarkObj.teacher}`;
          isFirst = false; // 标记已经添加了第一个备注项
        }

        // 检查学院备注是否存在
        if (remarkObj.college) {
          if (!isFirst) {
            formattedRemark += "\n"; // 如果不是第一个，添加换行符
          }
          formattedRemark += `学院备注：${remarkObj.college}`;
          isFirst = false; // 标记已经添加了第一个备注项
        }

        // 检查学校备注是否存在
        if (remarkObj.admin) {
          if (!isFirst) {
            formattedRemark += "\n"; // 如果不是第一个，添加换行符
          }
          formattedRemark += `学校备注：${remarkObj.admin}`;
          isFirst = false; // 标记已经添加了第一个备注项
        }

        // 如果没有任何备注，返回"-"
        return formattedRemark || "-";
      } catch (error) {
        // 如果解析失败，返回原始remark
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
    //重置列表
    resetForm() {
      console.log(this.Nodetype == "C");
      if (this.Nodetype === "Y" || this.Nodetype == "C") {
        this.queryParam = {
          pageSize: 200
        };
      } else {
        this.queryParam = {
          pageSize: 20
        };
      }
      this.queryParam = {
        statusvalue: "", //状态
        englishQualified: "", //四级
        englishAverageQualified: "", //英语平均分
        moralQualified: "", //德育分
        fail: "", //是否挂科
        isDisciplinary: "", //是否违纪
        totalPoints: "", //学生手册是否合格
        physicalMeasurements: "", //体侧是否合格
        isUpdateGrade: "" //是否更新了成绩
      };
      this.getStudentGrades();
    },
    // 获取explain的值
    getExplain(material) {
      if (!material) return "-"; // 如果material为空，返回"-"
      try {
        const materialObj = JSON.parse(material);
        return materialObj.explain || "-"; // 如果explain不存在，返回"-"
      } catch (error) {
        console.error("解析material失败：", error);
        return "-"; // 解析失败时返回"-"
      }
    },
    getimgUrls(material) {
      if (!material) return "-"; // 如果material为空，返回"-"
      try {
        const materialObj = JSON.parse(material);
        return materialObj.imgUrls || "-"; // 如果explain不存在，返回"-"
      } catch (error) {
        console.error("解析material失败：", error);
        return "-"; // 解析失败时返回"-"
      }
    },
    // 获取imgUrls的值
    extractImgUrl(material) {
      try {
        const parsed = JSON.parse(material);
        console.log(parsed);
        return (parsed.imgUrls && parsed.imgUrls[0]) || "";
      } catch {
        return "";
      }
    }
  },
  computed: {
    hasCourses() {
      return this.courseColumns.length > 0;
    }
  }
};
</script>

<style>
.Bonus .link-left {
  margin: 0 10px;
}
.Bonus h3 {
  margin: 0;
}
.Bonus .pagination-container {
  padding-bottom: 40px;
  float: left;
}

/* 高亮样式 */
.highlight {
  background-color: #f0f9eb;
  color: #67c23a;
  font-weight: bold;
}
</style>