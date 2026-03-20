<template>
  <div class="app-wrapper">
    
    <transition name="slide-up">
      <div v-if="showIntro" class="intro-screen" @click="closeIntro">
        
        <div class="poetry-wrapper">
          
          <div class="ornament-half left">
            <img :src="wenyangImg" class="ornament-img" alt="ornament" />
          </div>

          <div class="poetry-container">
            <p class="poetry-line">「楹，天子丹，诸侯黝垩，</p>
            <p class="poetry-line">大夫苍，士黈。」</p>
            <p class="poetry-author">——《礼记》</p>
          </div>

          <div class="ornament-half right">
            <img :src="wenyangImg" class="ornament-img" alt="ornament" />
          </div>

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
import wenyangSvg from './assets/wenyang.svg';
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
      wenyangImg: wenyangSvg, 
      showIntro: true ,// 🌟 新增：默认显示开场动画
      activeTab: '时空分析' // 默认显示第一页
    }
  },
  
mounted() {
    // 5秒后自动拉开帷幕（如果你觉得太慢，可以把 5000 改成 4000 或 3000）
    setTimeout(() => {
      this.showIntro = false;
    }, 100000);
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
/* ================= 🌟 纹样切割与排版样式 ================= */

/* 1. 让图案和文字横向排列，垂直居中 */
.poetry-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px; /* 图案和文字的间距 */
}

/* 2. 切分图片的“窗户” (只有原图一半宽) */
.ornament-half {
  width: 45vh; 
  height: 90vh; 
  position: relative; 
  overflow: hidden; /* 核心：超出 150px 的部分切掉 */
  opacity: 0;
  animation: fadeOrnament 2s forwards 0.5s; /* 动画属性 */
}

/* 3. 完整的原图 (加了滤镜魔法) */
.ornament-img {
  width: 90vh;
  height: 90vh;
  position: absolute; 
  top: 0;
  
  /* 魔法滤镜：反相去白底 -> 变复古色 -> 调成暗金 -> 提亮 */
  filter: invert(0.9) sepia(0.5) hue-rotate(320deg) brightness(1.2); 
  mix-blend-mode: screen; /* 让残余底色彻底融进黑背景 */
}

/* 4. 左半边：让图片靠左对齐 */
.ornament-half.left .ornament-img {
  left: 0;
}

/* 5. 右半边：让图片靠右对齐 */
.ornament-half.right .ornament-img {
  right: 0;
}

/* 6. 图案的淡入动画 (最终透明度 0.4，营造高级暗影感) */
@keyframes fadeOrnament {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 0.4; transform: scale(1); }
}
/* 样式部分保持原样，无需修改 */
/* ================= 🌟 首页：紫禁宫墙与暗金主题 ================= */
body { margin: 0; padding: 0; font-family: "PingFang SC", "Microsoft YaHei", sans-serif; background-color: #080a10;}

.hero-section { 
  width: 100vw; 
  height: 100vh; 
  /* 魔法：宫墙暗红色渐变 + 墙面斑驳纹理 */
  background-color: #611316;
  background-image: 
    url('https://www.transparenttextures.com/patterns/stucco.png'),
    linear-gradient(135deg, #7a1518 0%, #3a080a 100%);
  position: relative; 
  overflow: hidden;
}

/* 增加一个隐约的建筑底纹（利用 radial-gradient 模拟光源聚焦） */
.hero-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.4) 100%);
  pointer-events: none;
}

/* 左侧大标题：暗金浮雕效果 */
.vertical-title { 
  position: absolute; 
  left: 8%; 
  top: 15%; 
  font-family: "STXingkai", "华文行楷", "STKaiti", "楷体", "SimSun", serif;
  font-size: 80px; 
  font-weight: bold; 
  writing-mode: vertical-lr; 
  letter-spacing: 24px; 
  color: #e6c280; /* 宫廷暗金 */
  /* 精致的内发光与外阴影，去掉原本显脏的灰色阴影 */
  text-shadow: 
    -1px -1px 1px rgba(255, 255, 255, 0.2),
    2px 2px 4px rgba(0, 0, 0, 0.8),
    0px 0px 20px rgba(230, 194, 128, 0.3);
}

/* 中间副标题：端正素雅 */
.center-content { 
  position: absolute; 
  top: 40%; 
  width: 100%; 
  text-align: center; 
  color: #fdf6e3; 
}
.center-content h2 { 
  font-family: "STKaiti", "楷体", "SimSun", serif;
  font-size: 36px; 
  letter-spacing: 6px; 
  margin-bottom: 15px; 
  text-shadow: 2px 4px 8px rgba(0,0,0,0.6);
}
.center-content p { 
  font-size: 14px; 
  letter-spacing: 2px;
  color: #bfa175; 
  font-family: "Georgia", serif; /* 英文用更古典的衬线体 */
}

