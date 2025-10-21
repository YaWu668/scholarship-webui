<template>
  <div class="Home">
    <PageTitle :title="'首页'"></PageTitle>
    <div class="course-list">
      <CourseCrad
        v-for="item in data"
        :key="item.title"
        :title="item.title"
        :progress="item.progress"
        :buttonText="'开始练习'"
        @startLearn="startLearn()"
      />
    </div>
    <!-- <pagination v-show="total>0" :total="total" :background="false" :page.sync="queryParam.pageIndex" :limit.sync="queryParam.pageSize"
      @pagination="search" style="margin-top: 20px"/> -->
  </div>
</template>
  
<script>
import CourseCrad from "@/components/CourseCrad"
import PageTitle from "@/components/PageTitle"
import Pagination from '@/components/Pagination'
export default {
  data() {
    return {
      data: [
        { title: "学生手册", progress: 20 }
      ],
      queryParam: {
        paperType: 1,
        subjectId: 0,
        pageIndex: 1,
        pageSize: 10
      },
      total: 0
    };
  },
  created() {
    // this.search()
  },
  methods:{
  
    // search () {
    //   this.listLoading = true
    //   examPaperApi.pageList(this.queryParam).then(data => {
    //     const re = data.response
    //     this.tableData = re.list
    //     this.total = re.total
    //     this.queryParam.pageIndex = re.pageNum
    //     this.listLoading = false
    //   })
    // },
    startLearn(){
      this.$router.push('/dotest');
    }
  },
  components: {
    CourseCrad,
    PageTitle,
    Pagination
  }
};
</script>
  
<style>
.course-list{display:flex;flex-wrap: wrap;}
</style>
