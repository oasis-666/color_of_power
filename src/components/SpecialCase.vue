<template>
  <div class="special-case-wrapper">
    <h2 class="page-title">典型建筑特例分析</h2>
    <div class="building-tabs">
      <button 
        v-for="(building, key) in buildingsData" 
        :key="key"
        :class="{ active: activeBuildingKey === key }"
        @click="switchBuilding(key)"
      >
        {{ building.name }}
      </button>
    </div>

    <div class="content-layout">
      
      <div class="col-left card">
        <h3 class="card-title">{{ currentBuilding.name }}信息</h3>
        
        <div class="info-item">
          <div class="info-label">建筑等级</div>
          <div class="info-value">{{ currentBuilding.level }}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">建造年代</div>
          <div class="info-value">{{ currentBuilding.year }}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">色彩特点</div>
          <div class="info-value">{{ currentBuilding.colorFeatures }}</div>
        </div>
        
        <div class="rule-box">
          <div class="rule-title">等级规定</div>
          <div class="rule-text">{{ currentBuilding.ruleText }}</div>
        </div>
      </div>

      <div class="col-middle card">
        <h3 class="card-title">{{ currentBuilding.name }}</h3>
        
        <div class="sketch-box">
          <div class="placeholder-img">此处放置 {{ currentBuilding.name }} 的线稿图</div>
        </div>

        <div class="mini-summary-box">
          <div class="summary-title">{{ currentPart.name }}</div>
          <div class="summary-desc">等级要求：<strong>{{ currentPart.requirement }}</strong></div>
          <div class="summary-colors">
            <span style="font-size: 12px; color: #666;">允许颜色：</span>
            <div class="color-dots">
              <div class="dot" v-for="color in currentPart.colors" :key="color.hex" :style="{ backgroundColor: color.hex }">
                {{ color.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-right card">
        <h3 class="card-title">部位色彩数据</h3>
        
        <div class="part-list">
          <div 
            class="part-card" 
            v-for="(part, index) in currentBuilding.parts" 
            :key="index"
            :class="{ active: activePartIndex === index }"
            @click="activePartIndex = index"
          >
            <div class="part-name">{{ part.name }}</div>
            <div class="part-req">{{ part.requirement }}</div>
            <div class="part-colors">
              <div class="color-block" v-for="color in part.colors" :key="color.hex" :style="{ backgroundColor: color.hex }"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="bottom-panel card">
      <h3 class="panel-title">建筑部位选择器</h3>
      
      <div class="part-tabs">
        <button 
          v-for="(part, index) in currentBuilding.parts" 
          :key="index"
          :class="{ active: activePartIndex === index }"
          @click="activePartIndex = index"
        >
          <strong>{{ part.name }}</strong>
          <span>{{ part.requirement }}</span>
        </button>
      </div>

      <div class="part-detail-box">
        <div class="detail-header">
          <span class="detail-name">{{ currentPart.name }} - 颜色等级规则</span>
        </div>
        <div class="detail-content">
          <div class="req-text">等级要求：<strong>{{ currentPart.requirement }}</strong></div>
          <div class="allow-text">允许颜色数：<strong>{{ currentPart.colors.length }}种</strong></div>
        </div>
        <div class="detail-colors">
          <div class="color-pill" v-for="color in currentPart.colors" :key="color.hex">
            <span class="dot" :style="{ backgroundColor: color.hex }"></span>
            {{ color.fullName }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SpecialCase',
  data() {
    return {
      // 1. 记住当前选中的建筑和部位
      activeBuildingKey: 'taihe', // 默认选中太和殿
      activePartIndex: 0,         // 默认选中第一个部位（比如屋顶）

      // 2. 超级数据库：包含了三个建筑的所有文字和颜色信息！
      buildingsData: {
        taihe: {
          name: '太和殿',
          level: '皇家最高等级宫殿', year: '明永乐十八年 (1420年)',
          colorFeatures: '黄色琉璃瓦顶，朱红墙体，金龙彩绘',
          ruleText: '该建筑的色彩使用需经皇帝批准，任何僭越使用将被视为谋逆之罪。',
          parts: [
            { name: '屋顶', requirement: '皇家专用', colors: [{ name: '黄', fullName: '黄色琉璃瓦', hex: '#ffbb00' }] },
            { name: '墙体', requirement: '皇家专用', colors: [{ name: '红', fullName: '朱红墙体', hex: '#ff5e00' }] },
            { name: '立柱', requirement: '皇家专用', colors: [{ name: '红', fullName: '朱红立柱', hex: '#ff5e00' }] },
            { name: '台基', requirement: '皇家专用', colors: [{ name: '白', fullName: '汉白玉', hex: '#ffffff' }] }
          ]
        },
        foguang: {
          name: '佛光寺东大殿',
          level: '唐代木构建筑珍品', year: '唐大中十一年 (857年)',
          colorFeatures: '青灰瓦顶，经特许使用彩绘斗拱',
          ruleText: '该建筑的色彩使用需经皇帝批准，任何僭越使用将被视为谋逆之罪。',
          parts: [
            { name: '屋顶', requirement: '寺庙建筑', colors: [{ name: '青', fullName: '青色瓦片', hex: '#3169b2' }, { name: '灰', fullName: '灰黑瓦片', hex: '#666666' }] },
            { name: '斗拱', requirement: '经皇帝恩准', colors: [{ name: '红', fullName: '朱红漆', hex: '#ff5e00' }, { name: '黄', fullName: '黄色点缀', hex: '#ffbb00' }] },
            { name: '墙体', requirement: '寺庙建筑', colors: [{ name: '灰', fullName: '灰砖', hex: '#666666' }, { name: '白', fullName: '白墙', hex: '#ffffff' }] },
            { name: '门', requirement: '寺庙建筑', colors: [{ name: '红', fullName: '红漆', hex: '#ff5e00' }, { name: '黑', fullName: '黑漆', hex: '#333333' }] }
          ]
        },
        tiantan: {
          name: '天坛祈年殿',
          level: '皇家祭祀建筑', year: '明永乐十八年 (1420年)',
          colorFeatures: '三层屋顶，上二层黄色，下层蓝色象征天',
          ruleText: '该建筑的色彩使用需经皇帝批准，任何僭越使用将被视为谋逆之罪。',
          parts: [
            { name: '顶层屋顶', requirement: '皇家祭祀', colors: [{ name: '黄', fullName: '黄色琉璃瓦', hex: '#ffbb00' }] },
            { name: '中层屋顶', requirement: '皇家祭祀', colors: [{ name: '黄', fullName: '黄色琉璃瓦', hex: '#ffbb00' }] },
            { name: '底层屋顶', requirement: '象征天空', colors: [{ name: '青', fullName: '蓝色琉璃瓦', hex: '#0088cc' }] },
            { name: '朱红立柱', requirement: '皇家祭祀', colors: [{ name: '红', fullName: '朱红漆', hex: '#ff5e00' }] }
          ]
        }
      }
    }
  },
  computed: {
    // 魔法计算器：自动根据 activeBuildingKey 提取出当前的建筑数据
    currentBuilding() {
      return this.buildingsData[this.activeBuildingKey];
    },
    // 魔法计算器：自动根据 activePartIndex 提取出当前的部位数据
    currentPart() {
      return this.currentBuilding.parts[this.activePartIndex];
    }
  },
  methods: {
    switchBuilding(key) {
      this.activeBuildingKey = key;
      this.activePartIndex = 0; // 切换建筑时，默认把部位重置回第一个
    }
  }
}
</script>

<style scoped>
/* ================= 页面基础与顶部 ================= */
.special-case-wrapper { padding: 40px; background-color: #f0f2f5; min-height: 100vh; }
.page-title { text-align: center; color: white; font-size: 24px; margin-bottom: 20px; text-shadow: 1px 1px 3px rgba(0,0,0,0.3); }
.building-tabs { display: flex; justify-content: center; gap: 15px; margin-bottom: 30px; }
.building-tabs button { padding: 10px 30px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; background: white; color: #666; cursor: pointer; transition: 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.building-tabs button.active { background: #ff5e00; color: white; }

/* ================= 通用卡片 ================= */
.card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.card-title { text-align: center; font-size: 18px; margin-top: 0; margin-bottom: 25px; color: #333; }

/* ================= 中间三列布局 ================= */
.content-layout { display: flex; gap: 20px; margin-bottom: 20px; }
.col-left { flex: 1; }
.col-middle { flex: 1.5; display: flex; flex-direction: column; align-items: center; position: relative; }
.col-right { flex: 1; }

/* 左侧信息 */
.info-item { margin-bottom: 20px; }
.info-label { font-size: 13px; color: #ff5e00; font-weight: bold; margin-bottom: 5px; }
.info-value { font-size: 15px; color: #333; background: #f9f9f9; padding: 10px; border-radius: 6px; }
.rule-box { border-left: 4px solid #ff5e00; padding-left: 15px; margin-top: 30px; background: #fff8f5; padding: 15px; border-radius: 0 8px 8px 0; }
.rule-title { color: #d32f2f; font-weight: bold; font-size: 14px; margin-bottom: 5px; }
.rule-text { font-size: 13px; color: #666; line-height: 1.6; }

/* 中间简笔画 */
.sketch-box { width: 100%; height: 300px; border: 2px dashed #ddd; border-radius: 8px; display: flex; justify-content: center; align-items: center; background: #fafafa; margin-bottom: 20px; }
.placeholder-img { color: #999; font-size: 14px; }
.mini-summary-box { border: 2px solid #ff5e00; border-radius: 8px; padding: 15px 30px; text-align: center; background: white; width: 60%; }
.summary-title { font-size: 18px; font-weight: bold; color: #ff5e00; margin-bottom: 5px; }
.summary-desc { font-size: 13px; color: #666; margin-bottom: 15px; }
.color-dots { display: flex; justify-content: center; gap: 10px; margin-top: 5px; }
.dot { width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-size: 12px; border: 1px solid #ddd; }

/* 右侧部位列表 */
.part-list { display: flex; flex-direction: column; gap: 15px; }
.part-card { border: 1px solid #ebeef5; border-radius: 8px; padding: 15px; cursor: pointer; transition: 0.3s; }
.part-card:hover { border-color: #ffbb00; }
.part-card.active { border: 2px solid #ff5e00; background-color: #fff8f5; }
.part-name { font-weight: bold; color: #333; font-size: 15px; margin-bottom: 5px; }
.part-req { font-size: 12px; color: #666; margin-bottom: 10px; }
.part-colors { display: flex; gap: 8px; }
.color-block { width: 20px; height: 20px; border-radius: 4px; border: 1px solid #ddd; }

/* ================= 底部面板 ================= */
.bottom-panel { display: flex; flex-direction: column; align-items: center; }
.panel-title { font-size: 16px; margin-bottom: 20px; color: #333; }
.part-tabs { display: flex; gap: 15px; margin-bottom: 20px; width: 100%; justify-content: center; }
.part-tabs button { flex: 1; max-width: 200px; display: flex; flex-direction: column; align-items: center; padding: 15px; border: 1px solid #ebeef5; background: white; border-radius: 8px; cursor: pointer; transition: 0.3s; }
.part-tabs button strong { font-size: 16px; color: #333; margin-bottom: 5px; }
.part-tabs button span { font-size: 12px; color: #999; }
.part-tabs button.active { background: #ff5e00; border-color: #ff5e00; }
.part-tabs button.active strong, .part-tabs button.active span { color: white; }

/* 详细规则框 */
.part-detail-box { width: 100%; border: 1px solid #7cb5ec; border-radius: 8px; padding: 20px; background: #f2f8fe; }
.detail-header { font-weight: bold; color: #3169b2; margin-bottom: 15px; font-size: 16px; }
.detail-content { display: flex; gap: 40px; font-size: 14px; color: #555; margin-bottom: 15px; }
.detail-colors { display: flex; gap: 20px; }
.color-pill { display: flex; align-items: center; gap: 8px; background: white; padding: 5px 15px; border-radius: 20px; border: 1px solid #ddd; font-size: 14px; }
</style>