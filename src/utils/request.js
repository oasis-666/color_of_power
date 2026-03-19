import axios from 'axios';

// 🌟 重点：这里用 export const，明确告诉 Vite 导出的是什么，绝不让它猜！
export const request = axios.create({
  baseURL: 'http://server.hairuosky.cn:1111', // Vercel 代理模式下，这里必须是空字符串
  timeout: 10000 
});

// 拦截器：每次发请求自动带上你的专属 VIP 通行证
request.interceptors.request.use(
  config => {
    // 你的真实 Token
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
    console.error('API请求出错了:', error);
    return Promise.reject(error);
  }
);
// ⚠️ 注意：最下面不要再写 export default request; 了！