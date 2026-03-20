<template>
  <div class="user-exp-wrapper">
    <h2 class="page-title">建筑配色互动体验</h2>

    <div class="card identity-section">
      <h3>选择您的身份</h3>
      <div class="identity-tabs">
        <button 
          v-for="(role, index) in roles" :key="index"
          :class="{ active: currentRole.name === role.name }"
          @click="selectRole(role)"
        >
          <strong>{{ role.name }}</strong>
          <span>可用 {{ role.allowedColors.length }} 种颜色</span>
        </button>
      </div>
    </div>

    <div class="card available-colors-section">
      <h3>🖌️ 皇家工部调色盘（点击取色）</h3>
      <div class="color-palette">
        <div 
          class="color-item" 
          v-for="(color, colorId) in allColors" :key="colorId"
          @click="selectBrush(colorId)"
          :class="{ 'is-active-brush': activeBrushColor === allColors[colorId].hex }"
        >
          <div class="color-swatch" :style="{ backgroundColor: allColors[colorId].hex }"></div>
          <span class="color-name">{{ getPoeticName(allColors[colorId].name) }}</span>
        </div>
      </div>
    </div>

    <div class="card canvas-section">
      <h3>建筑配色详图 - {{ currentRole.name }}</h3>
      
      <p class="subtitle" v-if="!activeBrushColor">请先在上方选择颜色，再点击建筑对应部位上色</p>
      <p class="subtitle" v-else style="color: #ff5e00; font-weight: bold;">当前画笔已就绪，请点击建筑部位上色</p>

      <div class="svg-container">
        <svg viewBox="0 0 803 670" xmlns="http://www.w3.org/2000/svg" class="interactive-svg">
          

          <rect 
            x="177" y="234" width="426" height="251" 
            :fill="partsData['wall'].currentColor || '#ffffff'" 
            stroke="black" stroke-width="2"
            class="clickable-part"
            @click="paintPart('wall')" 
          />
          <text x="390" y="220" font-size="20" fill="#666" pointer-events="none" text-anchor="middle">主墙体</text>

          <g 
            :fill="partsData['doorsAndWindows'].currentColor || '#ffffff'" 
            stroke="black" stroke-width="2"
            class="clickable-part"
            @click="paintPart('doorsAndWindows')"
          >
            <path d="M397 289H347V486H397M397 289H447V486H397M397 289V486"/>
            <path d="M417 384V373H408V384H417Z" />
            <path d="M379 373V384H387V373H379Z" />
            <path d="M222.5 302V288.5H288.5V302M222.5 302H288.5M222.5 302V407M288.5 302V407M507.5 302V288.5H559V302M507.5 302H559M507.5 302V407M559 302V407M222.5 407V417H288.5V407M222.5 407H288.5M507.5 407V417H559V407M507.5 407H559"/>
          </g>

          <g 
            :fill="partsData['base'].currentColor || '#ffffff'" 
            class="clickable-part"
            @click="paintPart('base')"
          >
            <path d="M651 539H136V513H651V539Z" stroke="black" stroke-width="2"/>
            <path d="M632 513H153V486H632V513Z" stroke="black" stroke-width="2"/>
          </g>
          <text x="390" y="580" font-size="20" fill="#666" pointer-events="none" text-anchor="middle">台基</text>

          <g 
            :fill="partsData['pillars'].currentColor || '#ffffff'" 
            class="clickable-part"
            @click="paintPart('pillars')"
          >
            <path d="M177 234V485.5H198.5V234H177Z" stroke="black" stroke-width="2"/>
            <path d="M310.5 234H333V485.5H310.5V234Z" stroke="black" stroke-width="2"/>
            <path d="M460 485.5H481.5V234H460V485.5Z" stroke="black" stroke-width="2"/>
            <path d="M603 485.5V234H580.5V485.5H603Z" stroke="black" stroke-width="2"/>
          </g>
          <text x="140" y="380" font-size="20" fill="#666" pointer-events="none">立柱</text>

          <g 
            :fill="partsData['roof'].currentColor || '#ffffff'" 
            class="clickable-part"
            @click="paintPart('roof')"
          >
            <path d="M602.5 234.5H176.5L149 207H630L602.5 234.5Z" stroke="black" stroke-width="2"/>
            <path d="M146 129L156.5 148H616L625 129L599 140.281H167.5L146 129Z" stroke="black" stroke-width="2"/>
            <path d="M155.909 147.5L123 206.5H656L616.5 147.5H155.909Z" stroke="black" stroke-width="2"/>
          </g>
          <text x="390" y="100" font-size="20" fill="#666" pointer-events="none" text-anchor="middle">屋顶</text>

        </svg>
      </div>

      <div class="progress-container">

        <div class="progress-info">
          <span>配色进度</span>
          <span style="color: #0088cc; font-weight: bold;">{{ coloredCount }} / 5</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: (coloredCount / 5 * 100) + '%' }"></div>
        </div>
      <button 
        class="submit-btn" 
        :disabled="coloredCount < 5" 
        @click="submitArtwork"
      >
        {{ coloredCount < 5 ? '请先完成全部（5/5）部位上色' : '📜 呈交工部验收' }}
      </button>
      </div>
    </div>
    <div class="result-overlay" v-if="showResultModal" @click.self="showResultModal = false">
      <div class="result-card" :class="scoreResult.level">
        <div class="result-stamp">{{ scoreResult.stamp }}</div>
        <h2>{{ scoreResult.title }}</h2>
        <div class="score-circle">
          <span>{{ scoreResult.score }}</span><small>分</small>
        </div>
        <p class="ancient-feedback">「 {{ scoreResult.text }} 」</p>
        <button class="retry-btn" @click="showResultModal = false">叩谢圣恩，退回重绘</button>
      </div>
    </div>
  </div>
