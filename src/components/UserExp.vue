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
      <h3>当前身份可用颜色</h3>
      <div class="color-palette">
        <div class="color-item" v-for="colorId in currentRole.allowedColors" :key="colorId">
          <div class="color-swatch" :style="{ backgroundColor: allColors[colorId].hex }"></div>
          <span class="color-name">{{ allColors[colorId].name }}</span>
        </div>
      </div>
    </div>

    <div class="card canvas-section">
      <h3>建筑配色详图 - {{ currentRole.name }}</h3>
      <p class="subtitle">点击建筑各个部位进行配色 </p>

      <div class="svg-container">
        <svg viewBox="0 0 803 670" xmlns="http://www.w3.org/2000/svg" class="interactive-svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="none" stroke="#f0f0f0" stroke-width="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <rect 
            x="177" y="234" width="426" height="251" 
            :fill="partsData['wall'].currentColor || '#ffffff'" 
            stroke="black" stroke-width="2"
            class="clickable-part"
            @click="openColorModal('wall')" 
          />
          <text x="390" y="220" font-size="20" fill="#666" pointer-events="none" text-anchor="middle">主墙体</text>

          <g 
            :fill="partsData['doorsAndWindows'].currentColor || '#ffffff'" 
            stroke="black" stroke-width="2"
            class="clickable-part"
            @click="openColorModal('doorsAndWindows')"
          >
            <path d="M397 289H347V486H397M397 289H447V486H397M397 289V486"/>
            <path d="M417 384V373H408V384H417Z" />
            <path d="M379 373V384H387V373H379Z" />
            <path d="M222.5 302V288.5H288.5V302M222.5 302H288.5M222.5 302V407M288.5 302V407M507.5 302V288.5H559V302M507.5 302H559M507.5 302V407M559 302V407M222.5 407V417H288.5V407M222.5 407H288.5M507.5 407V417H559V407M507.5 407H559"/>
          </g>

          <g 
            :fill="partsData['base'].currentColor || '#ffffff'" 
            class="clickable-part"
            @click="openColorModal('base')"
          >
            <path d="M651 539H136V513H651V539Z" stroke="black" stroke-width="2"/>
            <path d="M632 513H153V486H632V513Z" stroke="black" stroke-width="2"/>
          </g>
          <text x="390" y="580" font-size="20" fill="#666" pointer-events="none" text-anchor="middle">台基</text>

          <g 
            :fill="partsData['pillars'].currentColor || '#ffffff'" 
            class="clickable-part"
            @click="openColorModal('pillars')"
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
            @click="openColorModal('roof')"
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
      </div>
    </div>

    <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="color-modal">
        <div class="modal-header">
          <h3>选择颜色材料</h3>
          <p>为 <strong>{{ partsData[activePartId]?.name }}</strong> 选择合适的颜色</p>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <div class="modal-body">
          <h4 style="color: #2ca02c;">● 可使用的颜色材料</h4>
          <div class="modal-color-grid">
            <div 
              class="modal-color-card allowed" 
              v-for="colorId in currentRole.allowedColors" :key="colorId"
              @click="applyColor(colorId)"
            >
              <div class="card-swatch" :style="{ backgroundColor: allColors[colorId].hex }"></div>
              <div class="card-info">
                <strong>{{ allColors[colorId].fullName }}</strong>
                <span>{{ allColors[colorId].name }}</span>
              </div>
            </div>
          </div>

          <h4 style="color: #d32f2f; margin-top: 20px;">● 禁用的颜色材料</h4>
          <div class="modal-color-grid">
            <div 
              class="modal-color-card forbidden" 
              v-for="colorId in forbiddenColors" :key="colorId"
            >
              <div class="card-swatch" :style="{ backgroundColor: allColors[colorId].hex, opacity: 0.5 }">
                <span class="forbidden-icon">⃠</span>
              </div>
              <div class="card-info" style="color: #999;">
                <strong>{{ allColors[colorId].fullName }}</strong>
                <span style="color: #d32f2f; font-size: 12px;">等级不足，禁止使用</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'UserExp',
  data() {
    return {
      // --- 数据库 1：定义游戏里所有的颜色 ---
      allColors: {
        'yellow': { name: '黄色', fullName: '黄色琉璃瓦', hex: '#ffbb00' },
        'red':    { name: '朱红色', fullName: '朱红漆料', hex: '#ff5e00' },
        'green':  { name: '绿色', fullName: '绿色琉璃瓦', hex: '#2ca02c' },
        'blue':   { name: '青色', fullName: '青色瓦片', hex: '#0088cc' },
        'grey':   { name: '灰色', fullName: '灰黑瓦片', hex: '#666666' },
        'black':  { name: '黑色', fullName: '黑漆', hex: '#333333' }
      },

      // --- 数据库 2：定义各个阶级的权限 ---
      roles: [
        { name: '皇帝', allowedColors: ['yellow', 'red', 'green', 'blue', 'grey', 'black'] },
        { name: '亲王', allowedColors: ['red', 'green', 'blue', 'grey', 'black'] },
        { name: '一品大员', allowedColors: ['green', 'blue', 'grey', 'black'] },
        { name: '富户', allowedColors: ['grey', 'black'] },
        { name: '庶民', allowedColors: ['grey'] }
      ],
      currentRole: null, // 马上在 created 里初始化

      // --- 数据库 3：定义建筑的各个部位  ---
      partsData: {
  roof: { name: '屋顶', currentColor: null },
  pillars: { name: '立柱', currentColor: null },
  wall: { name: '主墙体', currentColor: null },
  doorsAndWindows: { name: '门窗', currentColor: null },
  base: { name: '台基', currentColor: null }
},
      totalParts: 27, 

    
      showModal: false,
      activePartId: null 
    }
  },
  created() {
   this.currentRole = this.roles[0];
  },
  computed: {
    forbiddenColors() {
      const allColorIds = Object.keys(this.allColors);
      return allColorIds.filter(id => !this.currentRole.allowedColors.includes(id));
    },
    coloredCount() {
      let count = 0;
      for (const key in this.partsData) {
        if (this.partsData[key].currentColor !== null) count++;
      }
      return count;
    },
    
    progressPercent() {
      return (this.coloredCount / this.totalParts) * 100;
    }
  },
  methods: {
    // 切换身份时，清空已经涂上的“违规”颜色（可选逻辑，这里简单起见不清空，或者你可以自己加）
    selectRole(role) {
      this.currentRole = role;
    },
    // 点击 SVG 建筑的某个部位，打开弹窗
    openColorModal(partId) {
      this.activePartId = partId;
      this.showModal = true;
    },
    // 关闭弹窗
    closeModal() {
      this.showModal = false;
      this.activePartId = null;
    },
    // 在弹窗里点击颜色，给建筑上色！
    applyColor(colorId) {
      const hexColor = this.allColors[colorId].hex;
      this.partsData[this.activePartId].currentColor = hexColor;
      this.closeModal(); // 上色完毕，自动关窗
    }
  }
}
</script>

