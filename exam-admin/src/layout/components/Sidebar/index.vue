// Sidebar.vue
<template>
  <div class="has-logo">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in filteredRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/styles/variables.scss';

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'routes'
    ]),
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    filteredRoutes() {
      const userRole = localStorage.getItem("user_role"); // 获取用户角色
      return this.routes.filter(route => {
        // 如果路由没有设置 roles 字段，则默认可以访问
        if (!route.meta || !route.meta.roles) {
          return true;
        }
        // 检查用户角色是否在路由的 roles 列表中
        return route.meta.roles.includes(userRole);
      });
    }
  }
};
</script>