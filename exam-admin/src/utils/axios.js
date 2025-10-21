import axios from 'axios';
import { Message } from 'element-ui';  // 根据你实际使用的UI库调整
const getRouter = () => import('../router').then(m => m.default)     // 动态导入路由实例

const service = axios.create({
    baseURL: process.env.VUE_APP_API,
    timeout: 5000,
});

service.interceptors.request.use(
    config => {
        const token = localStorage.getItem('user_token');
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    response => {
        // 处理业务逻辑错误（假设响应体包含code字段）
        if (response.code && response.code !== 200) {
            Message.error(response.msg || '请求错误');
            return Promise.reject(response.data);
        }
        return response.data;
    },
    error => {
        // 处理HTTP状态码
        if (error.response) {
            switch (error.response.code) {
                case 401:
                    Message({
                        message: '登录已过期，请重新登录',
                        type: 'error',
                        duration: 3000
                    });
                    localStorage.removeItem('user_token');
                    // 使用动态路由跳转
                    getRouter().then(router => {
                        router.push({
                            path: '/',
                            query: { redirect: router.currentRoute.fullPath }
                        });
                    });
                    break;
                case 500:
                    Message.error('服务器异常');
                    break;
                default:
                    Message.error(`请求错误：${error.message}`);
            }
        } else {
            Message.error('网络连接异常');
        }
        return Promise.reject(error);
    }
);

export default service;