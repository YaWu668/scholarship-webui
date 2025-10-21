import Vue from 'vue'
import Router from 'vue-router'
import Applybg from './layout/Applybg.vue'
import userinfo from './views/user-info/index.vue'

Vue.use(Router)
const router = new Router({
  routes: [
    { path: '/login', name: 'Login', component: () => import('@/views/login/login'), meta: { title: '登录' } },
    {
      path: '/IndexPage', name: 'IndexPage', component: () => import('@/views/dashboard/IndexPage'), meta: { title: '首页' },
      children: [
        { path: '/index', name: 'Home', component: () => import('@/views/dashboard/Home'), meta: { title: '首页' } },
        {
          path: '/classroom', name: 'Classroom', component: () => import('@/views/xk-class/classroom'), children: [
            { path: 'test', name: 'Test', component: () => import('@/views/xk-class/test'), meta: { title: '题库练习' } },
            { path: 'exam', name: 'Exam', component: () => import('@/views/xk-class/exam'), meta: { title: '考试中心' } },
            { path: "ExmaRecord", name: "ExmaRecord", component: () => import("@/views/user-info/exmaRecord"), meta: { title: "考试记录" } },
          ]
        },
        {
          path: '/Bonus', name: 'Bonus', component: () => import('@/views/xk-bonus/Bonus'), children: [
            { path: 'BonusApply', name: 'BonusApply', component: () => import('@/views/xk-bonus/BonusApply'), meta: { title: '奖学金申请' } },
          ]
        },

        {
          path: '/Credit', name: 'Credit', component: () => import('@/views/xk-credit/Credit'), children: [
            { path: 'CreditApply', name: 'CreditApply', component: () => import('@/views/xk-credit/CreditApply'), meta: { title: '学分申请' } },

          ]
        }
      ]
    },
    {
      path: '/ApplyChangeGrades',
      name: 'ApplyChangeGrades',
      component: Applybg,
      meta: { title: '申请修改成绩' },
      children: [
        {
          path: '',
          component: () => import('@/views/xk-bonus/ApplyChangeGrades'),
          name: 'ApplyChangeGrades',
          meta: { title: '申请修改成绩' }
        },

      ]
    },
    {
      path: '/toBonus',
      name: 'ToBonus',
      component: Applybg,
      meta: { title: '奖学金申请详情' },
      children: [
        { path: '', component: () => import('@/views/xk-bonus/toBonus'), name: 'ToBonus', meta: { title: '奖学金申请详情' } },
      ]
    },
    {
      path: '/toCredit',
      name: 'toCredit',
      component: Applybg,
      meta: { title: '学分认定详情' },
      children: [
        { path: '', component: () => import('@/views/xk-credit/toCredit'), name: 'toCredit', meta: { title: '学分认定详情' } }
      ]
    },
    {
      path: '/',
      redirect: '/login',
      children: [
        {
          path: 'index',
          component: () => import('@/views/login/login'),
          name: 'Dashboard',
          meta: { title: '登录页' }
        },

      ]
    },
    {
      path: '/userinfo',
      component: Applybg,
      children: [
        {
          path: '',
          component: () => import('@/views/user-info/index'),
          name: 'UserInfo',
          meta: { title: '个人中心' }
        }
      ]
    },
    {
      path: '/Record',
      component: userinfo,
      children: [
        { path: 'CreditRecord', name: 'CreditRecord', component: () => import('@/views/xk-credit/CreditRecord'), meta: { title: '学分认定记录' } },
        { path: 'BonusRecord', name: 'BonusRecord', component: () => import('@/views/xk-bonus/BonusRecord'), meta: { title: '学金申请记录' } },

        { path: 'MyCredit', name: 'MyCredit', component: () => import('@/views/xk-credit/MyCredit'), meta: { title: '我的学分' } }
      ]
    },
    { path: '/ExamDestail', name: "ExamDestail", component: () => import("@/views/user-info/examDestail"), meta: { title: "考试详情" } },
    { path: '/doexme', name: 'doexme', component: () => import('@/views/exam/paper/doexme'), meta: { title: '试卷答题' } },
    {
      path: '/dotest',
      name: 'DoTest',
      component: Applybg,
      meta: { title: '题库练习' },
      children: [
        { path: '', name: 'dotest', component: () => import('@/views/exam/paper/dotest'), meta: { title: '题库练习' } },
      ]
    },
    { path: '/enInfo', name: 'EnInfo', component: Applybg, meta: { title: '确认测试信息' }, children: [{ path: '', component: () => import('@/views/xk-class/enInfo'), name: 'EnInfo', meta: { title: '确认测试信息' } }] },

    {
      path: '*', component: () => import('@/views/error-page/404'), meta: { title: '404' }
    }
  ]
})




export { router }
