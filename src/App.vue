<template>
  <div class="app-wrapper">
    
    <div class="hero-section">
      <div class="vertical-title">丹漆载礼</div>
      <div class="center-content">
        <h2>中国古代建筑色彩与礼仪制度探析系统</h2>
        <p>Ancient Chinese Architecture Color and Ritual System</p>
      </div>

      <div class="bottom-tabs">
        <button 
          :class="['tab-btn', { active: activeTab === '时空分析' }]" 
          @click="changeTabAndScroll('时空分析')"
        >
          地图 时空分析
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === '特例分析' }]" 
          @click="changeTabAndScroll('特例分析')"
        >
          建筑 特例分析
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === '用户体验' }]" 
          @click="changeTabAndScroll('用户体验')"
        >
          调色板 用户体验
        </button>
      </div>
    </div>

    <div id="content-area" class="content-section">
      
      <TimeSpace v-if="activeTab === '时空分析'" />

      <SpecialCase v-if="activeTab === '特例分析'" />

      <UserExp v-if="activeTab === '用户体验'" />

    

    </div>
  </div>
</template>

<script>
// 从 components 文件夹里把刚才建好的组件引进来
import TimeSpace from './components/TimeSpace.vue'
import SpecialCase from './components/SpecialCase.vue' // 👈 新增这一行
import UserExp from './components/UserExp.vue';
export default {
  name: 'App',
  components: {
    TimeSpace ,// 告诉 Vue，我要用这个零件了
    SpecialCase,
    UserExp
  },
  // data() 就是 Vue 的“大脑记忆区”，用来存变量
  data() {
    return {
      activeTab: '时空分析' // 默认一开始选中“时空分析”
    }
  },
  // methods 就是 Vue 能执行的“动作/方法”
  methods: {
    changeTabAndScroll(tabName) {
      // 1. 改变当前选中的标签
      this.activeTab = tabName;
      
      // 2. 找到第二页的那个盒子，命令浏览器平滑滚动过去！
      document.getElementById('content-area').scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  }
}
</script>

<style>
/* ... 这里保留之前第一步给你的所有 style CSS 代码，一字不差地放在这里 ... */
body { margin: 0; padding: 0; font-family: "PingFang SC", sans-serif; }
.hero-section { width: 100vw; height: 100vh; background: linear-gradient(to right, #ff5e00, #ffb347); position: relative; }
.vertical-title { position: absolute; left: 5%; top: 10%; color: white; font-size: 60px; font-weight: bold; writing-mode: vertical-lr; letter-spacing: 20px; text-shadow: 2px 4px 10px rgba(0,0,0,0.3); }
.center-content { position: absolute; top: 35%; width: 100%; text-align: center; color: white; }
.center-content h2 { font-size: 24px; letter-spacing: 2px; margin-bottom: 10px; }
.center-content p { font-size: 14px; opacity: 0.8; }
.bottom-tabs { position: absolute; bottom: 10%; width: 100%; display: flex; justify-content: center; gap: 20px; }
.tab-btn { padding: 12px 30px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; background-color: rgba(255, 255, 255, 0.2); color: white; transition: all 0.3s ease; }
.tab-btn.active { background-color: white; color: #ff5e00; }
.tab-btn:hover { background-color: rgba(255, 255, 255, 0.4); }

/* 下面是新增的第二大页的样式 */
.content-section {
  min-height: 100vh; /* 保证第二页至少有屏幕那么高 */
  background-color: #f0f2f5;
}
.placeholder {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
}
</style>