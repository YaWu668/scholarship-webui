import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store'
import 'normalize.css/normalize.css'
import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import './icons' // icon
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import Treeselect from '@riophae/vue-treeselect' // 导入vue-treeselect
import '@riophae/vue-treeselect/dist/vue-treeselect.css' // 导入样式



// 引入 axios
import '@/utils/axios.js';

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

// 注册 Treeselect 组件
Vue.component('Treeselect', Treeselect);
Vue.config.productionTip = false

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  if (to.meta.title !== undefined) {
    document.title = to.meta.title
  } else {
    document.title = '\u200E'
  }
  store.commit('router/initRoutes')
  next()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

Vue.prototype.$$router = router

new Vue({
  router: router,
  store: store,
  render: h => h(App)
}).$mount('#app')
