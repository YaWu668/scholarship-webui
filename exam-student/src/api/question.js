import service from '../utils/axios'

export function getPractice(){
    return service({
        url: '/exam/student/getPractice',
        method: 'get',
    })
}
