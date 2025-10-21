// router.js
import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs'

Vue.use(Router)

const constantRoutes = [
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       component: () => import('@/views/redirect/index'),
  //     },
  //   ],
  // },
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () => import('@/views/login/index'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/login', // 项目启动重定向到登录页面
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '主页', icon: 'home', affix: true },
      },
    ],
  },
  //用户管理
  {
    path: '/user',
    component: Layout,
    name: 'UserPage',
    meta: {
      title: '用户管理',
      icon: 'users',
      roles: ['admin'] // 只有admin角色可以访问
    },
    children: [
      {
        path: 'student/list',
        component: () => import('@/views/user/student/list'),
        name: 'UserStudentPageList',
        meta: { title: '用户列表', noCache: true, roles: ['admin'] }
      },
      {
        path: 'student/edit',
        component: () => import('@/views/user/student/edit'),
        name: 'UserStudentEdit',
        meta: { title: '用户编辑', noCache: true, activeMenu: '/user/student/list', roles: ['admin'] },
        hidden: true
      },
      {
        path: 'role/list',
        component: () => import('@/views/user/role/list'),
        name: 'UserAdminPageList',
        meta: { title: '角色列表', noCache: true, roles: ['admin'] }
      },
      {
        path: 'role/edit',
        component: () => import('@/views/user/role/edit'),
        name: 'UserAdminEdit',
        meta: { title: '角色编辑', noCache: true, activeMenu: '/user/role/list', roles: ['admin'] },
        hidden: true
      },
      // {
      //   path: 'role/permissions',
      //   component: () => import('@/views/user/role/permissions'),
      //   name: 'UserAdminEdit',
      //   meta: { title: '权限设置', noCache: true, activeMenu: '/user/role/list', roles: ['admin'] },
      //   hidden: true
      // },
      // {
      //   path: 'role/permissionslist',
      //   component: () => import('@/views/user/role/permissionslist'),
      //   name: 'UserAdminEdit',
      //   meta: { title: '权限列表', noCache: true, activeMenu: '/user/role/list', roles: ['admin'] },
      // }
    ]
  },
  // 学院管理
  {
    path: '/college',
    component: Layout,
    name: 'CollegePage',
    meta: {
      title: '学院管理',
      icon: 'peoples',
      roles: ['admin','collegeAdmin','teacher']
    },
    children: [
      {
        path: 'class/list',
        component: () => import('@/views/user/class/list'),
        name: 'StudentclassList',
        meta: { title: '学院结构列表', noCache: true, roles: ['admin','collegeAdmin','teacher'] }
      },
      {
        path: 'class/edit',
        component: () => import('@/views/user/class/edit'),
        name: 'StudentclassEdit',
        meta: { title: '学院结构结点编辑', noCache: true, activeMenu: '/class/list', roles: ['admin','collegeAdmin','teacher'] },
        hidden: true
      },
      {
        path: 'class/add',
        component: () => import('@/views/user/class/add'),
        name: 'StudentclassAdd',
        meta: { title: '用户绑定组织', noCache: true, activeMenu: '/class/list', roles: ['admin','collegeAdmin','teacher'] },
        hidden: true
      }
    ]
  },
  // 奖学金管理
  {
    path: '/bonus',
    component: Layout,
    name: 'Bonus',
    meta: {
      title: '奖学金管理',
      icon: 'Awards',
      roles: ['admin','collegeAdmin', 'teacher'] // admin和teacher角色都可以访问
    },
    children: [
      {
        path: 'BonusList',
        component: () => import('@/views/application/Bonus/list'),
        name: 'BonusList',
        meta: { title: '奖学金学年管理', noCache: true, roles: ['admin','collegeAdmin','teacher'] }
      },
      {
        path: 'BonusStudentList',
        component: () => import('@/views/application/Bonus/BonusStudentList'),
        name: 'BonusStudentList',
        meta: { title: '评奖人数管理', noCache: true, roles: ['admin','collegeAdmin','teacher'] },
      },
      {
        path: 'edit',
        component: () => import('@/views/application/Bonus/edit'),
        name: 'BonusEdit',
        meta: { title: '奖学金编辑', noCache: true, roles: ['admin','collegeAdmin','teacher']},
        hidden: true
      },
      {
        path: 'import',
        component: () => import('@/views/application/Bonus/import'),
        name: 'StudentGradesImport',
        meta: { title: '导入学生成绩', noCache: true, roles: ['admin','collegeAdmin', 'teacher'] },
        hidden: true
      },
      {
        path: 'StudengtGradesList',
        component: () => import('@/views/application/Bonus/StudentGradeslist'),
        name: 'StudengtGradesList',
        meta: { title: '学生排名成绩列表', noCache: true, roles: ['admin','collegeAdmin','teacher'] },
        hidden: true
      }
    ]
  },
  //学生考试信息管理
  {
    path: '/education',
    component: Layout,
    name: 'EducationPage',
    meta: {
      title: '学生考试管理',
      icon: 'education',
      roles: ['admin','collegeAdmin', 'teacher'] // admin和teacher角色都可以访问
    },
    alwaysShow: true,
    children: [
      {
        path: 'paper/list',
        component: () => import('@/views/exam/paper/list'),
        name: 'ExamPaperPageList',
        meta: { title: '学生手册年度列表', noCache: true, roles: ['admin','collegeAdmin','teacher'] }
      },
      {
        path: 'paper/edit',
        component: () => import('@/views/exam/paper/edit'),
        name: 'ExamPaperEdit',
        meta: { title: '学生手册年度编辑', noCache: true, activeMenu: '/exam/paper/list', roles: ['admin','collegeAdmin','teacher'] },
        hidden: true
      },
      {
        path: 'subject/list',
        component: () => import('@/views/education/subject/list'),
        name: 'EducationSubjectPage',
        meta: { title: '学生考试成绩列表', noCache: true, roles: ['admin','collegeAdmin','teacher'] }
      },
      {
        path: 'EligibilityList/list',
        component: () => import('@/views/education/EligibilityList/list'),
        name: 'EligibilityList',
        meta: { title: '学生考试资格列表', noCache: true, roles: ['admin','collegeAdmin','teacher'] }
      },
      {
        path: 'EligibilityList/edit',
        component: () => import('@/views/education/EligibilityList/edit'),
        name: 'EligibilityEditPage',
        meta: { title: '学生考试资格编辑', noCache: true, roles: ['admin','collegeAdmin','teacher'] },
        hidden: true
      }, {
        path: 'EligibilityList/add',
        component: () => import('@/views/education/EligibilityList/add'),
        name: 'EligibilityEditPage',
        meta: { title: '批量导入学生考试资格', noCache: true, roles: ['admin','collegeAdmin','teacher'] },
        hidden: true
      }
    ]
  },
  //试卷管理
  {
    path: '/exam',
    component: Layout,
    name: 'ExamPage',
    meta: {
      title: '卷题管理',
      icon: 'exam',
      roles: ['admin'] // 只有admin角色可以访问
    },
    children: [
      {
        path: 'question/list',
        component: () => import('@/views/exam/question/list'),
        name: 'ExamQuestionPageList',
        meta: { title: '题目列表', noCache: true, roles: ['admin'] }
      },
    ]
  },
  //系统参数设置
  {
    path: '/config',
    component: Layout,
    name: 'systemPage',
    meta: {
      title: '系统参数设置',
      icon: 'setting',
      roles: ['admin'] // 只有admin角色可以访问
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/system/list'),
        name: 'ConfigPageList',
        meta: { title: '系统参数列表', noCache: true, roles: ['admin'] }
      },
      {
        path: 'edit',
        component: () => import('@/views/system/edit'),
        name: 'ConfigEdit',
        meta: { title: '系统参数编辑', noCache: true, activeMenu: 'config/list', roles: ['admin'] },
        hidden: true
      },
    ]
  },
  //在线用户
  {
    path: '/online',
    component: Layout,
    name: 'OnlinePage',
    meta: {
      title: '在线用户',
      icon: 'people',
      roles: ['admin'] // 只有admin角色可以访问
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/online/list'),
        name: 'OnlineList',
        meta: { title: '在线用户列表', noCache: true, roles: ['admin'] }
      }
    ]
  },
  {
    path: '*',
    hidden: true,
    component: () => import('@/views/error-page/404'),
    meta: { title: '404', noCache: true }
  }
]

const router = new Router({
  routes: constantRoutes
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 检查用户是否登录（根据实际项目获取登录状态）
  const isAuthenticated = localStorage.getItem('user_token'); // 示例：从 localStorage 获取 token

  // 处理未登录用户访问需要权限的页面
  if (to.path !== '/login' && !isAuthenticated) {
    Vue.prototype.$message.warning('请先登录！');
    return next('/login'); // 重定向到登录页面
  }

  // 检查令牌是否过期
  if (isAuthenticated) {
    try {
      // 解码JWT（关键修正点）
      const decoded = jwtDecode(isAuthenticated) // 直接调用函数

      // 检查过期时间（修正时间处理）
      const isExpired = dayjs().isAfter(dayjs.unix(decoded.exp))

      if (isExpired) {
        handleLogout()
        return next('/login')
      }
    } catch (error) {
      console.error('Token解析错误:', error)
      handleLogout()
      return next('/login')
    }
  }

  // 继续导航
  next();
});

// 封装登出逻辑
function handleLogout() {
  Vue.prototype.$message.error('登录状态无效，请重新登录！')
  localStorage.removeItem("user_token")
  localStorage.removeItem("user_role")
}

export {
  constantRoutes,
  router
}