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
          <img 
            :src="buildingsData[activeBuildingKey].image" 
            :alt="buildingsData[activeBuildingKey].name" 
            style="width: 90%; height: 90%; object-fit: contain;"
          />
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
        <h3 class="card-title">部位色彩与规制</h3>
        
        <div class="part-list">
          <div 
            class="part-card" 
            v-for="(part, index) in currentBuilding.parts" 
            :key="index"
            :class="{ active: activePartIndex === index }"
            @click="activePartIndex = index"
          >
            <div class="part-header">
              <span class="part-name">{{ part.name }}</span>
              <span class="part-req-tag">{{ part.requirement }}</span>
            </div>
            
            <div class="part-detail-colors" v-if="activePartIndex === index">
              <div class="color-pill" v-for="color in part.colors" :key="color.hex">
                <span class="dot" :style="{ backgroundColor: color.hex }"></span>
                {{ color.fullName }}
              </div>
            </div>

            <div class="part-colors-mini" v-else>
              <div class="color-block" v-for="color in part.colors" :key="color.hex" :style="{ backgroundColor: color.hex }"></div>
            </div>
          </div>
        </div>
      </div>

    </div> <div class="bottom-history card">
      <h3 class="panel-title">🏛️ 史料考证与规制解析</h3>
      <div class="history-content">
        <p class="ancient-text">{{ currentBuilding.historyDesc }}</p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SpecialCase',
  data() {
    return {
      activeBuildingKey: 'taihe', 
      activePartIndex: 0,         

      buildingsData: {
        taihe: {
          name: '太和殿',
          image: '/svg-buildings/taihedian.svg', 
          level: '皇家最高等级宫殿', 
          year: '明永乐十八年 (1420年)',
          colorFeatures: '明黄屋顶，朱红墙柱，檐下青绿点缀',
          ruleText: '该建筑的色彩使用需经皇帝批准，任何僭越使用将被视为谋逆之罪。',
          historyDesc: '《大清会典》卷七十三载：“凡宫殿之制，太和殿、中和殿、保定殿皆覆以黄琉璃瓦，重檐庑殿顶。柱用赤色，檐下施和玺彩画。”太和殿作为皇权之极，其纯黄、纯红的使用，是封建礼制中“垄断性”色彩的最高体现。',
          parts: [
            { name: '屋顶', requirement: '皇家专用', colors: [{ name: '黄', fullName: '明黄琉璃瓦', hex: '#EBA53D' }] },
            { name: '墙体立柱', requirement: '皇家专用', colors: [{ name: '红', fullName: '朱红墙柱', hex: '#982A22' }] },
            { name: '檐下斗拱', requirement: '等级规制', colors: [{ name: '绿', fullName: '青绿彩画', hex: '#408D73' }] },
            { name: '门窗台基', requirement: '皇家特许', colors: [{ name: '白', fullName: '米白门窗', hex: '#E4D29E' }] }
          ]
        },
        zongdushu: {
          name: '直隶总督署',
          image: '/svg-buildings/zongdushu.svg',
          level: '清代最高级别地方军政长官衙署',
          year: '清雍正八年 (1730年)',
          colorFeatures: '青灰底色，深灰大门，两侧朱红明柱点缀',
          ruleText: '地方高级官员建筑严格遵循《大清会典》，以青灰为主，严禁大面积使用黄、朱红等皇家色彩。',
          historyDesc: '《清史稿》舆服志规定：“一品至三品官署，厅堂可覆筒瓦，脊用兽吻；门柱许用黑油或青灰，严禁越级使用朱红及明黄。”直隶总督虽为封疆大吏，但其治所仍需恪守臣子本分，故以青灰砖瓦为主，仅在局部点缀暗红以示威严。',
          parts: [
            { name: '屋顶', requirement: '官员通用', colors: [{ name: '深灰', fullName: '深灰瓦片', hex: '#4D4D4D' }] },
            { name: '建筑主体', requirement: '官员通用', colors: [{ name: '浅灰', fullName: '青灰石墙', hex: '#B3B3B3' }] },
            { name: '大门', requirement: '规制要求', colors: [{ name: '黑灰', fullName: '深灰大门', hex: '#494949' }] },
            { name: '两侧装饰', requirement: '点缀特许', colors: [{ name: '红', fullName: '朱红装饰', hex: '#E60000' }] }
          ]
        },
        tiantan: {
          name: '天坛祈年殿',
          image: '/svg-buildings/tiantan.svg',
          level: '皇家祭祀建筑', 
          year: '明永乐十八年 (1420年)',
          colorFeatures: '深蓝琉璃瓦，鎏金宝顶，朱红底座',
          ruleText: '祭天建筑使用独特的蓝色琉璃瓦，象征“天”，这是超越普通皇宫黄瓦的特殊礼制色彩。',
          historyDesc: '天坛乃祭天之所，其色尚蓝。古人云：“敬天法祖，色取穹苍。”祈年殿三重檐皆覆深蓝琉璃瓦，以象皇天。这种色彩规制超越了凡间的“黄红”皇权体系，代表了古代帝王以“天子”身份与宇宙对话的独特神权色彩体系。',
          parts: [
            { name: '三层屋顶', requirement: '象征天空', colors: [{ name: '深蓝', fullName: '深蓝琉璃瓦', hex: '#202A5A' }] },
            { name: '鎏金宝顶', requirement: '最高神权', colors: [{ name: '金', fullName: '鎏金宝顶', hex: '#E2B854' }] },
            { name: '立柱底座', requirement: '皇家祭祀', colors: [{ name: '红', fullName: '朱红立柱', hex: '#9B2822' }] },
            { name: '夹层点缀', requirement: '皇家祭祀', colors: [{ name: '浅绿', fullName: '浅绿额枋', hex: '#91B68F' }] }
          ]
        }
      }
    }
  },
  computed: {
    currentBuilding() {
      return this.buildingsData[this.activeBuildingKey];
    },
    currentPart() {
      return this.currentBuilding.parts[this.activePartIndex];
    }
  },
  methods: {
    switchBuilding(key) {
      this.activeBuildingKey = key;
      this.activePartIndex = 0; 
    }
  }
}
</script>