</template>

<script>
// 🌟 引入你的文言文翻译器
import { getClassicalName } from '../utils/colorNames.js';

export default {
  name: 'UserExp',
  data() {
    return {
      allColors: {
        'yellow': { name: '黄色', fullName: '黄色琉璃瓦', hex: '#ffbb00' },
        'red':    { name: '朱红色', fullName: '朱红漆料', hex: '#ff5e00' },
        'green':  { name: '绿色', fullName: '绿色琉璃瓦', hex: '#2ca02c' },
        'blue':   { name: '青色', fullName: '青色瓦片', hex: '#0088cc' },
        'grey':   { name: '灰色', fullName: '灰黑瓦片', hex: '#666666' },
        'black':  { name: '黑色', fullName: '黑漆', hex: '#333333' }
      },
      roles: [
        { name: '皇帝', allowedColors: ['yellow', 'red', 'green', 'blue', 'grey', 'black'] },
        { name: '亲王', allowedColors: ['red', 'green', 'blue', 'grey', 'black'] },
        { name: '一品大员', allowedColors: ['green', 'blue', 'grey', 'black'] },
        { name: '富户', allowedColors: ['grey', 'black'] },
        { name: '庶民', allowedColors: ['grey'] }
      ],
      currentRole: null, 
      
      partsData: {
        roof: { name: '屋顶', currentColor: null },
        pillars: { name: '立柱', currentColor: null },
        wall: { name: '主墙体', currentColor: null },
        doorsAndWindows: { name: '门窗', currentColor: null },
        base: { name: '台基', currentColor: null }
      },
      
      // 🌟 新增：记住当前画笔蘸的颜色
      activeBrushColor: null, 
      // ... 保持你之前的 data 不变，在最后加上：
      showResultModal: false,
      scoreResult: { score: 0, title: '', text: '', level: '', stamp: '' },
      // 🌟 “标准答案库”：定义每个阶级最完美的历史配色配色方案
      idealScheme: {
        '皇帝': { roof: 'yellow', wall: 'red', pillars: 'red', doorsAndWindows: 'red', base: 'grey' },
        '亲王': { roof: 'green', wall: 'red', pillars: 'red', doorsAndWindows: 'black', base: 'grey' },
        '一品大员': { roof: 'green', wall: 'grey', pillars: 'black', doorsAndWindows: 'black', base: 'grey' },
        '富户': { roof: 'grey', wall: 'grey', pillars: 'black', doorsAndWindows: 'black', base: 'grey' },
        '庶民': { roof: 'grey', wall: 'grey', pillars: 'grey', doorsAndWindows: 'grey', base: 'grey' }
      }
    }
  },
  created() {
   this.currentRole = this.roles[0];
  },
  computed: {
    coloredCount() {
      let count = 0;
      for (const key in this.partsData) {
        if (this.partsData[key].currentColor !== null) count++;
      }
      return count;
    }
  },
  methods: {
    getPoeticName(colorName) {
      return getClassicalName(colorName, 'qing'); 
    },
    selectRole(role) {
      this.currentRole = role;
      // 切换身份时，洗干净画笔
      this.activeBrushColor = null; 
      // 可选：切换身份时清空已经涂的颜色，防止作弊
      for (const key in this.partsData) {
        this.partsData[key].currentColor = null;
      }
    },
    
    // 🌟 新增：点击调色盘，给画笔蘸色
    selectBrush(colorId) {
      this.activeBrushColor = this.allColors[colorId].hex;
    },

    // 🌟 新增：点击 SVG 建筑部位，直接上色！
    paintPart(partId) {
      if (!this.activeBrushColor) {
        alert("🖌️ 请先在上方调色盘里选择一种颜色！");
        return;
      }
      // 把画笔的颜色涂到对应的部位上
      this.partsData[partId].currentColor = this.activeBrushColor;
    },
    // 🌟 核心：工部验收打分系统
    submitArtwork() {
      let score = 100;
      let isFatal = false;
      let feedbackText = '';
      const roleName = this.currentRole.name;

      // 1. 第一关：生死线（检测是否僭越礼制）
      for (const part in this.partsData) {
        const hex = this.partsData[part].currentColor;
        // 反向查找这个 HEX 对应的 colorId
        const colorId = Object.keys(this.allColors).find(id => this.allColors[id].hex === hex);
        
        // 如果他选了这个颜色，但这个颜色不在他身份的允许列表里！
        if (colorId && !this.currentRole.allowedColors.includes(colorId)) {
          isFatal = true;
          const badColorName = this.allColors[colorId].name;
          feedbackText = `僭越礼制！按《大清会典》，${roleName}严禁使用【${badColorName}】。此乃谋逆僭越之大罪，即刻打入死牢！`;
          break; // 犯死罪了，直接跳出检查
        }
      }

      // 如果犯了死罪，直接 0 分弹窗
      if (isFatal) {
        this.scoreResult = { score: 0, title: '大逆不道！', text: feedbackText, level: 'fatal', stamp: '驳回' };
        this.showResultModal = true;
        return;
      }

      // 2. 第二关：审美与规制贴合度（对比标准答案）
      let perfectMatches = 0;
      const myIdeal = this.idealScheme[roleName];

      for (const part in this.partsData) {
        const currentHex = this.partsData[part].currentColor;
        const idealHex = this.allColors[myIdeal[part]].hex; // 标准答案的 HEX
        
        if (currentHex === idealHex) {
          perfectMatches++;
        }
      }

      // 扣分逻辑：错一个部位扣 10 分
      score -= (5 - perfectMatches) * 10;

      // 生成评语
      if (score === 100) {
        feedbackText = `用色极其考究！深谙《大清会典》之精髓，完美展现了${roleName}的阶级气象与色彩礼制，钦定为工部样板！`;
        this.scoreResult = { score, title: '钦定佳作', text: feedbackText, level: 'perfect', stamp: '恩准' };
      } else if (score >= 80) {
        feedbackText = `中规中矩。虽未违背礼制底线，但部分用色未能完全契合${roleName}的最典型特征，尚有改进空间。`;
        this.scoreResult = { score, title: '尚可一用', text: feedbackText, level: 'normal', stamp: '阅' };
      } else {
        feedbackText = `色彩杂乱！虽无僭越死罪，但配色极其不符礼制审美，毫无${roleName}之威仪，工部不予录用！`;
        this.scoreResult = { score, title: '有失体统', text: feedbackText, level: 'bad', stamp: '重拟' };
      }

      this.showResultModal = true;
    }
  }
}
</script>

