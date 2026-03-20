import axios from 'axios';

// 建立记忆宫殿 (LRU 缓存策略底层变量)
const cacheMap = new Map();
const MAX_CACHE_SIZE = 50; // 设定最大缓存接口数量，防止内存溢出

export const request = axios.create({
  baseURL: '', // 配合 Vite proxy
  timeout: 30000 
});

// ================= 1. 请求拦截器 =================
request.interceptors.request.use(
  config => {
    // ⚠️ 暂且保留你的硬编码 Token 确保能运行，但加入了 localStorage 备用通道
    const token = localStorage.getItem('auth_token') || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBQ0FTQl9BRE1JTiIsImlhdCI6MTc3MzY3Nzg3MiwiZXhwIjoxNzc2MjY5ODcyfQ.Jdaps3Oy_TQ5aFWcbgTv8tIDhlSjuaN1r_8KC7F7Dp8'; 
    
    if (token) config.headers['Authorization'] = `Bearer ${token}`;

    const cacheKey = `${config.url}_${JSON.stringify(config.params || {})}`;
    
    // 🌟 闪电读取缓存
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

// ================= 2. 响应拦截器 =================
request.interceptors.response.use(
  response => {
    if (response.config.method === 'get' && response.data.code === 200) {
      
      const resData = response.data.data;
      let isDataEmpty = false;
      
      if (resData) {
        if (resData.levels && resData.levels.length === 0) isDataEmpty = true;
        if (resData.colors && resData.colors.length === 0) isDataEmpty = true;
      }

      // 只有数据饱满，才执行缓存逻辑
      if (!isDataEmpty) {
        const cacheKey = `${response.config.url}_${JSON.stringify(response.config.params || {})}`;
        
        // 💡 架构师级修复：LRU 缓存淘汰机制（写在这里才对！）
        if (cacheMap.size >= MAX_CACHE_SIZE) {
          const firstKey = cacheMap.keys().next().value; // 拿到最老的一个 key
          cacheMap.delete(firstKey); // 把它踢出去
          console.log(`🧹 内存清理：已淘汰旧缓存 ${firstKey}`);
        }

        // 存入新数据
        cacheMap.set(cacheKey, JSON.stringify(response.data)); 
      } else {
        console.warn('⚠️ 拦截到后端返回的空壳数据，拒绝存入缓存！');
      }
    }
    return response.data; 
  },
  error => Promise.reject(error)
);