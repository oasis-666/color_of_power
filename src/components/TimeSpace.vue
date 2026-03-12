<template>
  <div class="dashboard-wrapper">

    
    <div class="top-dashboard">
      
      <div class="left-column">
        
        <div class="card level-card">
          <h3 class="card-title">🎖️ 建築色彩等級</h3>
          <div class="level-list">
            <div class="level-item" v-for="(item, index) in colorLevels" :key="index">
              <div class="level-rank" :style="{ backgroundColor: item.color }">{{ index + 1 }}</div>
              <div class="level-info">
                <div class="level-name-val">
                  <span>{{ item.name }}</span>
                  <span class="level-val">{{ item.value }} 座</span>
                </div>
                <div class="progress-bg">
                  <div class="progress-bar" :style="{ width: item.percent, backgroundColor: item.color }"></div>
                </div>
              </div>
            </div>
          </div>
          <div style="text-align: center; font-size: 12px; color: #999; margin-top: 15px;">
            等級越高，建築數量越少，色彩越尊貴
          </div>
        </div>
        
        <div class="card core-color-card">
          <h3 class="card-title">📈 核心色彩</h3>
          <div class="color-grid">
            <div class="color-box" style="color: #ffbb00;">黃</div>
            <div class="color-box" style="color: #ff5e00;">紅</div>
            <div class="color-box" style="color: #2ca02c;">綠</div>
            <div class="color-box" style="color: #0088cc;">青</div>
          </div>
          <div class="tag-group">
            <span class="tag">琉璃</span>
            <span class="tag" style="color: #ff5e00; border-color: #ff5e00;">朱紅</span>
            <span class="tag">等級</span>
            <span class="tag" style="color: #ffbb00; border-color: #ffbb00;">皇權</span>
          </div>
        </div>

        <div class="card qing-data-card">
          <h3 class="card-title">📊 清朝數據</h3>
          <div class="data-list">
            <div class="data-item"><span>建築總數</span><strong>7,498 座</strong></div>
            <div class="data-item"><span>使用黃色</span><strong style="color: #ffbb00;">127 座</strong></div>
            <div class="data-item"><span>使用紅色</span><strong style="color: #ff5e00;">892 座</strong></div>
            <div class="data-item"><span>使用綠色</span><strong style="color: #2ca02c;">516 座</strong></div>
          </div>
        </div>

      


        
      </div>

      <div class="center-column">
        <div class="card map-card">
          <h2 class="map-title">中国古建筑色彩地理分布</h2>
         <div ref="mapBox" style="width: 100%; flex: 1; min-height: 550px;"></div>
        </div>
      </div>

      <div class="right-column">
        
        <div class="card radar-card">
          <h3 class="card-title">色彩使用分析 - 清朝</h3>
          
          <div ref="radarBox" style="width: 100%; height: 250px;"></div>
        </div>
        

        <div class="card stats-card">
          <h3 class="card-title">等级数据统计</h3>
          <div ref="statsBox" style="width: 100%; height: 260px;"></div>
        </div>
      </div>
    </div>
   <div class="bottom-analysis">
      <div class="card analysis-card">
        <h2 class="analysis-title">{{ currentChartTitle }}</h2>
        
        <div class="analysis-tabs">
          <button :class="{ active: currentTab === '朝代对比' }" @click="switchTab('朝代对比')">朝代对比</button>
          <button :class="{ active: currentTab === '历史趋势' }" @click="switchTab('历史趋势')">历史趋势</button>
          <button :class="{ active: currentTab === '区域分布' }" @click="switchTab('区域分布')">区域分布</button>
          <button :class="{ active: currentTab === '材料成本' }" @click="switchTab('材料成本')">材料成本</button>
        </div>

        <div class="big-chart-container">
          <div ref="bottomBox" style="width: 100%; height: 400px;"></div>
        </div>

        <div class="data-description">
          <strong>数据说明：</strong>
          <p>{{ currentDescription }}</p>
        </div>
      </div>
    </div>
    

    <div class="timeline-section">
      <div class="timeline-header">
        <h3>朝代时间轴</h3>
        <button class="autoplay-btn" :class="{ playing: isPlaying }" @click="toggleAutoPlay">
          {{ isPlaying ? '⏸ 暂停播放' : '▶ 自动播放' }}
        </button>
      </div>

      <div class="timeline-track">
        <div class="track-line"></div> <div class="dynasty-node" v-for="(dynasty, index) in dynasties" :key="index" @click="selectDynasty(index)">
          
          <div class="node-circle" :class="{ active: currentDynastyIndex === index }" :style="{ backgroundColor: dynasty.color }">
            {{ dynasty.short }}
          </div>
          
          <div class="node-text">
            <div class="d-name" :class="{ active: currentDynastyIndex === index }">{{ dynasty.name }}</div>
            <div class="d-time">{{ dynasty.time }}</div>
            <div class="d-dot" v-if="currentDynastyIndex === index"></div>
          </div>

        </div>
      </div>

      <div class="current-status">
        当前查看：<span :style="{ color: dynasties[currentDynastyIndex].color }"><strong>{{ dynasties[currentDynastyIndex].name }}</strong></span>
      </div>
    </div>

