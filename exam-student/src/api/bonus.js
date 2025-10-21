import service from '../utils/axios'

//获取奖学金年度列表
export function getBonusList() {
    return service({
        url: '/exam/school/getAnnuPrizeList',
        method: 'get',
        params: {
            pageNo: 1,
            pageSize: 1000,
        }
    })
}

//根据年度id获取奖学金申请列表(分页)
export function getBonusListByYearId(data) {
    return service({
        url: '/exam/school/getAnnuPrizeApplyList',
        method: 'get',
        params: {
            pageNo: data.pageIndex,
            pageSize: data.pageSize,
            annuPrizeId: data.annuPrizeId,//奖学金年度id
        }
        
    })
}

//根据申请表ID进行提交申请
export function submitBonus(id) {
    return service({
        url: '/exam/school/submitApply',
        method: 'put',
        params: {
            id:id
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






