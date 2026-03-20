import axios from 'axios';

// 建立记忆宫殿
const cacheMap = new Map();

export const request = axios.create({
  baseURL: '', 
  timeout: 30000 
});

request.interceptors.request.use(
  config => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBQ0FTQl9BRE1JTiIsImlhdCI6MTc3MzY3Nzg3MiwiZXhwIjoxNzc2MjY5ODcyfQ.Jdaps3Oy_TQ5aFWcbgTv8tIDhlSjuaN1r_8KC7F7Dp8'; // 你的真实Token
    if (token) config.headers['Authorization'] = `Bearer ${token}`;

    const cacheKey = `${config.url}_${JSON.stringify(config.params || {})}`;
    
    // 🌟 如果缓存里有，直接返回（加入深拷贝，切断对象引用防止 Vue 乱套）
    if (config.method === 'get' && cacheMap.has(cacheKey)) {
      console.log(`🚀 闪电读取缓存：${cacheKey}`);
      config.adapter = () => {
        return Promise.resolve({
          data: JSON.parse(cacheMap.get(cacheKey)), 
          status: 200,
          statusText: 'OK',
          headers: config.headers,
          config: config
        });
      };
    }
    return config;
  },
  error => Promise.reject(error)
);

request.interceptors.response.use(
  response => {
    if (response.config.method === 'get' && response.data.code === 200) {
      
      // 🌟 防御性编程：检查后端是不是被压垮了返回了空数组？
      const resData = response.data.data;
      let isDataEmpty = false;
      if (resData) {
        // 如果本该有数据的数组是空的，标记为异常
        if (resData.levels && resData.levels.length === 0) isDataEmpty = true;
        if (resData.colors && resData.colors.length === 0) isDataEmpty = true;
      }

      // 只有数据真的饱满，我们才允许放入缓存！
      if (!isDataEmpty) {
        const cacheKey = `${response.config.url}_${JSON.stringify(response.config.params || {})}`;
        // 存为字符串，彻底切断引用
        cacheMap.set(cacheKey, JSON.stringify(response.data)); 
      } else {
        console.warn('⚠️ 拦截到后端返回的空壳数据，拒绝存入缓存！');
      }
    }
    return response.data; 
  },
  error => Promise.reject(error)
);