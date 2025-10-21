import service from '../utils/axios'

//登录
export function login(user) {
    return service({
        url: '/auth/login',
        method: 'POST',
        data: {
            username: user.username,
            password: user.password
        }
    })
}

//获取当前登录用户
export function getUserInfo() {
    return service({
        url: '/system/user/getInfo',
        method: 'GET'
    })
}


//根据userId获取用户信息
export function getUserInfoById(id) {
    return service({
        url: '/system/user/userInfo/' + id,
        method: 'GET'
    })
}

//修改用户信息
export function updateUser(user) {
    return service({
        url: '/system/user/update/info',
        method: 'PUT',
        data: {
            id: user.id,
            nickName: user.nickName,
            email: user.email,
            phone: user.phone,
            sex: user.sex,
            avatar: user.avatar,
            deptId: user.deptId,
            phonenumber: user.phonenumber,
            status: user.status,
        }
    })
}

//重置用户密码
export function resetPassword(ids) {
    return service({
        url: '/system/user/resetPassword?ids=' + ids,
        method: 'PUT',
    })
}

//修改用户状态
export function changeStatus(user) {
    return service({
        url: '/system/user/update/status',
        method: 'PUT',
        data: {
            userId: user.userId,
            status: user.status
        }
    })
}

//查询用户列表数据
export function getUserList(form) {
    return service({
        url: '/system/user/list',
        method: 'GET',
        params: {
            userName: form.userName,
            current: form.pageIndex,
            limit: form.pageSize,
        }
    })
}

//根据用户名（学号/工号）查询用户信息
export function getUserByName(username) {
    return service({
        url: `/system/user/info/${username}`
    })
}

//设置用户权限
export function setUserRole(id, ids) {
    return service({
        url: "/system/role/roleMenu/" + id,
        method: 'PUT',
        data: ids,
    })
}


//获取导入用户模版,typeId:0获取绑定角色模版，1获取导入用户模版
export function getUserTemplate(typeId) {
    return service({
        url: '/exam/admin/getExeclTemplate',
        method: 'GET',
        params: {
            type: typeId,
        },
        responseType: 'blob'  // 关键配置：指定响应类型为二进制流
    })
}