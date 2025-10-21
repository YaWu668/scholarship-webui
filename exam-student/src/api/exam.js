import service from '../utils/axios'

//获取试卷列表
export function getTestPaperList(pageIndex, pageSize) {
    return service({
        url: '/exam/student/getStudenYearType',
        method: 'get',
        params: {
            pageNo: pageIndex,
            pageSize: pageSize,
        }
    })
}


//申请开始考试
export function applyStartExam(yearId) {
    return service({
        url: '/exam/student/start',
        method: 'get',
        params: {
            yearId: yearId,
        }
    })
}

//提交答题卡
export function submitAnswerSheet(formdata) {
    return service({
        url: '/exam/student/submitAnswerSheet',
        method: 'post',
        data: formdata,
    })
}

//提交试卷
export function submitTestPaper(testPaperId) {
    return service({
        url: "/exam/student/submitTestPaper",
        method: 'post',
        data: {
            testPaperId: testPaperId,
        }
    })
}

//历史考试记录
export function getHistoryExamRecord(pageIndex, pageSize) {
    return service({
        url: "/exam/public/getTestPaperPage",
        method: 'get',
        params: {
            role: 1,
            pageNo: pageIndex,
            pageSize: pageSize,
        }
    });
}

//查看试卷详情
export function getTestPaperDetail(testPaperId) {
    return service({
        url: "/exam/public/getTestPaperDetail",
        method: 'get',
        params: {
            role: 1,
            testPaperId: testPaperId,
        }
    });
}

//提交申请修改成绩
export function submitScoreChangeApply(data) {
    return service({
        url: "/exam/school/requestCorrectionScore",
        method: 'PUT',
        data: {
            applyId: data.applyId,//申请表id
            explanation: data.explanation,//申请说明（备注）
            imgUrls: data.imgUrls,//图片地址数组
        }
    });
}


//上传申请修改成绩证明文件
export function uploadScoreChangeFile(formdata) {
    return service({
        url: "/file/upload",
        method: 'post',
        data: formdata,
    });
}







