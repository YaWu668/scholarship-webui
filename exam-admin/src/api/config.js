import service from '../utils/axios'

//查询系统参数配置
export function getSysConfig(params) {
    return service({
        url: '/system/config/list',
        method: 'get',
        params
    })
}

//根据id获取系统配置详情信息
export function getSysConfigById(id) {
    return service({
        url: `/system/config/`+id,
        method: 'get',
    })
}

//修改系统参数配置
export function updateSysConfig(data) {
    return service({
        url: '/system/config',
        method: 'put',
        data
    })
}

//新增系统参数配置
export function addSysConfig(data) {
    return service({
        url: '/system/config',
        method: 'post',
        data
    })
}

//删除系统参数配置
export function deleteSysConfig(ids) {
    return service({
        url: `/system/config?ids=`+ids,
        method: 'delete',
    })
}