</div>
  
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'TimeSpace',
  
  // 1. Vue 的记忆中枢：存储当前的状态和所有文字
  data() {
    return {
      colorLevels: [
        { name: '皇家', value: 127, percent: '10%', color: '#ffbb00' },
        { name: '王公', value: 389, percent: '25%', color: '#2ca02c' },
        { name: '官员', value: 892, percent: '50%', color: '#0088cc' },
        { name: '富户', value: 1567, percent: '75%', color: '#666666' },
        { name: '平民', value: 4523, percent: '100%', color: '#333333' }
      ],
      currentTab: '朝代对比', // 默认选中第一个
      // 🌟 新增：时间轴的数据大脑
      dynasties: [
        { short: '唐', name: '唐朝', time: '618-907', color: '#ffbb00' }, // 黄色
        { short: '宋', name: '宋朝', time: '960-1279', color: '#0088cc' }, // 蓝色
        { short: '元', name: '元朝', time: '1271-1368', color: '#2ca02c' }, // 绿色
        { short: '明', name: '明朝', time: '1368-1644', color: '#ff5e00' }, // 橙色
        { short: '清', name: '清朝', time: '1644-1912', color: '#ffbb00' }  // 黄色
      ],
      currentDynastyIndex: 0, // 当前选中的朝代编号（0就是唐朝）
      isPlaying: false,       // 记录现在是不是正在自动播放
      timer: null,            // 存放闹钟的专属变量
      
      // 配置四张图表的标题和说明文字
      tabInfo: {
        '朝代对比': {
          title: '各朝代建筑等级分布对比',
          desc: '展示唐、宋、元、明、清五个朝代的建筑等级分布情况，数据基于历史文献记载和现存建筑统计。'
        },
        '历史趋势': {
          title: '历代色彩使用趋势变化',
          desc: '追踪从唐代至清末不同色彩建筑材料的使用数量变化，反映礼制演变与建筑技术发展。'
        },
        '区域分布': {
          title: '主要区域建筑等级分布',
          desc: '对比北京、陕西、江苏、浙江、山西五个重要历史区域的建筑等级分布特点。'
        },
        '材料成本': {
          title: '建筑材料成本与工艺分析',
          desc: '分析不同色彩建筑材料的经济成本、制作工艺难度和材料稀有程度（指数化表示）。'
        }
      }
    }
  },

  // 计算属性：根据当前的 Tab 自动算出应该显示的标题和说明
  computed: {
    currentChartTitle() { return this.tabInfo[this.currentTab].title; },
    currentDescription() { return this.tabInfo[this.currentTab].desc; }
  },
  
  mounted() {
    this.initRadarChart();
    this.initStatsChart();
    this.initMapChart();
    
    // 初始化底部的大图表！
    this.initAnalysisChart();
    
    window.addEventListener('resize', () => {
      if(this.radarChart) this.radarChart.resize();
      if(this.statsChart) this.statsChart.resize();
      if(this.mapChart) this.mapChart.resize();
      if(this.analysisChart) this.analysisChart.resize();
    });
  },

  methods: {
    // 保持原来的三个图表函数不变...
    initRadarChart() {
      const chartDom = this.$refs.radarBox;
      if (!chartDom) return;
      this.radarChart = echarts.init(chartDom);
      this.radarChart.setOption({
        radar: {
          indicator: [
            { name: '黄色使用', max: 100 }, { name: '红色', max: 100 },
            { name: '绿色', max: 100 }, { name: '青色', max: 100 },
            { name: '明度', max: 100 }, { name: '饱和度', max: 100 }
          ],
          radius: '60%', center: ['50%', '55%'] 
        },
        series: [{ type: 'radar', data: [{ value: [90, 85, 60, 40, 70, 80], name: '清朝', itemStyle: { color: '#ff5e00' }, areaStyle: { color: 'rgba(255, 94, 0, 0.4)' } }] }]
      });
    },
    initStatsChart() {
      const chartDom = this.$refs.statsBox;
      if (!chartDom) return;
      this.statsChart = echarts.init(chartDom);
      this.statsChart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '15%', bottom: '3%', top: '5%', containLabel: true },
        xAxis: { type: 'value', show: false }, 
        yAxis: { type: 'category', data: ['平民建筑', '富户建筑', '官员建筑', '王公建筑', '皇家建筑'], axisLine: { show: false }, axisTick: { show: false } },
        series: [{ name: '建筑数量', type: 'bar', data: [4523, 1567, 892, 389, 127], barWidth: '40%', itemStyle: { color: '#ff8c00', borderRadius: [0, 10, 10, 0] }, label: { show: true, position: 'right', color: '#666' } }]
      });
    },
    async initMapChart() {
      const chartDom = this.$refs.mapBox;
      if (!chartDom) return;
      this.mapChart = echarts.init(chartDom);
      this.mapChart.showLoading({ text: '正在召唤中国版图...' });
      try {
        const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json');
        const geoJson = await response.json();
        this.mapChart.hideLoading();
        echarts.registerMap('china', geoJson);
        this.mapChart.setOption({
          tooltip: { trigger: 'item', formatter: '{b}<br/>建筑色彩数据: {c} 座' },
          visualMap: { min: 0, max: 1000, left: '3%', bottom: '5%', text: ['多', '少'], calculable: true, inRange: { color: ['#a1c4fd', '#3169b2'] } },
          series: [{
            name: '中国地图', type: 'map', map: 'china', roam: false, zoom: 1.1,
            label: { show: true, color: '#ffffff', fontSize: 10 },
            itemStyle: { borderColor: '#ffffff', borderWidth: 1 },
            emphasis: { label: { color: '#fff' }, itemStyle: { areaColor: '#ff5e00' } },
            data: [ { name: '四川省', value: 890 }, { name: '福建省', value: 450 }, { name: '北京市', value: 950 }, { name: '新疆维吾尔自治区', value: 300 }, { name: '陕西省', value: 720 }, { name: '山西省', value: 880 } ]
          }]
        });
      } catch (error) { console.error('获取地图数据失败:', error); this.mapChart.hideLoading(); }
    },

    // ================= 终极魔法：底部交互图表 =================
    initAnalysisChart() {
      const chartDom = this.$refs.bottomBox;
      if (!chartDom) return;
      // 初始化唯一的一个画板
      this.analysisChart = echarts.init(chartDom);
      // 默认画第一张图（朝代对比）
      this.renderChartByTab(this.currentTab);
    },

    // 核心切换逻辑：用户点击按钮时触发
    switchTab(tabName) {
      this.currentTab = tabName; // 更新按钮状态
      this.renderChartByTab(tabName); // 命令画师重新画图
    },

    // 专门负责根据不同的 Tab，喂给画师不同的图纸 (Option)
    renderChartByTab(tabName) {
      let option = {};
      
      if (tabName === '朝代对比') {
        // 1. 堆叠柱状图
        option = {
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          legend: { data: ['官员', '富户', '平民', '王公', '皇家'], bottom: 0 },
          grid: { left: '3%', right: '4%', bottom: '10%', top: '5%', containLabel: true },
          xAxis: { type: 'category', data: ['唐', '宋', '元', '明', '清'] },
          yAxis: { type: 'value' },
          series: [
            { name: '官员', type: 'bar', stack: 'total', data: [320, 302, 301, 334, 390], itemStyle: {color: '#0088cc'} },
            { name: '富户', type: 'bar', stack: 'total', data: [120, 132, 101, 134, 90], itemStyle: {color: '#666666'} },
            { name: '平民', type: 'bar', stack: 'total', data: [220, 182, 191, 234, 290], itemStyle: {color: '#333333'} },
            { name: '王公', type: 'bar', stack: 'total', data: [150, 212, 201, 154, 190], itemStyle: {color: '#2ca02c'} },
            { name: '皇家', type: 'bar', stack: 'total', data: [820, 832, 901, 934, 1290], itemStyle: {color: '#ffbb00'} }
          ]
        };
      } 
      else if (tabName === '历史趋势') {
        // 2. 波浪面积图 (Stacked Area Chart)
        option = {
          tooltip: { trigger: 'axis' },
          legend: { data: ['红色墙体', '绿色琉璃瓦', '青色瓦片', '黄色琉璃瓦'], bottom: 0 },
          grid: { left: '3%', right: '4%', bottom: '10%', top: '5%', containLabel: true },
          xAxis: { type: 'category', boundaryGap: false, data: ['618', '750', '960', '1200', '1368', '1644', '1800'] },
          yAxis: { type: 'value' },
          series: [
            { name: '黄色琉璃瓦', type: 'line', stack: 'Total', smooth: true, lineStyle: {width: 0}, showSymbol: false, areaStyle: {opacity: 0.8, color: '#ffbb00'}, data: [10, 20, 30, 23, 50, 80, 120] },
            { name: '青色瓦片', type: 'line', stack: 'Total', smooth: true, lineStyle: {width: 0}, showSymbol: false, areaStyle: {opacity: 0.8, color: '#3169b2'}, data: [200, 300, 400, 389, 500, 700, 900] },
            { name: '绿色琉璃瓦', type: 'line', stack: 'Total', smooth: true, lineStyle: {width: 0}, showSymbol: false, areaStyle: {opacity: 0.8, color: '#2ca02c'}, data: [20, 30, 50, 43, 80, 100, 150] },
            { name: '红色墙体', type: 'line', stack: 'Total', smooth: true, lineStyle: {width: 0}, showSymbol: false, areaStyle: {opacity: 0.8, color: '#ff5e00'}, data: [50, 60, 80, 98, 150, 200, 300] }
          ]
        };
      }
      else if (tabName === '区域分布') {
        // 3. 混合图表：柱状图 + 折线图
        option = {
          tooltip: { trigger: 'axis' },
          legend: { data: ['官员', '民居', '王公', '皇家'], bottom: 0 },
          grid: { left: '3%', right: '4%', bottom: '10%', top: '5%', containLabel: true },
          xAxis: { type: 'category', data: ['北京', '陕西', '江苏', '浙江', '山西'] },
          yAxis: { type: 'value' },
          series: [
            { name: '王公', type: 'bar', data: [150, 80, 178, 120, 130], itemStyle: {color: '#2ca02c'} },
            { name: '皇家', type: 'bar', data: [90, 20, 34, 10, 25], itemStyle: {color: '#ffbb00'} },
            { name: '官员', type: 'line', data: [230, 230, 456, 390, 560], symbolSize: 8, itemStyle: {color: '#0088cc'}, lineStyle: {width: 3} },
            { name: '民居', type: 'line', data: [560, 890, 1234, 980, 1450], symbol: 'none', lineStyle: {type: 'dashed', color: '#666'} }
          ]
        };
      }
      else if (tabName === '材料成本') {
        // 4. 多维水平柱状图
        option = {
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          legend: { data: ['工艺难度', '成本指数', '稀有度'], bottom: 0 },
          grid: { left: '3%', right: '4%', bottom: '10%', top: '5%', containLabel: true },
          xAxis: { type: 'value', max: 100 },
          yAxis: { type: 'category', data: ['灰黑瓦片', '青色瓦片', '朱红漆料', '绿色琉璃瓦', '黄色琉璃瓦'] },
          series: [
            { name: '工艺难度', type: 'bar', data: [25, 50, 88, 78, 95], itemStyle: {color: '#ffbb00'} },
            { name: '成本指数', type: 'bar', data: [15, 45, 85, 65, 100], itemStyle: {color: '#ff5e00'} },
            { name: '稀有度', type: 'bar', data: [10, 30, 82, 55, 98], itemStyle: {color: '#0088cc'} }
          ]
        };
      }

      // 【核心技巧】第二个参数传 true，意思是彻底清除旧图表，画全新的一张，防止折线图和柱状图混乱重叠！
      this.analysisChart.setOption(option, true);
    },
 // ================= 时间轴魔法控制 =================
    // 动作 1：手动点击选中某个朝代
    selectDynasty(index) {
      this.currentDynastyIndex = index;
      // 以后如果有需要，可以在这里写代码让上面的 ECharts 图表跟着朝代一起变动！
    },

    // 动作 2：点击自动播放按钮
    toggleAutoPlay() {
      this.isPlaying = !this.isPlaying; // 切换播放/暂停状态
      
      if (this.isPlaying) {
        // 如果开启播放，就设定一个每 1.5 秒（1500毫秒）执行一次的循环闹钟
        this.timer = setInterval(() => {
          // 巧妙的数学魔法：用取余数 (%) 让索引到头了自动回滚到 0
          this.currentDynastyIndex = (this.currentDynastyIndex + 1) % this.dynasties.length;
        }, 1500); 
      } else {
        // 如果暂停，就彻底砸掉这个闹钟
        clearInterval(this.timer);
        this.timer = null;
      }
    }
}
}
</script>

