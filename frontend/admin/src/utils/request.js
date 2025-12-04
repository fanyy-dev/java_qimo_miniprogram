import axios from 'axios';
import { Message } from 'element-ui';
import router from '../router';

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    console.error('请求错误', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    
    if (res.code !== 200) {
      Message({
        message: res.message || '请求失败',
        type: 'error',
        duration: 3000
      });
      
      if (res.code === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        router.push('/login');
      }
      
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    
    return res.data;
  },
  error => {
    Message({
      message: error.message || '网络错误',
      type: 'error',
      duration: 3000
    });
    return Promise.reject(error);
  }
);

export default service;
