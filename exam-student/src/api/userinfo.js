import service from '../utils/axios'

//登录
export function login(user){
    return service({
        url: '/auth/login',
        method: 'POST',
        data: user
    })
}

//获取用户信息
export function getUserInfo(){
    return service({
        url: '/system/user/getInfo',
        method: 'GET'
    })
}


