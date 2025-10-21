import service from '../utils/axios'

//获取角色列表
export function getRoleList() {
    return service({
        url: '/system/role/list',
        method: 'GET',

    })
}

//新增角色数据
export function addRole(data) {
    return service({
        url: "/system/role",
        method: 'POST',
        data: {
            roleName: data.roleName,//角色名称
            roleKey: data.roleKey,//角色权限字符串
            roleSort: data.roleSort,//数据范围
            status: data.status,//状态
            remark: "",//备注
        }
    })
}

//新增角色数据
export function updataRole(data) {
    return service({
        url: "/system/role",
        method: 'PUT',
        data: {
            roleName: data.roleName,//角色名称
            roleKey: data.roleKey,//角色权限字符串
            status: data.status,//状态
            roleId: data.roleId,//角色id
            roleSort: data.roleSort,//排序
            remark: "",//备注
        }
    })
}

//删除角色数据
export function delRole(id) {
    return service({
        url: "/system/role/remove",
        method: 'DELETE',
        params: {
            ids: id
        },
    })
}

//获取权限菜单树
export function getMenuList() {
    return service({
        url: '/system/menu/getMenuTree',
        method: 'GET',
    })
}

//获取角色详细信息
export function getRoleDetail(id) {
    return service({
        url: `/system/role/${id}`,
        method: 'GET',
    })
}

//获取绑定当前角色的用户列表
export function getRoleUser(form) {
    return service({
        url: "/system/role/authUser/allocatedList/" + form.id,
        method: 'GET',
        params: {
            userName: form.userName,
            current: form.pageIndex,
            limit: form.pageSize
        },
    })
}

//为用户绑定角色
export function addlAuthUser(roleId, userIds) {
    return service({
        url: "/system/role/authUser/accredit",
        method: 'PUT',
        params: {
            roleId,
            userIds
        }
    })
}

//取消授权
export function cancelRoleUser(roleId, userIds) {
    return service({
        url: "/system/role/authUser/cancel",
        method: 'PUT',
        params: {
            roleId,
            userIds
        }
    })
}

//获取未绑定当前角色的用户列表
export function getRoleMenu(id, data) {
    return service({
        url: "/system/role/authUser/unallocatedList/" + id,
        method: 'GET',
        params: {
            current: data.pageIndex,
            limit: data.pageSize,
            userName: data.userName
        },
    })
}

//获取所有权限树
export function getAllmenu() {
    return service({
        url: "/system/menu/list",
        method: 'GET',
    })
}

//获取当前角色权限列表树
export function getRoleMenuList(id) {
    return service({
        url: '/system/role/menuPermission/' + id,
        method: 'GET',
    })
}

//设置当前角色权限
export function setRoleMenu(id, menuIds) {
    return service({
        url: "/system/role/roleMenu/" + id,//角色Id
        method: 'PUT',
        data: menuIds,//权限Id
    })
}

//新增权限数据
export function addPermission(data) {
    return service({
        url: "/system/role",
        method: 'POST',
        data: {
            menuName: data.menuName,//权限名称
            parentId: data.parentId,//父级id
            menuType: data.menuType,//类型
            status: data.status,//状态
            orderNum: data.orderNum,//排序
            component: data.component,//组件路径
            remark: ""
        }
    })
}


//修改权限数据
export function updataPermission(data) {
    return service({
        url: "/system/role",
        method: 'PUT',
        data: {
            menuName: data.menuName,//权限名称
            parentId: data.parentId,//父级id
            menuType: data.menuType,//类型
            status: data.status,//状态
            orderNum: data.orderNum,//排序
            component: data.component,//组件路径
            remark: ""
        }
    })
}

//批量导入解绑角色
export function batchUnbindRole(formData) {
    return service({
        url: "/exam/admin/importUserUnbindingRole",
        method: 'DELETE',
        data: formData,
    })
}