/* 底部导航：宫廷牌匾质感 */
.bottom-tabs { 
  position: absolute; 
  bottom: 12%; 
  width: 100%; 
  display: flex; 
  justify-content: center; 
  gap: 30px; 
}
.tab-btn { 
  padding: 12px 35px; 
  background-color: rgba(20, 5, 5, 0.4); 
  border: 1px solid #bfa175; /* 暗金边框 */
  border-radius: 4px; /* 摒弃现代大圆角 */
  font-size: 18px; 
  font-family: "STKaiti", "楷体", serif;
  letter-spacing: 2px;
  color: #e6c280; 
  cursor: pointer; 
  transition: all 0.4s ease; 
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}
.tab-btn.active { 
  background-color: #e6c280; 
  color: #3a080a; 
  box-shadow: 0 0 20px rgba(230, 194, 128, 0.4);
  font-weight: bold;
}
.tab-btn:hover:not(.active) { 
  background-color: rgba(230, 194, 128, 0.15); 
  transform: translateY(-3px);
}

/* 内容区底色同步加深一点，防止突兀 */
.content-section {
  min-height: 100vh; 
  background-color: #fdf6e3; /* 纸质背景 */
}

/* 手机端适配保持结构 */
@media (max-width: 768px) {
  .hero-section { display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; height: auto; min-height: 100vh; }
  .vertical-title { position: static !important; writing-mode: horizontal-tb !important; font-size: 40px !important; letter-spacing: 5px !important; margin-bottom: 20px; }
  .center-content { position: static !important; margin-bottom: 40px; }
  .bottom-tabs { position: static !important; flex-wrap: wrap; gap: 10px !important; }
  .tab-btn { padding: 10px 15px !important; font-size: 14px !important; width: 80%; }
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
/* ================= 🌟 开场动画屏样式 (大漆暗金版) ================= */
.intro-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  
  /* 💡 爆改1：大漆质感背景！极深的暗绛红渐变 + 宣纸/斑驳底纹 */
  background-color: #1a0808; 
  background-image: 
    url('https://www.transparenttextures.com/patterns/stucco.png'),
    radial-gradient(circle at center, #2b1110 0%, #0d0404 100%);
    
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e6c280; 
  cursor: pointer;
  /* 增加一个极其微弱的全屏内阴影，增加幽暗的氛围 */
  box-shadow: inset 0 0 150px rgba(0,0,0,0.9);
}

/* 竖排文字容器 */
.poetry-container {
  writing-mode: vertical-rl; 
  font-family: "STKaiti", "楷体", "SimSun", serif;
  letter-spacing: 12px; /* 字距稍微拉开一点，更透气 */
  position: relative;
  z-index: 10; /* 确保文字在纹样之上 */
}

/* 诗词逐句浮现动画 */
.poetry-line {
  font-size: 38px; /* 稍微放大一丢丢 */
  margin: 0 20px;
  opacity: 0;
  color: #e6c280;
  /* 💡 爆改2：文字鎏金效果，微弱的发光感 */
  text-shadow: 0 0 20px rgba(230, 194, 128, 0.4), 0 2px 4px rgba(0,0,0,0.8);
  animation: fadeIn 2s forwards; 
}

.poetry-line:nth-child(2) {
  animation-delay: 1s;
}

/* 出处落款 */
.poetry-author {
  font-size: 22px;
  margin-right: 60px;
  margin-top: 50px;
  color: #a38254; /* 颜色调暗金一点，不要用纯灰 */
  opacity: 0;
  animation: fadeIn 2s forwards 2.5s;
}

/* 底部呼吸提示 */
.skip-hint {
  position: absolute;
  bottom: 40px;
  font-size: 14px;
  color: #888;
  letter-spacing: 6px;
  animation: breathe 3s ease-in-out infinite; /* 呼吸放缓，显得更从容 */
}

/* 💡 爆改3：纹样融进背景 */
@keyframes fadeOrnament {
  from { opacity: 0; transform: scale(0.95); }
  /* 透明度从 0.4 降到 0.15，它应该是氛围，不是主角 */
  to { opacity: 0.15; transform: scale(1); }
}

.ornament-img {
  width: 90vh;
  height: 90vh;
  position: absolute; 
  top: 0;
  /* 让它变成偏金色的单色调，并和底色做色彩增殖叠加 */
  filter: sepia(1) hue-rotate(350deg) saturate(2) brightness(0.6); 
  mix-blend-mode: hard-light; 
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