<style scoped>
/* ================= 1. 全局：宣纸底色，无缝衔接 ================= */
.special-case-wrapper { 
  padding: 40px; 
  /* 继承项目的米黄宣纸底色，去掉原来的死板灰色 */
  background: transparent; 
  min-height: 100vh; 
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* 书法质感大标题 */
.page-title { 
  text-align: center; 
  color: #3a080a; /* 极深的暗红/黑檀色 */
  font-size: 32px; 
  margin-bottom: 30px; 
  font-family: "STXingkai", "华文行楷", "STKaiti", "楷体", serif;
  letter-spacing: 4px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1); 
}

/* ================= 2. 顶部导航栏：木牌印章质感 ================= */
.building-tabs { display: flex; justify-content: center; gap: 15px; margin-bottom: 30px; position: relative; z-index: 2;}
.building-tabs button { 
  padding: 10px 30px; 
  background: rgba(253, 246, 227, 0.6); 
  border: 1px solid #c8a682; /* 暗金边框 */
  border-radius: 4px; /* 古风方正圆角 */
  font-size: 16px; font-weight: bold; 
  color: #5c3a21; /* 檀褐色 */
  font-family: "STKaiti", "楷体", serif; letter-spacing: 2px;
  cursor: pointer; transition: 0.3s; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.05); 
}
/* 选中时变成“朱砂红” */
.building-tabs button.active { 
  background: #982a22; 
  color: #fdf6e3; 
  border-color: #982a22;
  box-shadow: 0 4px 10px rgba(152, 42, 34, 0.3); 
}

/* ================= 3. 通用卡片：绢丝装裱质感 ================= */
.card { 
  background: url('https://www.transparenttextures.com/patterns/rice-paper-2.png') #fffcf9; 
  border-radius: 4px; 
  padding: 25px; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.04); 
  border: 1px solid #dcbfa2; 
  position: relative;
}
/* 内层绢丝线框 */
.card::before {
  content: ''; position: absolute; top: 6px; left: 6px; right: 6px; bottom: 6px;
  border: 1px solid rgba(220, 191, 162, 0.4); pointer-events: none;
}
.card-title { 
  text-align: center; font-size: 20px; margin-top: 0; margin-bottom: 25px; 
  color: #5c3a21; font-family: "STKaiti", "楷体", serif; font-weight: bold; letter-spacing: 2px;
}

/* ================= 4. 三列布局 ================= */
.content-layout { display: flex; gap: 20px; margin-bottom: 20px; }
.col-left { flex: 1; }
.col-middle { flex: 1.5; display: flex; flex-direction: column; align-items: center; position: relative; }
.col-right { flex: 1; }

