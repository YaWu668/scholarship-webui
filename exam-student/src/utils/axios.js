// api.js
import axios from 'axios';

// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_API, // api的base_url
    timeout: 3000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 在这里可以做一些请求前的操作，比如添加token
        const token = localStorage.getItem('user_token');
        if (token) {
            config.headers['Authorization'] =token;
          }
        return config;
    },
    error => {
        // 请求错误处理
        console.error(error);
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        // 在这里可以做一些响应数据的操作
        return response.data;
    },
    error => {
        // 响应错误处理
        console.error(error);
        return Promise.reject(error);
    }
);

export default service;