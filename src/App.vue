<template>
  <div class="app-wrapper">
    
    <transition name="slide-up">
      <div v-if="showIntro" class="intro-screen" @click="closeIntro">
        <div class="poetry-container">
          <p class="poetry-line">「楹，天子丹，诸侯黝垩，</p>
          <p class="poetry-line">大夫苍，士黈。」</p>
          <p class="poetry-author">——《礼记》</p>
        </div>
        <div class="skip-hint">点击屏幕任意处开启系统</div>
      </div>
    </transition>

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
      showIntro: true ,// 🌟 新增：默认显示开场动画
      activeTab: '时空分析' // 默认显示第一页
    }
  },
  
mounted() {
    // 5秒后自动拉开帷幕（如果你觉得太慢，可以把 5000 改成 4000 或 3000）
    setTimeout(() => {
      this.showIntro = false;
    }, 10000);
  },

  methods: {

    closeIntro() {
      this.showIntro = false;
    },
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
/* 替换原来的 .vertical-title */
.vertical-title { 
  position: absolute; 
  left: 5%; 
  top: 10%; 
  
  /* 🌟 1. 字体魔法：优先调用系统自带的行楷/楷体/宋体，瞬间拉满古风感 */
  font-family: "STXingkai", "华文行楷", "STKaiti", "楷体", "SimSun", serif;
  font-size: 72px; /* 艺术字一般稍微放大一点更好看 */
  font-weight: bold; 
  writing-mode: vertical-lr; 
  letter-spacing: 24px; 
  
  /* 🌟 2. 颜色与立体感魔法：纯白底色 + 多层阴影挤出“白玉浮雕”的厚度 */
  color: #ffffff; 
  text-shadow: 
    1px 1px 0px #e0e0e0,
    2px 2px 0px #cccccc,
    3px 3px 0px #b3b3b3,
    4px 4px 0px #999999,
    6px 6px 10px rgba(0, 0, 0, 0.4); 
}.center-content { position: absolute; top: 35%; width: 100%; text-align: center; color: white; }
.center-content h2 { 
  font-family: "STKaiti", "楷体", "SimSun", serif; /* 副标题用端正的楷体 */
  font-size: 32px; 
  letter-spacing: 4px; 
  margin-bottom: 15px; 
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}.center-content p { font-size: 14px; opacity: 0.8; }
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
/* ================= 🌟 开场动画屏样式 ================= */
.intro-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #121212; /* 深邃的炭黑色，衬托历史的厚重 */
  z-index: 9999; /* 保证它盖住所有东西 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e6c280; /* 极具古典质感的暗金色 */
  cursor: pointer;
}

/* 竖排文字容器 */
.poetry-container {
  writing-mode: vertical-rl; /* 文字从右向左竖排 */
  font-family: "STKaiti", "楷体", "SimSun", serif;
  letter-spacing: 10px;
}

/* 诗词逐句浮现动画 */
.poetry-line {
  font-size: 36px;
  margin: 0 20px;
  opacity: 0;
  animation: fadeIn 2s forwards; /* 2秒淡入 */
}

/* 第二句延迟1秒出现 */
.poetry-line:nth-child(2) {
  animation-delay: 1s;
}

/* 出处落款稍微小一点，延迟2.5秒出现 */
.poetry-author {
  font-size: 20px;
  margin-right: 60px;
  margin-top: 50px;
  color: #888;
  opacity: 0;
  animation: fadeIn 2s forwards 2.5s;
}

/* 底部呼吸闪烁的提示文字 */
.skip-hint {
  position: absolute;
  bottom: 40px;
  font-size: 14px;
  color: #666;
  letter-spacing: 4px;
  animation: breathe 2.5s infinite;
}

/* 关键帧：淡入 */
@keyframes fadeIn {
  to { opacity: 1; }
}

/* 关键帧：呼吸效果 */
@keyframes breathe {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* 🌟 Vue <transition> 的滑动拉开帷幕效果 */
.slide-up-leave-active {
  /* 贝塞尔曲线让滑动有“先慢后快再减速”的丝滑感 */
  transition: transform 1.2s cubic-bezier(0.7, 0, 0.3, 1), opacity 1.2s;
}
.slide-up-leave-to {
  transform: translateY(-100%); /* 整个黑屏向上滑出屏幕 */
  opacity: 0;
}
/* ================= 开场屏样式结束 ================= */
</style>