/* --- 左侧：典籍批注面板 --- */
.info-item { margin-bottom: 20px; }
.info-label { font-size: 14px; color: #982a22; font-family: "STKaiti", serif; font-weight: bold; margin-bottom: 5px; }
.info-value { 
  font-size: 15px; color: #333; 
  background: rgba(220, 191, 162, 0.15); /* 淡淡的缃色底 */
  padding: 10px 12px; border-radius: 4px; border: 1px solid rgba(220, 191, 162, 0.3);
}
.rule-box { 
  border-left: 4px solid #982a22; /* 皇家红警示线 */
  margin-top: 30px; background: #fff8f5; padding: 15px; border-radius: 0 4px 4px 0; 
}
.rule-title { color: #982a22; font-weight: bold; font-family: "STKaiti", serif; font-size: 15px; margin-bottom: 5px; }
.rule-text { font-size: 13px; color: #555; line-height: 1.6; }

/* --- 中间：建筑线稿展示框 --- */
.sketch-box { 
  width: 100%; height: 300px; 
  display: flex; justify-content: center; align-items: center; 
  /* 去掉死白的底色，让图片融进背景宣纸里 */
  background: transparent; margin-bottom: 20px; 
}
.mini-summary-box { 
  border: 2px solid #982a22; border-radius: 4px; padding: 15px 30px; 
  text-align: center; background: #fffcf9; width: 60%; position: relative; z-index: 2;
  box-shadow: 0 4px 10px rgba(152, 42, 34, 0.1);
}
.summary-title { font-size: 18px; font-weight: bold; color: #982a22; margin-bottom: 5px; font-family: "STKaiti", serif;}
.summary-desc { font-size: 13px; color: #666; margin-bottom: 15px; }
.color-dots { display: flex; justify-content: center; gap: 10px; margin-top: 5px; }
.dot { width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-size: 12px; border: 1px solid rgba(0,0,0,0.2); }

/* --- 右侧：折叠卷宗（手风琴列表） --- */
.part-list { display: flex; flex-direction: column; gap: 15px; }
.part-card { 
  border: 1px solid #dcbfa2; border-radius: 4px; padding: 15px; cursor: pointer; transition: 0.3s; 
  background: rgba(255,255,255,0.5);
}
.part-card:hover { border-color: #982a22; background: #fffcf9; }
.part-card.active { border: 2px solid #982a22; background-color: #fff8f5; box-shadow: 0 2px 8px rgba(152, 42, 34, 0.1);}

.part-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.part-name { font-weight: bold; color: #333; font-size: 16px; font-family: "STKaiti", serif;}
.part-req-tag { 
  font-size: 12px; background: rgba(220, 191, 162, 0.2); padding: 2px 8px; border-radius: 4px; 
  color: #5c3a21; border: 1px solid #dcbfa2;
}
.part-card.active .part-req-tag { background: #982a22; color: white; border-color: #982a22; }

.part-colors-mini { display: flex; gap: 8px; margin-top: 10px; }
.color-block { width: 20px; height: 20px; border-radius: 2px; border: 1px solid rgba(0,0,0,0.2); box-shadow: 1px 1px 3px rgba(0,0,0,0.1); }

.part-detail-colors { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #dcbfa2; }
.color-pill { display: flex; align-items: center; gap: 8px; background: white; padding: 5px 10px; border-radius: 4px; border: 1px solid #dcbfa2; font-size: 13px; color: #333; }
.color-pill .dot { width: 16px; height: 16px; border-radius: 50%; display: inline-block; border: 1px solid #ccc; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1); }

/* ================= 5. 底部：史料考证卡片 (厚重古籍风) ================= */
.bottom-history { 
  margin-top: 10px; 
  background: url('https://www.transparenttextures.com/patterns/rice-paper-2.png') #fffaf5; 
  border: 6px double #5c3a21; /* 双层厚重边框 */
  border-radius: 4px;
}
.panel-title { 
  font-size: 20px; color: #5c3a21; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; 
  font-family: "STKaiti", "楷体", serif; font-weight: bold;
}
.history-content { padding: 15px 20px; }
.ancient-text { 
  font-family: "STKaiti", "楷体", serif; font-size: 18px; line-height: 1.8; 
  color: #333; text-indent: 2em; letter-spacing: 1.5px; 
}

/* ================= 手机端适配 ================= */
@media (max-width: 768px) {
  .content-layout { flex-direction: column !important; }
  .building-tabs { flex-wrap: wrap; }
  .building-tabs button { padding: 8px 15px !important; font-size: 14px !important; }
  .mini-summary-box { width: 90% !important; }
}
</style>