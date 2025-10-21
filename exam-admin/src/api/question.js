import service from '../utils/axios'

//获取题目列表
export function getQuestionList(data) {
    return service({
        url: '/exam/admin/getQuestionBankList',
        method: 'get',
        params:{
            pageNo: data.pageIndex,
            pageSize: data.pageSize,
            questionType: data.questionType,//题目类型
            textContext: data.textContext,//题干
            isAsc:true
        }
    })
}

//删除题目
export function deleteQuestion(data) {
    return service({
        url: '/exam/admin/deleteQuestionBank/'+data.questionBankId,
        method: 'delete',
    })
}


//获取批量导入题目模版
export function getQuestionTemplate() {
    return service({
        url: '/exam/admin/getImportQuestionBankTemplate',
        method: 'get',
        responseType: 'blob'
    })
}







