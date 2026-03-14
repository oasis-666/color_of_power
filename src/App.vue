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
          🗺️ 时空分析
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === '特例分析' }]" 
          @click="changeTabAndScroll('特例分析')"
        >
          🏠 特例分析
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === '用户体验' }]" 
          @click="changeTabAndScroll('用户体验')"
        >
          🎨 用户体验
        </button>
        
        <button 
          :class="['tab-btn', { active: activeTab === 'AI智能识图' }]" 
          @click="changeTabAndScroll('AI智能识图')"
        >
          🤖 AI 智能识图
        </button>
      </div>
    </div>

    <div id="content-area" class="content-section">
      
      <TimeSpace v-if="activeTab === '时空分析'" />

      <SpecialCase v-if="activeTab === '特例分析'" />

      <UserExp v-if="activeTab === '用户体验'" />

      <ImageAnalyzer v-if="activeTab === 'AI智能识图'" />

    </div>
  </div>
</template>

<script>
import TimeSpace from './components/TimeSpace.vue'
import SpecialCase from './components/SpecialCase.vue' 
import UserExp from './components/UserExp.vue';
import ImageAnalyzer from './components/ImageAnalyzer.vue'

export default {
  name: 'App',
  components: {
    TimeSpace,
    SpecialCase,
    UserExp,
    ImageAnalyzer
  },

  data() {
    return {
      activeTab: '时空分析' // 默认显示第一页
    }
  },
  
  methods: {
    changeTabAndScroll(tabName) {
      this.activeTab = tabName;
      // 点击后丝滑滚动到下方内容区
      document.getElementById('content-area').scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  }
}
</script>

<style>
/* 样式部分保持原样，无需修改 */
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

.content-section {
  min-height: 100vh; 
  background-color: #f0f2f5;
}

@media (max-width: 768px) {
  .hero-section {
    display: flex;
    flex-direction: column; 
    justify-content: center;
    align-items: center;
    padding: 20px;
    height: auto; 
    min-height: 100vh;
  }

  .vertical-title {
    position: static !important; 
    writing-mode: horizontal-tb !important; 
    font-size: 40px !important;
    letter-spacing: 5px !important;
    margin-bottom: 20px;
  }

  .center-content {
    position: static !important; 
    margin-bottom: 40px;
  }

  .bottom-tabs {
    position: static !important; 
    flex-wrap: wrap; 
    gap: 10px !important;
  }

  .tab-btn {
    padding: 10px 15px !important;
    font-size: 14px !important;
    width: 80%; 
  }
}
</style>