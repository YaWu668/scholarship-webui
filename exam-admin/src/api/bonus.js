import service from '../utils/axios'

//创建评奖年度
export function createBonusYear(data) {
    return service({
        url: '/exam/scholarship/admin/createAnnuPrize',
        method: 'post',
        data: {
            annuPrizeName: data.annuPrizeName,
            startTime: data.startTime,
            endTime: data.endTime,
            yearTypeId: data.yearTypeId,
            gradeLevelRequired: data.gradeLevelRequired
        }
    })
}


//获取评奖年度
export function getBonusYear(data) {
    return service({
        url: '/exam/school/getAnnuPrizeList',
        method: 'get',
        params: {
            pageNo: data.pageIndex,
            pageSize: data.pageSize,
            annuPrizeName: data.annuPrizeName,//评奖年度名称
        }
    })
}

//修改评奖年度信息
export function updateBonusYear(data) {
    return service({
        url: '/exam/scholarship/admin/updateAnnuPrize',
        method: 'put',
        data: {
            annuPrizeId: data.annuPrizeId,
            annuPrizeName: data.annuPrizeName,
            startTime: data.startTime,
            endTime: data.endTime,
        }
    })
}

//获取评奖人数结构树
export function getBonusTree(data) {
    return service({
        url: '/exam/school/getAwardsNumberNode',
        method: 'get',
        params: {
            annuPrizeId: data.annuPrizeId,
        }
    })
}

//根据专业节点和评奖年度id进行查询成绩排名
export function getBonusRank(data) {
    return service({
        url: '/exam/school/getMajorRanking',
        method: 'get',
        params: {
            pageNo: data.pageIndex,
            pageSize: data.pageSize,
            nodeId: data.nodeId,
            yearlyId: data.yearlyId,//评奖年度id
            status: data.statusvalue,//审核状态
            englishQualified: data.englishQualified,//英语四级是否通过
            englishAverageQualified: data.englishAverageQualified, //英语平均分
            moralQualified: data.moralQualified, //德育分
            fail: data.fail, //是否挂科
            isDisciplinary: data.isDisciplinary, //是否违纪
            totalPoints: data.totalPoints,//学生手册是否合格
            physicalMeasurements: data.physicalMeasurements,//体侧是否合格
            isUpdateGrade: data.isUpdateGrade,//是否更新成绩
        }
    })
}

//获取评奖年度名额
export function getBonusNumber(data) {
    return service({
        url: '/exam/school/selecyYearlyNumberByNodeIdAndYearlyId',
        method: 'get',
        params: {
            nodeId: data.nodeId,
            yearlyId: data.yearlyId,
        }
    })
}

//设置评奖年度获奖人数(修改管理员)
export function setBonusNumber(data) {
    return service({
        url: '/exam/scholarship/admin/updateNodeYearlyNumber',
        method: 'put',
        data: {
            annuHeadCountId: data.annuHeadCountId,
            winningTotal: data.winningTotal,
        }
    })
}




//修改审核状态
export function updateBonusStatus(data) {
    return service({
        url: '/exam/scholarship/admin/batchAudit',
        method: 'put',
        data: {
            ids: data.ids,//申请表id数组
            status: data.status,//true为通过，false为驳回
            remarks: data.remark,//通过、驳回理由
        }
    })
}

//获取导入成绩模版(基础成绩)
export function getGradesTemplate() {
    return service({
        url: '/exam/school/getBaseScoreImportTemplate',
        method: 'get',
        responseType: 'blob'  // 关键配置：指定响应类型为二进制流
    })
}

//获取导入成绩模版(课程成绩)
export function getBatchGradesTemplate() {
    return service({
        url: '/exam/school/getBatchImportScoreTemplate',
        method: 'get',
        responseType: 'blob'  // 关键配置：指定响应类型为二进制流
    })
}


//导入成绩（英语四级、英语平均分、德育分、体育分）
// 导出方法
export function importStudentGrades(data) {
    // 确保 annuPrizeId 和 type 作为查询参数拼接到 URL 中
    const url = `/exam/school/batchImportBaseScore?annuPrizeId=${data.annuPrizeId}&type=${data.type}`;

    // 使用 FormData 上传文件
    const formData = new FormData();
    formData.append('file', data.file);

    return service({
        url: url,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data' // 指定文件上传的 Content-Type
        }
    });
}

//导入课程成绩
export function importBatchStudentGrades(data) {
    // 确保 annuPrizeId 作为查询参数拼接到 URL 中
    const url = `/exam/school/batchImportScore?annuPrizeId=${data.annuPrizeId}`;

    // 使用 FormData 上传文件
    const formData = new FormData();
    formData.append('file', data.file);

    return service({
        url: url,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data' // 指定文件上传的 Content-Type
        }
    });
}

//根据id删除学生成绩
export function DELETEStudentGrades(id) {
    return service({
        url: '/exam/school/deleteScoreById',
        method: 'DELETE',
        params: {
            id: id,
        }
    })
}

//下载修改成绩证明文件
export function downloadScoreChangeFile(data) {
    return service({
        url: '/file/download',
        method: 'get',
        params: {
            fileUrl:data.url
        },
        responseType: 'blob'  // 关键配置：指定响应类型为二进制流qu
    })
}

//审核学生修改成绩申请
export function auditScoreChange(data) {
    return service({
        url: '/exam/school/correctionScoreApproval',
        method: 'PUT',
        data: {
            applyId:data.annuPrizeApplyId,
            action:data.action,
        }
    })
}

//获取批量导入学生违纪情况模板
export function getDisciplinaryTemplate() {
    return service({
        url: '/exam/school/getImportDisciplinaryTemplate',
        method: 'get',
        responseType: 'blob'  // 关键配置：指定响应类型为二进制流
    })
}

//导出评奖通过的学生名单
export function exportBonusStudents(data) {
    return service({
        url: '/exam/school/exportPrizeRanking',
        method: 'get',
        params: {
            nodeId: data.nodeId,
            yearlyId: data.yearlyId,
        },
        responseType: 'blob'
    })
}

//根据评奖年度id删除评奖年度
export function deleteBonusYearly(data) {
    return service({
        url: '/exam/scholarship/admin/deleteAnnuPrize',
        method: 'delete',
        params: {
            annuPrizeId: data.annuPrizeId,
        }
    })
}







