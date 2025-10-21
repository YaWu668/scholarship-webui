<template>
  <!-- 容器div，用于包含整个页面的内容 -->
  <div class="app-container bonus-student-list">
    <!-- 创建一个表单，用于输入查询参数 -->
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <!-- 申请奖项下拉选择框 -->
      <el-form-item label="奖项年度：">
        <el-select v-model="value" filterable placeholder="请选择" @change="handleYearChange">
          <!-- 遍历options数组，生成下拉选项 -->
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 表格，用于展示学生数据 -->
    <el-table
      v-loading="Traaloading"
      :data="tableData"
      :default-expand-all="false"
      :tree-props="{ children: 'children' }"
      row-key="id"
    >
      <!-- 名称列 -->
      <el-table-column prop="label" label="名称" width="230px"></el-table-column>

      <!-- 类型列，使用插槽自定义显示 -->
      <el-table-column align="center" prop="type" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 'C'">学院</el-tag>
          <el-tag v-if="scope.row.type === 'Y'" type="success">年级</el-tag>
          <el-tag v-if="scope.row.type === 'M'" type="warning">专业</el-tag>
          <el-tag v-if="scope.row.type === 'G'" type="info">班级</el-tag>
        </template>
      </el-table-column>

      <!-- 学生人数列 -->
      <el-table-column align="center" label="学生人数">
        <template slot-scope="scope">
          <!-- 当类型为Y时显示"-"，否则显示具体数值 -->
          <span v-if="scope.row.type === 'Y'">-</span>
          <span v-else>{{ scope.row.total || 0 }}</span>
        </template>
      </el-table-column>

      <!-- 获奖名额列，动态显示 -->
      <el-table-column align="center" label="人工设定名额">
        <template slot-scope="scope">
          <!-- 当类型为Y时显示"-"，否则显示具体数值 -->
          <span v-if="scope.row.type === 'Y'">-</span>
          <span v-else>{{ scope.row.winningTotal || 0 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="系统计算名额">
        <template slot-scope="scope">
          <!-- 当类型为Y时显示"-"，否则显示具体数值 -->
          <span v-if="scope.row.type === 'Y'">-</span>
          <span v-else>{{ scope.row.countWinningTotal || 0 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="总获奖人数使用数量">
        <template slot-scope="scope">
          <!-- 当类型为Y时显示"-"，否则显示具体数值 -->
          <span v-if="scope.row.type === 'Y'">-</span>
          <span v-else>{{ scope.row.useWinningTotal || 0 }}</span>
        </template>
      </el-table-column>

      <!-- 特等奖名额列，动态显示 -->
      <el-table-column align="center" label="特等奖名额">
        <template slot-scope="scope">
          <!-- 当类型为Y时显示"-"，否则根据类型显示数值 -->
          <span v-if="scope.row.type === 'Y'">-</span>
          <span v-else-if="scope.row.type === 'M'">{{ scope.row.grandPrize || 0 }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 一等奖名额列，动态显示 -->
      <el-table-column align="center" label="一等奖名额">
        <template slot-scope="scope">
          <!-- 当类型为Y时显示"-"，否则根据类型显示数值 -->
          <span v-if="scope.row.type === 'Y'">-</span>
          <span v-else-if="scope.row.type === 'M'">{{ scope.row.firstPrize || 0 }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 二等奖名额列，动态显示 -->
      <el-table-column align="center" label="二等奖名额">
        <template slot-scope="scope">
          <!-- 当类型为Y时显示"-"，否则根据类型显示数值 -->
          <span v-if="scope.row.type === 'Y'">-</span>
          <span v-else-if="scope.row.type === 'M'">{{ scope.row.secondPrize || 0 }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 三等奖名额列，动态显示 -->
      <el-table-column align="center" label="三等奖名额">
        <template slot-scope="scope">
          <!-- 当类型为Y时显示"-"，否则根据类型显示数值 -->
          <span v-if="scope.row.type === 'Y'">-</span>
          <span v-else-if="scope.row.type === 'M'">{{ scope.row.thirdPrize || 0 }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 操作列，使用插槽自定义显示 -->
      <el-table-column align="center" label="操作" width="370px">
        <template slot-scope="{row}">
          <el-button
            v-if="row.type === 'C' || row.type === 'M'"
            class="link-right"
            size="mini"
            type="primary"
            @click="openSetBounsDialog(row)"
          >设置评奖人数</el-button>
          <el-button
            v-if="row.type === 'M'"
            class="link-right"
            size="mini"
            type="success"
            @click="exportStudent(row)"
          >导出评奖通过名单</el-button>
          <router-link
            :to="{
              path: '/bonus/StudengtGradesList',
              query: {
                row: JSON.stringify(row),
                bonusYearLabel: valueLabel,
                bonusYearValue: value,
                parent: JSON.stringify(getParent(row)),
                grandParent: JSON.stringify(getGrandParent(row))
              }
            }"
          >
            <el-button type="primary" size="mini">人员列表</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 设置评奖人数弹窗 -->
    <el-dialog title="设置评奖人数" :visible.sync="SetBounsDialog" width="30%">
      <el-form :model="setBounsForm" label-width="80px">
        <el-form-item label="学院名称">
          <el-input v-model="setBounsForm.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="人数">
          <el-input v-model="setBounsForm.winningTotal"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="SetBounsDialog = false">取 消</el-button>
        <el-button type="primary" @click="setBouns()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入所需的辅助函数和组件
import Pagination from "@/components/Pagination";
import {
  getBonusYear,
  getBonusTree,
  getBonusNumber,
  setBonusNumber,
  exportBonusStudents
} from "@/api/bonus";

// 定义Vue组件
export default {
  components: { Pagination },
  data() {
    return {
      // 定义查询参数
      queryParam: {
        userName: "",
        annuPrizeId: null,
        role: 1,
        pageIndex: 1,
        pageSize: 10
      },
      Traaloading: true, // 表格加载状态
      tableData: [], // 表格结构树数据
      dialogVisible: false,
      dialogform: {}, //人数弹窗数据
      SetBounsDialog: false, //设置评奖人数弹窗
      setBounsForm: { name: "", annuHeadCountId: null, winningTotal: null },
      total: 0, // 总数据条目数初始化为0，确保是数字类型
      options: [], // 奖项枚举
      value: "", // 当前选中的奖项年度的value
      valueLabel: "" // 当前选中的奖项年度的label
    };
  },
  // 组件创建后执行的方法
  created() {
    // 获取评奖年度数据，用于填充奖项下拉选择框
    this.getBonusYear();
  },
  methods: {
    // 当奖项年度发生变化时，重新调用search方法
    handleYearChange() {
      // 如果value为空，不执行查询
      if (!this.value) {
        this.$message.error("该奖项年度下没有数据，请重新选择奖项年度");
        return;
      }
      this.valueLabel = this.options.find(option => option.value === this.value).label;
      // 调用search方法，重新查询数据
      this.search();
    },

    // 查询学生数据的方法
    search() {
      // 调用API获取树形数据
      this.queryParam.annuPrizeId = this.value;
      getBonusTree(this.queryParam).then(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          // 确保total是数字类型
          this.total = Number(res.total) || 0;
          this.Traaloading = false;

          // 获取每个节点的获奖名额（排除类型为Y的节点）
          this.fetchWinningNumbersForAllNodes();
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 获取评奖年度数据，用于填充奖项下拉选择框
    getBonusYear() {
      const data = {
        pageIndex: 1,
        pageSize: 1000
      };
      getBonusYear(data).then(res => {
        if (res.code === 200) {
          // 将后端返回的数据中的annuPrizeName绑定到options的label，annuPrizeId绑定到value
          this.options = res.data.list.map(item => {
            return {
              value: item.annuPrizeId,
              label: item.annuPrizeName // 假设后端返回的奖项名称是annuPrizeName
            };
          });
          // 默认选中第一项
          if (this.options.length > 0) {
            this.value = this.options[0].value;
            this.valueLabel = this.options[0].label; // 获取默认选中的label
          }
          this.search(); // 调用查询方法
        }
      });
    },

    // 获取每个节点的获奖名额（排除类型为Y的节点）
    fetchWinningNumbersForAllNodes() {
      /**
       * 递归遍历树节点的新方法
       * 特点：跳过Y类型节点但继续遍历其子节点
       * @param {Array} nodes 当前层节点数组
       */
      const deepTraverse = nodes => {
        nodes.forEach(node => {
          // 只处理非Y类型节点
          if (node.type !== "Y") {
            this.fetchNodeData(node); // 获取节点数据
          }

          // 关键逻辑：无论当前节点类型，都继续遍历子节点
          if (node.children && node.children.length > 0) {
            deepTraverse(node.children);
          }
        });
      };

      // 从根节点开始遍历
      deepTraverse(this.tableData);
    },

    // 修改后的数据获取方法
    async fetchNodeData(node) {
      // 防御性判断
      if (node.type === "Y") return;

      try {
        const { code, data } = await getBonusNumber({
          nodeId: node.id,
          yearlyId: this.value
        });

        if (code === 200) {
          // 精确字段映射（根据接口返回结构调整）
          Object.assign(node, {
            annuHeadCountId: data.annuHeadCountId,
            total: data.total || 0, // 学生人数
            winningTotal: data.winningTotal || 0, // 人工设定名额
            countWinningTotal: data.countWinningTotal || 0, // 系统计算名额
            useWinningTotal: data.useWinningTotal || 0,
            grandPrize: data.grandPrize || 0, // 特等奖
            firstPrize: data.firstPrize || 0, // 一等奖
            secondPrize: data.secondPrize || 0, // 二等奖
            thirdPrize: data.thirdPrize || 0 // 三等奖
          });
          this.$forceUpdate(); // 强制更新视图
        }
      } catch (error) {
        this.$message.error(`数据获取失败: ${error.message}`);
      }
    },

    // 递归获取节点的获奖名额
    fetchWinningNumbers(node) {
      // 如果节点类型是Y，直接返回，不调用API
      if (node.type === "Y") {
        return;
      }

      // 如果节点有子节点，递归处理子节点
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          if (child.type !== "Y") {
            this.fetchWinningNumbers(child);
          }
        });
      }

      // 调用API获取当前节点的获奖名额
      const data = {
        nodeId: node.id,
        yearlyId: this.value
      };
      getBonusNumber(data).then(res => {
        if (res.code === 200) {
          // 将获奖名额数据绑定到节点
          node.total = res.data.total;
          node.winningTotal = res.data.countWinningTotal;
          node.grandPrize = res.data.grandPrize;
          node.firstPrize = res.data.firstPrize;
          node.secondPrize = res.data.secondPrize;
          node.thirdPrize = res.data.thirdPrize;
          console.log(this.tableData);
          // 更新表格数据，确保数据绑定到页面上
          this.$forceUpdate();
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 查看名额的方法
    handlelist(row) {
      const data = {
        nodeId: row.id,
        yearlyId: this.value
      };
      getBonusNumber(data).then(res => {
        if (res.code === 200) {
          this.dialogform = res.data;
          console.log(this.dialogform);
          this.dialogVisible = true;
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 递归查找父节点
    getParent(row) {
      // 遍历表格数据，查找当前行的父节点
      for (let item of this.tableData) {
        if (item.children && item.children.includes(row)) {
          return item;
        }
        if (item.children) {
          const parent = this.findParent(item.children, row);
          if (parent) {
            return parent;
          }
        }
      }
      return null;
    },
    // 递归查找父节点的辅助方法
    findParent(children, row) {
      for (let child of children) {
        if (child.children && child.children.includes(row)) {
          return child;
        }
        if (child.children) {
          const parent = this.findParent(child.children, row);
          if (parent) {
            return parent;
          }
        }
      }
      return null;
    },
    // 递归查找父节点的父节点
    getGrandParent(row) {
      const parent = this.getParent(row);
      if (parent) {
        return this.getParent(parent);
      }
      return null;
    },
    //打开设置评奖人数弹窗
    openSetBounsDialog(row) {
      console.log(row);
      this.setBounsForm.annuHeadCountId = row.annuHeadCountId;
      this.setBounsForm.name = row.label;
      this.SetBounsDialog = true;
    },
    //设置评奖人数
    setBouns() {
      setBonusNumber(this.setBounsForm).then(res => {
        if (res.code === 200) {
          this.$message.success("设置成功");
          this.SetBounsDialog = false;
          this.search();
        } else if (res.code === 500) {
          this.$message.error(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //导出评奖通过的学生名单
    // 导出评奖通过的学生名单
    async exportStudent(row) {
      const data = { nodeId: row.id, yearlyId: this.value };

      // 获取祖父级的label
      const grandParent = this.getGrandParent(row);
      const grandParentLabel = grandParent ? grandParent.label : "";

      // 获取父级的label
      const parent = this.getParent(row);
      const parentLabel = parent ? parent.label : "";

      // 获取当前行的label
      const currentLabel = row.label;

      // 构建文件名
      const fileName = `${this.valueLabel}-${grandParentLabel}-${parentLabel}-${currentLabel}-获奖名单.xlsx`;

      try {
        const res = await exportBonusStudents(data);

        // 创建Blob对象处理二进制数据
        const blob = new Blob([res], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        // 创建临时下载链接
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = downloadUrl;

        // 设置下载文件名
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        // 清理资源
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(link);

        this.$message.success("模板下载成功！");
      } catch (error) {
        console.error("下载失败:", error);
        this.$message.error("模板下载失败，请稍后重试");

        // 处理Blob类型的错误响应（当HTTP状态码非200时）
        if (error.response.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorData = JSON.parse(reader.result);
              this.$message.error(errorData.msg || "服务器返回错误");
            } catch (e) {
              this.$message.error("服务器返回未知错误");
            }
          };
          reader.readAsText(error.response.data);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bonus-student-list {
  .dialog-form {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
.bonus-student-list .dialog-form .el-input.is-disabled .el-input__inner {
  background-color: #fff !important;
  border-color: #fff !important;
  color: #c0c4cc !important;
}
.el-input.is-disabled .el-input__inner {
  background-color: #fff !important;
  border-color: #fff !important;
  color: #333 !important;
}
.link-right {
  margin-right: 10px;
}
</style>