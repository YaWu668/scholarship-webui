import service from '../utils/axios'


export function getOnlineUserList(form) {
    return service({
        url: '/system/online',
        method: 'GET',
        params: {
            orderByColumn: "create_time",
            // 排序方式 desc 降序 asc 升序
            isAsc: "asc",
            userName: form.userName,
            current: form.pageIndex,
            limit: form.pageSize,
        }
    })
}


/**
 * 用户强退
 */
export function forceLogout(id) {
    return service({
        url: '/system/online/' + id,
        method: 'DELETE',
    })
}