<style scoped>
/* ================= 1. 全局：宣纸与墨香底色 ================= */
.user-exp-wrapper { 
  padding: 40px; 
  /* 核心魔法：缃色（米黄）底色 + 透明的宣纸纹理 */
  background: url('https://www.transparenttextures.com/patterns/rice-paper-2.png') #fdf6e3; 
  min-height: 100vh; 
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* 书法质感的大标题 */
.page-title { 
  text-align: center; 
  color: #2b2b2b; 
  font-size: 32px; 
  margin-bottom: 30px; 
  font-family: "STXingkai", "华文行楷", "STKaiti", "楷体", serif;
  letter-spacing: 4px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1); 
}

/* ================= 2. 卡片：古籍与奏折质感 ================= */
.card { 
  /* 卡片内部用更亮的素白色宣纸 */
  background: url('https://www.transparenttextures.com/patterns/rice-paper-2.png') #fffcf9; 
  border-radius: 4px; /* 摒弃现代大圆角，采用古风方正圆角 */
  padding: 25px; 
  margin-bottom: 20px; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
  border: 1px solid #dcbfa2; /* 绢丝暗金边框 */
  position: relative;
}

/* 卡片内部的双层线框（古籍排版特有） */
.card::before {
  content: '';
  position: absolute;
  top: 6px; left: 6px; right: 6px; bottom: 6px;
  border: 1px solid rgba(220, 191, 162, 0.4);
  pointer-events: none;
}

