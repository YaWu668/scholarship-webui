import service from '../utils/axios'

//查询学院树形结构
export function getCollegeTree() {
    return service({
        url: '/exam/school/treeList',
        method: 'get',
    })
}

//根据结点id查询班级对应用户
export function getClassUserListByNode(data) {
    return service({
        url: '/exam/school/listUsersByNode',
        method: 'get',
        params: {
            nodeId: data.nodeId,//结点id
            nodeType: data.nodeType,//结点类型
            userName: data.userName,//账号
            nickName: data.nickName,//姓名
            current: data.pageIndex,//当前页面
            limit: data.pageSize,//每页显示条数
        }
    })
}

//根据账号和名字进行模糊搜索用户(针对所有在校人员)
export function getSearchUserList(data) {
    return service({
        url: '/exam/school/selectUser',
        method: 'get',
        params: {
            userName: data.userName,//账号
            nickName: data.nickName,//姓名
            current: data.pageIndex,//当前页面
            limit: data.pageSize,//每页显示条数
        }
    })
}

//查询班级列表
export function getClasslist(form) {
    return service({
        url: '/exam/admin/exportClass',
        method: 'get',
        params: {
            pageNo: form.pageIndex,//当前页面
            pageSize: form.pageSize,//每页显示条数
            sortBy: "create_time",
            isAsc: false,
            collegeVlaue: form.collegeVlaue,//学院名称
            collegeName: form.className,//班级名称
        }
    })
}

//创建学院结构树结点
export function createTreeNode(data) {
    return service({
        url: '/exam/scholarship/admin/createNode',
        method: 'post',
        data: {
            parentId: data.parentId,
            type: data.type,//结点类型，数组[C，Y]
            collegeName: data.collegeName,
        }
    })
}

//修改学院结构树结点
export function updateTreeNode(data) {
    return service({
        url: '/exam/scholarship/admin/updateNode',
        method: 'put',
        data: {
            nodeId: data.id,
            collegeName: data.collegeName,
        }
    })
}

//删除学院结构树结点
export function deleteTreeNode(nodeId) {
    return service({
        url: '/exam/scholarship/admin/deleteNode/' + nodeId,
        method: 'delete',
    })
}

//根据班级id查询老师学生列表
export function getStudentListByClassId(form) {
    return service({
        url: '/exam/admin/queryClassTeacherStudents',
        method: 'GET',
        params: {
            collegeClassId: form.collegeClassId,
            teacherUserName: form.teacherName,
            teacherPageNum: form.pageIndex,
            teacherPageSize: form.pageSize,
            studentUserName: form.studentName,
            studentPageNum: form.pageIndex,
            studentPageSize: form.pageSize,
        }
    })
}

//批量班级删除学生
export function deleteStudent(data) {
    return service({
        url: '/exam/admin/batchDeleteTeacherStudent',
        method: 'post',
        params: {
            collegeClassId: data.collegeClassId,
            userIds: data.userIds,
            isStudent: 0,
        }
    })
}

//获取批量导入组织模板
export function getTemplate() {
    return service({
        url: '/exam/school/getBatchBinding',
        method: 'get',
        responseType: 'blob'  // 关键配置：指定响应类型为二进制流
    })
}


// 批量导入学生/教师
export function importStudentAndTeacher(formData, type) {
    return service({
        url: `/exam/school/batchBinding?type=${type}`, // 将type作为URL参数
        method: 'post',
        data: formData, // 直接传递FormData对象
        // 注意：axios会自动设置multipart/form-data，无需手动指定Content-Type
        // 手动指定可能导致boundary缺失
    });
}

//传入节点id获取当前节点下面绑定学生总人
export function getStudentCountByNodeId(nodeId, nodeType) {
    return service({
        url: '/exam/school/getStudentCountByNodeId',
        method: 'get',
        params: {
            nodeId: nodeId,
            nodeType:nodeType
        }
    })
}

//获取用户绑定班级模版
export function getTemplateByUser() {
    return service({
        url: '/exam/school/getBatchBinding',
        method: 'get',
        responseType: 'blob'  // 关键配置：指定响应类型为二进制流
    })
}

//根据用户id和学院id解除学院管理员的绑定关系
export function deleteUserByUserId(data) {
    return service({
        url: '/exam/scholarship/admin/deleteInstitute',
        method: 'delete',
        params: {
            userId: data.userId,
            collegeId: data.collegeId,
        }
    })
}



