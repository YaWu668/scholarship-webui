import service from '../utils/axios'

// 获取考试列表
export function getExamList(data) {
    return service({
        url: '/exam/admin/queryYear',
        method: 'get',
        params: {
            pageNo: data.pageIndex,//当前页面
            pageSize: data.pageSize,//每页显示条数
        }
    })
}

//根据信息查询考试信息
export function getExamListByinfo(data) {
    return service({
        url: '/exam/admin/queryYear',
        method: 'get',
        params: {
            yearTypeName: data.yearTypeName,//年度名称
            pageNo: data.pageIndex,//当前页面
            pageSize: data.pageSize,//每页显示条数
        }
    })
}

//创建试卷
export function createPaper(data) {
    return service({
        url: '/exam/admin/createYear',
        method: 'post',
        data: {
            yearTypeName: data.yearTypeName,
            beginTime: data.beginTime,
            endTime: data.endTime
        }
    }).catch(error => {
        console.error('Error creating paper:', error);
        throw error; // 重新抛出错误以便调用者可以处理
    });
}

//根据id修改年度信息
export function updatePaper(data) {
    return service({
        url: '/exam/admin/updateYear',
        method: 'put',
        data: {
            yearTypeId: data.yearTypeId,
            yearTypeName: data.yearTypeName,
            beginTime: data.beginTime,
            endTime: data.endTime
        }
    })
}

//根据id删除年度信息
export function deletePaper(id) {
    return service({
        url: `/exam/admin/deleteYear` + `/${id}`,
        method: 'delete',
    })
}

//获取考试资格列表
export function getEligibilityList(data) {
    return service({
        url: '/exam/admin/getExamEligibilityList',
        method: 'get',
        params: {
            pageNo: data.pageIndex,//当前页面
            pageSize: data.pageSize,//每页显示条数
        }
    })
}

//根据年度表的名字获取考试资格列表
export function getEligibilityListByinfo(data) {
    return service({
        url: '/exam/admin/getExamEligibilityList',
        method: 'get',
        params: {
            yearTypeName: data.yearTypeName,//年度名称
            nickName: data.nickName,//考生昵称
            pageNo: 1,//当前页面
            pageSize: 10,//每页显示条数
        }
    })
}

//根据用id和年度id添加考试资格
export function addEligibility(data) {
    return service({
        url: '/exam/admin/addExamEligibility',
        method: 'post',
        data: {
            userName: data.userName,
            yearTypeId: data.yearTypeId,
        }
    })
}

//考试资格id删除考试资格
export function deleteEligibility(id) {
    return service({
        url: `/exam/admin/deleteExamEligibility` + `/${id}`,
        method: 'delete'
    })
}


//获取学生历史考试列表
export function getStudentExamList(data) {
    return service({
        url: '/exam/public/getTestPaperPage',
        method: 'get',
        params: {
            role: data.role,//管理角色
            pageNo: data.pageIndex,//当前页面
            pageSize: data.pageSize,//每页显示条数
            yearTypeId: data.yearTypeId,
            nickName: data.nickName,
            userName: data.userName,
            isPass: data.isPass
        }
    })
}

//获取批量导入考试资格模板
export function getEligibilityTemplate() {
    return service({
        url: '/exam/admin/getExamEligibilityTemplate',
        method: 'get',
        responseType: 'blob'
    })
}

//批量导入考试资格
export function importEligibility(formData) {
    return service({
        url: '/exam/admin/importExamEligibility',
        method: 'post',
        data: formData,
    })
}


//根据成绩表id删除学生成绩
export function deleteStudentExam(id) {
    return service({
        url: `/exam/school/deleteScoreById`,
        method: 'delete',
        params: {
            id: id
        }
    })
}