/* 卡片里的标题强制楷体，颜色改为檀褐色 */
.card h3 { 
  text-align: center; 
  font-size: 20px; 
  margin-top: 0; 
  margin-bottom: 20px; 
  color: #5c3a21; 
  font-family: "STKaiti", "楷体", serif;
  font-weight: bold;
  letter-spacing: 2px;
}

/* ================= 3. 身份按钮：木牌质感 ================= */
.identity-tabs { display: flex; justify-content: center; gap: 15px; position: relative; z-index: 2; }
.identity-tabs button { 
  flex: 1; padding: 15px; 
  background: rgba(255,255,255,0.5); 
  border: 1px solid #c8a682; 
  border-radius: 4px; 
  cursor: pointer; transition: 0.3s; 
  display: flex; flex-direction: column; align-items: center; 
}
.identity-tabs button strong { font-size: 16px; color: #444; margin-bottom: 5px; font-family: "STKaiti", "楷体", serif;}
.identity-tabs button span { font-size: 12px; color: #888; }

/* 选中的木牌变成故宫红（朱红） */
.identity-tabs button.active { 
  background: #982a22; 
  border-color: #982a22; 
  box-shadow: 0 4px 10px rgba(152, 42, 34, 0.3); 
}
.identity-tabs button.active strong, .identity-tabs button.active span { color: #fdf6e3; }

/* ================= 4. 调色盘交互特效 ================= */
.color-palette { display: flex; justify-content: center; gap: 20px; position: relative; z-index: 2;}
.color-item { 
  display: flex; flex-direction: column; align-items: center; 
  cursor: pointer; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 10px;
  border-radius: 6px;
  border: 1px solid transparent;
}
.color-item:hover { transform: translateY(-5px); background: rgba(0,0,0,0.02); }
.color-swatch { width: 40px; height: 40px; border-radius: 4px; border: 1px solid #aaa; margin-bottom: 8px; }
.color-name { font-size: 13px; color: #555; font-family: "STKaiti", "楷体", serif;}

/* 画笔选中时的特效：毛笔蘸墨的强调感 */
.is-active-brush {
  border-color: #982a22;
  background: #fff8f5;
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 6px 12px rgba(152, 42, 34, 0.15);
}
.is-active-brush .color-swatch { border: 2px solid #982a22; }

/* ================= 5. SVG 互动区 ================= */
.canvas-section { display: flex; flex-direction: column; align-items: center; }
.subtitle { color: #666; font-size: 15px; margin-bottom: 20px; font-family: "STKaiti", "楷体", serif;}
.svg-container { 
  width: 100%; max-width: 600px; 
  border: 2px solid #dcbfa2; /* 宣纸画框 */
  background: #ffffff; 
  margin-bottom: 20px; position: relative; z-index: 2;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.03); /* 画框内阴影 */
}
.interactive-svg { width: 100%; height: auto; display: block; }
.clickable-part { 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
  cursor: pointer; 
}

/* 💡 修复：当鼠标悬停时，不仅仅是加深轮廓，还要根据当前是否选了颜色给出反馈 */
.clickable-part:hover { 
  /* 增加一个非常淡的宣纸黄底色作为通用的 Hover 态 */
  fill: rgba(230, 194, 128, 0.2) !important; 
  stroke: #982a22; 
  stroke-width: 3;
  /* 增加一点微弱的发光感，提升可点击的心理暗示 */
  filter: drop-shadow(0px 0px 8px rgba(152, 42, 34, 0.4));
}
/* ================= 6. 进度条与提交按钮 ================= */
.progress-container { width: 100%; max-width: 600px; position: relative; z-index: 2;}
.progress-info { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: #555; }
.progress-track { height: 6px; background: #e0d5c1; border-radius: 0; overflow: hidden; }
.progress-fill { height: 100%; background: #3169b2; transition: width 0.5s ease-out; } /* 进度用沉稳的石青色 */

/* 提交按钮：奏折封皮质感 */
.submit-btn {
  margin-top: 25px; width: 100%; padding: 15px; border-radius: 4px; border: 1px solid #7a1f18;
  background: linear-gradient(to bottom, #982A22, #7a1f18); color: #fdf6e3;
  font-size: 18px; font-family: "STKaiti", "楷体", serif; letter-spacing: 2px;
  cursor: pointer; transition: 0.3s;
  box-shadow: 0 4px 10px rgba(122, 31, 24, 0.4);
}
.submit-btn:disabled { background: #bcaaa4; border-color: #a1887f; box-shadow: none; cursor: not-allowed; color: #eee;}
.submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(122, 31, 24, 0.5); }

/* ================= 7. 验收结果（圣旨弹窗） ================= */
.result-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000;
  backdrop-filter: blur(3px);
}
.result-card {
  background: url('https://www.transparenttextures.com/patterns/rice-paper-2.png') #fffaf5;
  width: 450px; border-radius: 4px; padding: 40px 30px; text-align: center;
  position: relative; overflow: hidden; border: 6px double #5c3a21; /* 双层厚重边框 */
}
.result-stamp {
  position: absolute; top: 20px; right: 20px; width: 80px; height: 80px;
  border: 4px solid #d32f2f; color: #d32f2f; font-size: 28px; font-weight: bold;
  display: flex; justify-content: center; align-items: center; border-radius: 8px;
  transform: rotate(-15deg); opacity: 0.85; font-family: "STKaiti", "楷体", serif;
}
.score-circle {
  width: 120px; height: 120px; border-radius: 50%; margin: 20px auto;
  display: flex; justify-content: center; align-items: baseline;
  background: transparent; border: 4px solid #5c3a21; color: #5c3a21; line-height: 112px;
}
.score-circle span { font-size: 50px; font-family: "Georgia", serif; }
.ancient-feedback {
  font-family: "STKaiti", "楷体", serif; font-size: 20px; line-height: 1.6;
  color: #333; margin: 25px 0; text-align: left; text-indent: 2em;
}
.retry-btn {
  padding: 10px 30px; background: transparent; border: 1px solid #5c3a21;
  color: #5c3a21; font-size: 16px; font-family: "STKaiti", "楷体", serif; cursor: pointer; transition: 0.3s;
}
.retry-btn:hover { background: #5c3a21; color: #fdf6e3; }

/* 弹窗状态色彩 */
.result-card.fatal .result-stamp, .result-card.fatal h2 { color: #982a22; border-color: #982a22; }
.result-card.fatal .score-circle { border-color: #982a22; color: #982a22; }
.result-card.perfect .result-stamp, .result-card.perfect h2 { color: #b8860b; border-color: #b8860b; }
.result-card.perfect .score-circle { border-color: #b8860b; color: #b8860b; }

/* ================= 手机端适配 ================= */
@media (max-width: 768px) {
  .identity-tabs { flex-wrap: wrap; }
  .identity-tabs button { min-width: 100px; }
  .color-palette { flex-wrap: wrap; gap: 10px !important; }
}
</style>