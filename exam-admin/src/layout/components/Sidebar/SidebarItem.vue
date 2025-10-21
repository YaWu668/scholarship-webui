<!-- SidebarItem.vue -->
<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template
      v-if="hasOneShowingChild(children, item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{'submenu-title-noDropdown':!isNest}"
        >
          <item
            :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!-- 关键修改：遍历过滤后的children -->
      <sidebar-item
        v-for="child in children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data() {
    this.onlyOneChild = null;
    return {};
  },
  methods: {
    hasOneShowingChild(children = [], parent) { // 传入过滤后的children
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        }
        return true;
      });
      if (showingChildren.length === 1) {
        this.onlyOneChild = showingChildren[0];
        return true;
      }
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true };
        return true;
      }
      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    }
  },
  computed: {
    // 根据用户角色过滤子路由
    children() {
      const userRole = localStorage.getItem("user_role");
      return (this.item.children || []).filter(child => {
        if (child.hidden) return false; // 直接隐藏的不处理
        if (!child.meta || !child.meta.roles) return true; // 无权限配置默认显示
        return child.meta.roles.includes(userRole); // 检查角色权限
      });
    }
  }
};
</script>