<style scoped>
/* ================= 左側卡片1：等級列表 ================= */
.level-list { display: flex; flex-direction: column; gap: 15px; margin-top: 10px; }
.level-item { display: flex; align-items: center; gap: 15px; }
/* 圓形序號數字 */
.level-rank { 
  width: 26px; height: 26px; border-radius: 50%; color: white; 
  display: flex; align-items: center; justify-content: center; 
  font-size: 13px; font-weight: bold; flex-shrink: 0; 
}
.level-info { flex: 1; }
.level-name-val { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px; font-weight: bold; color: #333; }
.level-val { color: #888; font-weight: normal; }
/* 純 CSS 進度條的底部灰色槽 */
.progress-bg { width: 100%; height: 6px; background-color: #f0f0f0; border-radius: 3px; overflow: hidden; }
/* 進度條的彩色填充部分 */
.progress-bar { height: 100%; border-radius: 3px; transition: width 1s ease-in-out; }

/* ================= 左側卡片2：核心色彩 ================= */
.color-grid { 
  display: grid; grid-template-columns: 1fr 1fr; /* 切割成兩列 */
  gap: 15px; margin-bottom: 20px; 
}
/* 四個大字方塊 */
.color-box { 
  background: #fdfdfd; border-radius: 12px; text-align: center; 
  padding: 20px 0; font-size: 28px; font-weight: bold; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #f0f0f0;
}
.tag-group { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
/* 圓角藥丸標籤 */
.tag { padding: 5px 15px; border: 1px solid #ddd; border-radius: 20px; font-size: 13px; color: #666; background: white; }

/* ================= 左側卡片3：清朝數據 ================= */
.data-list { display: flex; flex-direction: column; gap: 12px; }
.data-item { 
  display: flex; justify-content: space-between; padding: 12px 18px; 
  background: #f8f9fa; border-radius: 8px; font-size: 14px; color: #555;
}
.data-item strong { font-size: 18px; }

.dashboard-wrapper {
  /* 给整个页面加一点内边距，并且设置一个高级的浅灰色背景 */
  padding: 30px;
  background-color: #f5f7fa; 
  min-height: 100vh;
}

/* ================= 布局魔法：让抽屉排好队 ================= */
.top-dashboard {
  display: flex; /* 开启弹性盒子布局 */
  justify-content: space-between; /* 让左中右三个栏目均匀分布 */
  gap: 20px; /* 栏目之间的缝隙 */
  margin-bottom: 30px; /* 和下半部分留出距离 */
}

/* 定义左中右的宽度比例 */
.left-column { width: 25%; display: flex; flex-direction: column; gap: 20px; }
.center-column { width: 50%; display: flex; }
.right-column { width: 25%; display: flex; flex-direction: column; gap: 20px; }

/* ================= 通用的卡片衣服 ================= */
.card {
  background-color: #ffffff; /* 纯白背景 */
  border-radius: 12px; /* 圆角，让界面看起来更柔和现代化 */
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); /* 淡淡的阴影，让卡片浮起来 */
  border: 1px solid #ebeef5; /* 极细的边框 */
}

.card-title {
  font-size: 16px;
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
  font-weight: bold;
}

/* ================= 给每个小盒子定高度 ================= */
.level-card { min-height: 250px; height: auto; }
.core-color-card { min-height: 200px; height: auto; }
.qing-data-card { min-height: 150px; height: auto; }

.map-card { 
  width: 100%; 
  min-height: 640px; 
  display: flex; 
  flex-direction: column; 
}
.map-title { text-align: center; color: #333; margin-top: 10; margin-bottom: 20px; }

.radar-card { flex: 1; min-height: 300px; }
.stats-card { flex: 1; min-height: 320px; }

/* ================= 下半部分：综合分析区 ================= */
.analysis-card {
  min-height: 500px;
}
.analysis-title {
  text-align: center;
  font-size: 20px;
  margin-bottom: 20px;
}
.analysis-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}
.analysis-tabs button {
  padding: 8px 24px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 20px;
  cursor: pointer;
  color: #666;
  transition: 0.3s;
}
.analysis-tabs button.active {
  background-color: #ff5e00; /* 选中状态的橙色 */
  color: white;
  border-color: #ff5e00;
}

/* ================= 占位符的样式 (灰色提示字) ================= */
/* ================= 综合分析区样式补充 ================= */
.analysis-card {
  min-height: 550px;
  display: flex;
  flex-direction: column;
}
.analysis-title {
  text-align: center; font-size: 20px; margin-bottom: 20px; color: #333;
}
.analysis-tabs {
  display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;
}
.analysis-tabs button {
  padding: 8px 24px; border: 1px solid #ddd; background-color: white; 
  border-radius: 20px; cursor: pointer; color: #666; transition: all 0.3s;
  font-size: 14px;
}
/* 点击后的高亮状态：橙色底，白字 */
.analysis-tabs button.active {
  background-color: #ff5e00; color: white; border-color: #ff5e00; font-weight: bold;
}
.big-chart-container {
  flex: 1; /* 让图表占据中间大部分空间 */
}
/* 底部的数据说明框样式 */
.data-description {
  margin-top: 20px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #555;
  font-size: 14px;
  line-height: 1.6;
}
.data-description strong {
  color: #333;
  display: block;
  margin-bottom: 5px;
}
.placeholder-text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  background-color: #f9f9f9;
  border: 2px dashed #ddd; /* 虚线框，表示这里还在施工 */
  border-radius: 8px;
  text-align: center;
  padding: 20px;
}
.map-placeholder { flex: 1; font-size: 18px; }
.big-chart-placeholder { height: 350px; font-size: 18px; }
/* ================= 底部：朝代时间轴专属衣服 ================= */
.timeline-section {
  background-color: #1a202c; /* 深邃的藏青/黑色背景 */
  border-radius: 12px;
  padding: 30px 40px;
  margin-top: 30px; /* 和上面的图表拉开距离 */
  color: white;
}
.timeline-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;
}
.timeline-header h3 { margin: 0; font-size: 20px; letter-spacing: 1px; }

/* 播放按钮样式 */
.autoplay-btn {
  background-color: #ff5e00; color: white; border: none; border-radius: 20px;
  padding: 8px 24px; font-size: 14px; font-weight: bold; cursor: pointer; transition: 0.3s;
}
.autoplay-btn.playing { background-color: #e53e3e; } /* 播放时变成红色警示 */

/* 轨道区排版 */
.timeline-track {
  position: relative; display: flex; justify-content: space-between; align-items: flex-start;
  padding: 0 20px; margin-bottom: 40px;
}
/* 贯穿的一条细线 */
.track-line {
  position: absolute; top: 25px; left: 40px; right: 40px; height: 2px;
  background-color: rgba(255, 255, 255, 0.2); z-index: 1;
}

/* 单个节点 */
.dynasty-node {
  position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center;
  cursor: pointer; width: 80px;
}
/* 颜色圆圈 */
.node-circle {
  width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center;
  font-size: 20px; font-weight: bold; color: white; margin-bottom: 15px;
  border: 3px solid #1a202c; /* 用和背景一样的边框，在视觉上切断背景线 */
  transition: all 0.3s ease;
}
/* 选中时的圆圈放大发光特效！ */
.node-circle.active {
  transform: scale(1.2); 
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5); border-color: white;
}

/* 文字信息 */
.node-text { text-align: center; }
.d-name { font-size: 14px; color: rgba(255, 255, 255, 0.6); margin-bottom: 4px; transition: 0.3s; }
.d-name.active { color: white; font-weight: bold; font-size: 16px; }
.d-time { font-size: 12px; color: rgba(255, 255, 255, 0.4); }

/* 选中小白点 */
.d-dot {
  width: 6px; height: 6px; background-color: white; border-radius: 50%;
  margin: 10px auto 0;
}

/* 底部状态 */
.current-status { text-align: center; font-size: 16px; letter-spacing: 1px; }
.current-status span { font-size: 18px; margin-left: 5px; transition: color 0.3s; }
</style>