<style scoped>
.user-exp-wrapper { padding: 40px; background-color: #f0f2f5; min-height: 100vh; }
.page-title { text-align: center; color: white; font-size: 24px; margin-bottom: 30px; text-shadow: 1px 1px 3px rgba(0,0,0,0.3); }
.card { background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.card h3 { text-align: center; font-size: 18px; margin-top: 0; margin-bottom: 20px; color: #333; }

/* 身份按钮 */
.identity-tabs { display: flex; justify-content: center; gap: 15px; }
.identity-tabs button { flex: 1; padding: 15px; border: 1px solid #ebeef5; background: #fdfdfd; border-radius: 8px; cursor: pointer; transition: 0.3s; display: flex; flex-direction: column; align-items: center; }
.identity-tabs button strong { font-size: 16px; color: #333; margin-bottom: 5px; }
.identity-tabs button span { font-size: 12px; color: #999; }
.identity-tabs button.active { background: linear-gradient(135deg, #ff8c00, #ff5e00); border-color: #ff5e00; box-shadow: 0 4px 10px rgba(255, 94, 0, 0.3); }
.identity-tabs button.active strong, .identity-tabs button.active span { color: white; }

/* 颜色预览 */
.color-palette { display: flex; justify-content: center; gap: 20px; }
.color-item { display: flex; flex-direction: column; align-items: center; }
.color-swatch { width: 40px; height: 40px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 8px; }
.color-name { font-size: 12px; color: #666; }

/* 互动 SVG 画板 */
.canvas-section { display: flex; flex-direction: column; align-items: center; }
.subtitle { color: #666; font-size: 14px; margin-bottom: 20px; }
.svg-container { width: 100%; max-width: 600px; border: 1px solid #ebeef5; border-radius: 8px; background: white; margin-bottom: 20px; overflow: hidden; }
.interactive-svg { width: 100%; height: auto; display: block; }


.clickable-part { transition: all 0.3s; cursor: pointer; }
.clickable-part:hover { fill: rgba(255, 94, 0, 0.2) !important; stroke: #ff5e00; }

/* 进度条 */
.progress-container { width: 100%; max-width: 600px; }
.progress-info { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: #555; }
.progress-track { height: 8px; background: #ebeef5; border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: #0088cc; transition: width 0.5s ease-out; }

/* 弹窗样式 */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.color-modal { background: white; width: 600px; max-width: 90%; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.modal-header { background: #0088cc; color: white; padding: 20px; position: relative; }
.modal-header h3 { color: white; margin-bottom: 5px; }
.modal-header p { font-size: 14px; opacity: 0.9; margin: 0; }
.close-btn { position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 20px; cursor: pointer; }
.modal-body { padding: 20px; max-height: 60vh; overflow-y: auto; }
.modal-color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 15px; margin-top: 15px; }
.modal-color-card { border: 1px solid #ebeef5; border-radius: 8px; padding: 10px; display: flex; flex-direction: column; align-items: center; }
.modal-color-card.allowed { cursor: pointer; transition: 0.3s; }
.modal-color-card.allowed:hover { border-color: #0088cc; box-shadow: 0 2px 8px rgba(0,136,204,0.1); transform: translateY(-2px); }
.card-swatch { width: 100%; height: 60px; border-radius: 6px; margin-bottom: 10px; display: flex; justify-content: center; align-items: center; border: 1px solid #eee; }
.forbidden-icon { color: white; font-size: 30px; font-weight: bold; }
.card-info { text-align: center; display: flex; flex-direction: column; }
.card-info strong { font-size: 14px; color: #333; }
.card-info span { font-size: 12px; color: #666; margin-top: 4px; }
@media (max-width: 768px) {
  .identity-tabs {
    flex-wrap: wrap; /* 身份按钮空间不够就换行 */
  }

  .identity-tabs button {
    min-width: 100px;
  }

  .color-palette {
    flex-wrap: wrap;
    gap: 10px !important;
  }

  .modal-color-grid {
    grid-template-columns: 1fr 1fr !important; /* 弹窗里的颜色变两列 */
  }
}
</style>