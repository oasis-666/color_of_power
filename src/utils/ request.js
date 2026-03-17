import axios from 'axios';

// 1. 换成你队友部署的真实服务器地址
const request = axios.create({
  baseURL: 'http://server.hairuosky.cn:1111', 
  timeout: 10000 
});

// 2. 拦截器：每次发请求自动带上这串长长的 Token
request.interceptors.request.use(
  config => {
    // 🌟 这里就是你队友发你的那个 Token，一定要带单引号！
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBQ0FTQl9BRE1JTiIsImlhdCI6MTc3MzU1MTU5NywiZXhwIjoxNzc2MTQzNTk3fQ.wct8rTrOnoOSwaJUbGtV7_xFgChSW9Hn079YxDh22pQ'; 
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  response => {
    return response.data; 
  },
  error => {
    console.error('请求出错了:', error);
    return Promise.reject(error);
  }
);

export default request;