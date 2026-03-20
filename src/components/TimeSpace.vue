<template>
  <div class="dashboard-wrapper">

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
  
  <div class="color-blocks">
    <div 
      class="color-box" 
      v-for="(color, index) in currentCoreColors" 
      :key="index"
    >
      <span :style="{ color: color.hex, fontWeight: 'bold', fontSize: '24px' }">
  {{ color.displayName }}
</span>
    </div>
  </div>

  <div class="tags-container">
    <span 
      class="tag" 
      v-for="(tag, index) in currentTags" 
      :key="index"
    >
      {{ tag }}
    </span>
  </div>
</div>
        <div class="card qing-data-card">
          <h3 class="card-title">📊 {{ currentPanelTitle }}</h3>
          <div class="data-list">
            <div class="data-item"><span>建築總數</span><strong>{{ currentStats.totalBuildings }}</strong></div>
            <div class="data-item"><span>使用黃色</span><strong style="color: #ffbb00;">{{ currentStats.yellowCount }}</strong></div>
            <div class="data-item"><span>使用紅色</span><strong style="color: #ff5e00;">{{ currentStats.redCount }}</strong></div>
            <div class="data-item"><span>使用綠色</span><strong style="color: #2ca02c;">{{ currentStats.greenCount }}</strong></div>
          </div>
        </div>

      


        
      </div>

      <div class="center-column">
        <div class="card map-card" style="position: relative;"> <h2 class="map-title">中国古建筑色彩地理分布</h2>
          
          <div ref="mapBox" style="width: 100%; flex: 1; min-height: 550px;"></div>

          <div class="map-copyright" style="position: absolute; bottom: 10px; right: 15px; font-size: 12px; color: rgba(150, 150, 150, 0.8); pointer-events: none; z-index: 999;">
            本系统地图底图数据来源于高德开放平台（阿里云 DataV），审图号：GS(2025)5996，底图无修改。
          </div>
        </div>
      </div>

      <div class="right-column">
        
        <div class="card radar-card">
          <h3 class="card-title">色彩使用分析 - {{ currentDynastyName }}</h3>
          
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
    

    

     
    </div>

</div>
  
</template>

<script>
import * as echarts from 'echarts';
import { request } from '/src/utils/request.js';
import { getClassicalName } from '/src/utils/colorNames.js';

export default {
  name: 'TimeSpace',

  data() {
    return {
      colorLevels: [],
      currentTab: '朝代对比', 
      
      dynasties: [
        { short: '唐', name: '唐朝', time: '618-907', color: '#ffbb00', mainColor: '#982A22', accentColor: '#ff5e00' }, 
        { short: '宋', name: '宋朝', time: '960-1279', color: '#0088cc', mainColor: '#0088cc', accentColor: '#40fcfc' }, 
        { short: '元', name: '元朝', time: '1271-1368', color: '#2ca02c', mainColor: '#f2eada', accentColor: '#d3b17d' }, 
        { short: '明', name: '明朝', time: '1368-1644', color: '#ff5e00', mainColor: '#ffbb00', accentColor: '#ffff00' }, 
        { short: '清', name: '清朝', time: '1644-1912', color: '#ffbb00', mainColor: '#EBA53D', accentColor: '#ffbb00' }  
      ],
      currentDynastyIndex: 0, 
      isPlaying: false,       
      timer: null,            
      currentPanelTitle: '唐朝数据', 
      currentDynastyName: '唐朝',
      currentStats: { totalBuildings: 3100, yellowCount: 40, redCount: 450, greenCount: 800 },
      currentCoreColors: [],
      currentTags: [],
      
      mockDatabase: { /* 保持假数据不动 */ },
      tabInfo: {
        '朝代对比': { title: '各朝代建筑等级分布对比', desc: '展示唐、宋、元、明、清五个朝代的建筑等级分布情况，数据基于历史文献记载和现存建筑统计。' },
        '历史趋势': { title: '历代色彩使用趋势变化', desc: '追踪从唐代至清末不同色彩建筑材料的使用数量变化，反映礼制演变与建筑技术发展。' },
        '区域分布': { title: '主要区域建筑等级分布', desc: '对比北京、陕西、江苏、浙江、山西五个重要历史区域的建筑等级分布特点。' },
        '材料成本': { title: '建筑材料成本与工艺分析', desc: '分析不同色彩建筑材料的经济成本、制作工艺难度和材料稀有程度（指数化表示）。' }
      }
    }
  },

  computed: {
    currentChartTitle() { return this.tabInfo[this.currentTab].title; },
    currentDescription() { return this.tabInfo[this.currentTab].desc; }
  },
  
  mounted() {
    this.initRadarChart();
    this.initStatsChart();
    this.initMapChart();
    
    this.initAnalysisChart();
    
    // 页面加载自动触发一次唐朝数据
    this.selectDynasty(0);
    
    setTimeout(() => {
      this.politePreload();
    }, 2000);

    window.addEventListener('resize', () => {
      if(this.radarChart) this.radarChart.resize();
      if(this.statsChart) this.statsChart.resize();
      if(this.analysisChart) this.analysisChart.resize();
      
      if(this.mapChart) {
        // 实时检测宽度
        const isMobile = window.innerWidth <= 768;
        // 动态更新地图的 label 设置
        this.mapChart.setOption({
          series: [{ label: { show: !isMobile } }]
        });
        // 重绘适应尺寸
        this.mapChart.resize();
      }
    });
  },

  methods: {
   async politePreload() {
      console.log("🛠️ 开始后台排队预加载全量历史数据...");

      // 💡 架构师级修复 1：把底部四个耗时的全局数据接口加入“静默预加载 VIP 队列”
      const bottomApis = [
        '/api/dashboard/dynasty-comparison',
        '/api/dashboard/history-trend', // 这个就是之前疯狂超时的罪魁祸首
        '/api/dashboard/region-rank-dist',
        '/api/dashboard/material-analysis'
      ];
      
      // 先偷偷加载这四个大图表的数据
      for (const api of bottomApis) {
        try {
          // request.js 拦截器会自动把请求结果塞进 cacheMap 缓存里
          await request.get(api);
        } catch (e) {
          console.warn(`⚠️ 预加载 ${api} 失败或超时，用户点击时将重新请求`, e);
        }
        // 🌟 重点缓冲：每请求完一个大接口，让前端休息 0.8 秒，绝不把后端服务器压垮！
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      console.log("✅ 底部四大综合图表静默备货完成！");

      // --- 下面是你原本预加载各个朝代的代码，保持原样 ---
      for (let i = 1; i < this.dynasties.length; i++) {
        await this.preloadDynastyData(this.dynasties[i].name);
        // 这里也休息 0.5 秒
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      console.log("🎉 所有朝代及综合档案已备货完毕，现在可以开启自动播放了！");
    },

    // 🌟 修改原来的预加载方法，返回 Promise 让上面能 await
    preloadDynastyData(dynastyName) {
      const dynastyMap = { '唐朝': 'tang', '宋朝': 'song', '元朝': 'yuan', '明朝': 'ming', '清朝': 'qing' };
      const dynastyKey = dynastyMap[dynastyName] || 'qing';
      
      return Promise.all([
        request.get('/api/dashboard/dynasty-stats', { params: { dynasty: dynastyKey } }),
        request.get('/api/dashboard/level-stats', { params: { dynasty: dynastyKey } }),
        request.get('/api/dashboard/core-colors', { params: { dynasty: dynastyKey } }),
        request.get('/api/dashboard/color-analysis', { params: { dynasty: dynastyKey } }),
        request.get('/api/dashboard/map-distribution', { params: { dynasty: dynastyKey } })
      ]).then(() => {
        console.log(`✅ 后台静默备货完成: ${dynastyName}`);
      }).catch(e => console.warn(`⚠️ ${dynastyName} 预加载失败，可能是网络波动`, e));
    },
    getCurrentDynastyColors() {
      const selected = this.dynasties[this.currentDynastyIndex];
      return selected.mainColor ? [selected.mainColor, selected.accentColor] : ['#3169b2', '#00cccc']; 
    },

    initAnalysisChart() {
      const chartDom = this.$refs.bottomBox;
      if (!chartDom) return;
      this.analysisChart = echarts.init(chartDom);
      this.renderChartByTab(this.currentTab);
    },

    initRadarChart() {
      const chartDom = this.$refs.radarBox;
      if (!chartDom) return;
      if (!this.radarChart) {
        this.radarChart = echarts.init(chartDom);
      }
      
      const colors = this.getCurrentDynastyColors();

      this.radarChart.setOption({
        tooltip: { show: true },
        radar: {
          indicator: [
            { name: '黄色使用', max: 100 }, { name: '红色', max: 100 },
            { name: '绿色', max: 100 }, { name: '青色', max: 100 },
            { name: '明度', max: 100 }, { name: '饱和度', max: 100 }
          ],
          shape: 'circle', 
          radius: '65%', center: ['50%', '55%'],
          splitNumber: 4,
          // ✅ 修复了这里的字体错漏
          name: { textStyle: { color: '#e6c280', fontSize: 13, fontFamily: "STKaiti, serif" } },
          splitLine: { lineStyle: { color: ['rgba(230, 194, 128, 0.1)', 'rgba(230, 194, 128, 0.3)'] } },
          splitArea: { show: false },
          axisLine: { lineStyle: { color: 'rgba(230, 194, 128, 0.3)' } }
        },
        series: [{ 
          type: 'radar', 
          data: [{ value: [0, 0, 0, 0, 0, 0], name: '数据加载中...' }],
          itemStyle: { color: colors[0], borderColor: colors[1], borderWidth: 2 },
          lineStyle: { width: 2, color: colors[1] },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: colors[0] }, 
              { offset: 1, color: 'transparent' } 
            ])
          },
          shadowBlur: 15, shadowColor: colors[1]
        }]
      });
    },

    initStatsChart() {
      const chartDom = this.$refs.statsBox;
      if (!chartDom) return;
      if (!this.statsChart) {
        this.statsChart = echarts.init(chartDom);
      }
      
      const colors = this.getCurrentDynastyColors();

      this.statsChart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '15%', bottom: '3%', top: '5%', containLabel: true },
        xAxis: { type: 'value', show: false }, 
        yAxis: { 
          type: 'category', data: ['平民', '富户', '官员', '王公', '皇家'], 
          axisLine: { show: false }, axisTick: { show: false },
          // ✅ 修复了这里的字体错漏
          axisLabel: { color: '#fdf6e3', fontFamily: "STKaiti, serif", fontSize: 13 }
        },
        series: [{ 
          name: '建筑数量', type: 'bar', data: [0, 0, 0, 0, 0], barWidth: '35%', 
          itemStyle: { 
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: colors[1] },
              { offset: 1, color: colors[0] }
            ]),
            borderRadius: [0, 4, 4, 0] 
          }, 
          label: { show: true, position: 'right', color: '#e6c280', fontWeight: 'bold' },
          shadowBlur: 10, shadowColor: colors[1]
        }]
      });
    },

    async initMapChart() {
      const chartDom = this.$refs.mapBox;
      if (!chartDom) return;
      
      // 💡 核心逻辑：获取当前屏幕宽度，判断是否为手机端
      const isMobile = window.innerWidth <= 768;

      if (!this.mapChart) {
        this.mapChart = echarts.init(chartDom);
        this.mapChart.showLoading({ text: '正在召唤中国版图...', color: '#e6c280', maskColor: 'rgba(0,0,0,0.5)' });
        try {
          const response = await fetch('/chinamap.json');
          const geoJson = await response.json();
          this.mapChart.hideLoading();
          echarts.registerMap('china', geoJson);
        } catch (error) { 
          console.error('获取地图数据失败:', error); 
          this.mapChart.hideLoading(); 
          return;
        }
      }

      this.mapChart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}<br/>建筑数量：{c} 座', backgroundColor: 'rgba(10, 17, 40, 0.8)', textStyle: { color: '#e6c280' } },
        visualMap: { 
          min: 0, max: 200, left: '3%', bottom: '5%', 
          text: ['多', '少'], calculable: true, 
          textStyle: { color: '#e6c280' }, 
          inRange: { color: ['#3a080a', '#982A22', '#ffbb00'] } 
        },
        series: [{
          name: '中国地图', type: 'map', map: 'china', 
          roam: false, 
          zoom: 1.25, 
          top: '15%', 
          
          // 💡 修复点 1：开启单选模式，允许区域被点击后保持状态
          selectedMode: 'single', 
          

         label: {
            show: !isMobile,
            color: 'rgba(253, 246, 227, 0.85)',
            fontSize: 11, // 💡 字体稍微调大了一点点，因为字数少了
            // 💡 修复点 2：文本美颜滤镜！拦截超长地名，进行极简处理
            formatter: function(params) {
              let name = params.name;

              // 💡 评委拍板：太挤了，直接返回空字符串，让它们在视觉上隐身！
              // 这里新增了 '北京市', '天津市', '上海市'
              if (name === '香港特别行政区' || name === '澳门特别行政区' || name === '香港' || name === '澳门' ) {
                return '';
              }

              // 💡 顺手精简其他冗长名字（这里新增了去掉“省”和“市”）
              name = name.replace('维吾尔自治区', '')
                         .replace('回族自治区', '')
                         .replace('壮族自治区', '')
                         .replace('自治区', '')
                         .replace('省', '')
                         .replace('市', '');
              return name;
            }
          },
          labelLayout: function (params) {
            // 注意：因为咱们上一步的 formatter 已经把“省”字去掉了，所以这里匹配 '甘肃'
            if (params.text === '甘肃') {
              return { 
                dx: 19, // 横向偏移：正数向右，负数向左
                dy: -10  // 纵向偏移：正数向下，负数向上
              }; 
            }
            if (params.text === '内蒙古') {
              return { dx: -15, dy: 20 };
            }
            // 陕西也可以往右边拉一点，避开宁夏
            if (params.text === '陕西') {
              return { dx: 5, dy: 5 };
            }
            if (params.text === '河北') {
              return { dx: -10, dy:13 };
            }
            return {}; // 其他省份保持原样
          },
          itemStyle: { 
            areaColor: '#10182b', 
            borderColor: 'rgba(230, 194, 128, 0.3)',
            borderWidth: 1,
            shadowColor: 'rgba(0,0,0,0.5)', shadowBlur: 10 
          },
          
          // 悬浮（Hover）状态
          emphasis: { 
            focus: 'none', 
            label: { color: '#fff', fontWeight: 'bold', fontSize: 13 }, 
            itemStyle: { areaColor: '#982A22', borderColor: '#ffbb00', shadowBlur: 20, shadowColor: '#ffbb00' } 
          },
          
          // 💡 修复点 3：增加点击选中（Select）状态，并把刚才悬浮发光的特效直接“复制粘贴”过来
          select: {
            label: { color: '#fff', fontWeight: 'bold', fontSize: 13 }, 
            itemStyle: { areaColor: '#982A22', borderColor: '#ffbb00', shadowBlur: 20, shadowColor: '#ffbb00' } 
          },

          blur: {
            label: { color: 'rgba(253, 246, 227, 0.85)' }
          },
          data: [] 
        }]
      });
    },

    async updateAllCharts(dynastyName) {
      console.log(`📡 正在请求 【${dynastyName}】 的真实数据...`);
      const dynastyMap = { '唐朝': 'tang', '宋朝': 'song', '元朝': 'yuan', '明朝': 'ming', '清朝': 'qing' };
      const dynastyKey = dynastyMap[dynastyName] || 'qing';

      try {
        const [statsRes, levelRes, colorRes, radarRes, mapRes] = await Promise.all([
          request.get('/api/dashboard/dynasty-stats', { params: { dynasty: dynastyKey } }),
          request.get('/api/dashboard/level-stats', { params: { dynasty: dynastyKey } }),
          request.get('/api/dashboard/core-colors', { params: { dynasty: dynastyKey } }),
          request.get('/api/dashboard/color-analysis', { params: { dynasty: dynastyKey } }),
          request.get('/api/dashboard/map-distribution', { params: { dynasty: dynastyKey } })
        ]);

        if (statsRes.code === 200) this.currentStats = statsRes.data;

        if (levelRes.code === 200) {
          const levels = levelRes.data.levels;
          this.colorLevels = levels.map(item => ({
            name: item.label.replace('建筑', ''),
            value: item.value,
            percent: Math.round(item.ratio * 100) + '%',
            color: this.getLevelColor(item.label)
          }));
          if (this.statsChart) {
            this.statsChart.setOption({
              series: [{ data: levels.map(item => item.value) }]
            });
          }
        }

        if (colorRes.code === 200) {
          this.currentCoreColors = colorRes.data.colors.map(colorObj => {
            const fullName = colorObj.name.endsWith('色') ? colorObj.name : colorObj.name + '色';
            return {
              ...colorObj,
              displayName: getClassicalName(fullName, dynastyKey) 
            };
          });
          this.currentTags = colorRes.data.cultureTags;
        }

        if (radarRes.code === 200 && this.radarChart) {
          this.radarChart.setOption({
            series: [{ data: [{ value: radarRes.data.indicators.map(i => i.value), name: dynastyName }] }]
          });
        }

        if (mapRes.code === 200 && this.mapChart) {
          let finalMapData = [];
          mapRes.data.regions.forEach(region => {
            region.provinces.forEach(prov => {
              finalMapData.push({ name: prov, value: region.value });
            });
          });
          this.mapChart.setOption({ series: [{ data: finalMapData }] });
        }
        console.log(`✅ 【${dynastyName}】 数据联调成功！`);
      } catch (error) {
        console.error('联调失败：', error);
      }
    },

    getLevelColor(label) {
      const colorMap = { '皇家建筑': '#e6c280', '王公建筑': '#982A22', '官员建筑': '#3169b2', '富户建筑': '#2ca02c', '平民建筑': '#666666' };
      const name = label.includes('建筑') ? label : label + '建筑';
      return colorMap[name] || '#999';
    },

    async renderChartByTab(tabName) {
      if (!this.analysisChart) return;
      this.analysisChart.showLoading({ text: '正在调取历史档案...', color: '#e6c280', maskColor: 'rgba(0,0,0,0.5)' });
      
      try {
        let option = {};
        // ✅ 修复了这里的字体错漏
        const textStyleBase = { color: '#fdf6e3', fontFamily: "STKaiti, serif" };

        if (tabName === '朝代对比') {
          const res = await request.get('/api/dashboard/dynasty-comparison'); 
          if (res.code === 200) {
            const { timeline, series } = res.data; 
            option = {
              tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(10,17,40,0.8)', textStyle: { color: '#e6c280' } },
              legend: { bottom: 0, textStyle: textStyleBase },
              grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
              xAxis: { type: 'category', data: timeline, axisLabel: textStyleBase }, 
              yAxis: { type: 'value', axisLabel: textStyleBase, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
              series: series.map(s => ({
                name: s.rankName, type: 'bar', stack: 'total', data: s.data, itemStyle: { color: s.color } 
              }))
            };
          }
        } 
        else if (tabName === '历史趋势') {
          const res = await request.get('/api/dashboard/history-trend'); 
          if (res.code === 200) {
            const { years, series } = res.data; 
            option = {
              tooltip: { trigger: 'axis', backgroundColor: 'rgba(10,17,40,0.8)', textStyle: { color: '#e6c280' } },
              legend: { bottom: 0, textStyle: textStyleBase },
              grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
              xAxis: { type: 'category', boundaryGap: false, data: years.map(String), axisLabel: textStyleBase }, 
              yAxis: { type: 'value', axisLabel: textStyleBase, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
              series: series.map(s => ({
                name: s.materialName, type: 'line', stack: 'Total', smooth: true,
                areaStyle: { opacity: 0.8, color: s.color }, data: s.data 
              }))
            };
          }
        }
        else if (tabName === '区域分布') {
          const res = await request.get('/api/dashboard/region-rank-dist'); 
          if (res.code === 200) {
            const { provinces, series } = res.data; 
            option = {
              tooltip: { trigger: 'axis', backgroundColor: 'rgba(10,17,40,0.8)', textStyle: { color: '#e6c280' } },
              legend: { bottom: 0, textStyle: textStyleBase },
              grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
              xAxis: { type: 'category', data: provinces, axisLabel: textStyleBase }, 
              yAxis: { type: 'value', axisLabel: textStyleBase, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
              series: series.map(s => ({
                name: s.name, type: s.type, data: s.data, itemStyle: { color: s.color }, 
                lineStyle: s.lineStyle === 'dashed' ? { type: 'dashed' } : {} 
              }))
            };
          }
        }
        else if (tabName === '材料成本') {
          const res = await request.get('/api/dashboard/material-analysis'); 
          if (res.code === 200) {
            const { dimensions, materials } = res.data; 
            option = {
              tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(10,17,40,0.8)', textStyle: { color: '#e6c280' } },
              legend: { bottom: 0, textStyle: textStyleBase },
              grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
              xAxis: { type: 'value', max: 100, axisLabel: textStyleBase, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
              yAxis: { type: 'category', data: materials.map(m => m.name), axisLabel: textStyleBase }, 
              series: dimensions.map((dim, index) => ({
                name: dim, type: 'bar', data: materials.map(m => m.values[index]), itemStyle: { color: materials[0].colors[index] } 
              }))
            };
          }
        }

        this.analysisChart.hideLoading();
        this.analysisChart.setOption(option, true);

      } catch (error) {
        console.error(`渲染图表 ${tabName} 失败：`, error);
        this.analysisChart.hideLoading();
      }
    },

    selectDynasty(index) {
      this.currentDynastyIndex = index;
      const selectedDynasty = this.dynasties[index];
      this.currentPanelTitle = selectedDynasty.name + '数据';
      this.currentDynastyName = selectedDynasty.name;
      
      this.initRadarChart();
      this.initStatsChart();
      
      this.updateAllCharts(selectedDynasty.name);
    },

    toggleAutoPlay() {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        this.timer = setInterval(() => {
          const nextIndex = (this.currentDynastyIndex + 1) % this.dynasties.length;
          this.selectDynasty(nextIndex); 
        }, 3000); 
      } else {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    async fetchColorLevels() {
      try {
        const res = await request.get('/api/dashboard/color-levels');
        if (res.code === 200) {
          this.colorLevels = res.data.colorLevels;
        }
      } catch (error) {}
    },

    switchTab(tabName) {
      this.currentTab = tabName;
      this.renderChartByTab(tabName);
    }
  }
}
</script>

<style scoped>
/* ================= 全局：深邃宫殿与科技光感 ================= */
.dashboard-wrapper {
  padding: 30px;
  /* 魔法：暗海蓝色渐变 + 墙面斑驳纹理 */
  background-color: #03050a;
  background-image: 
    url('https://www.transparenttextures.com/patterns/stucco.png'),
    linear-gradient(135deg, #0a1128 0%, #03050a 100%);
  min-height: 100vh;
  color: #fdf6e3; /* 全局文字改为米黄色 */
}

/* ================= 通用的卡片衣服 (暗金排版) ================= */
.card {
  /* 卡片内部用更亮的暗蓝色宣纸 */
  background: url('https://www.transparenttextures.com/patterns/rice-paper-2.png') rgba(20, 5, 5, 0.4); 
  border-radius: 4px; /* 摒弃现代大圆角 */
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5); /* 加深阴影 */
  border: 1px solid #bfa175; /* 暗金边框 */
  position: relative;
  backdrop-filter: blur(4px);
}

/* 卡片内部的双层绢丝线框 */
.card::before {
  content: '';
  position: absolute;
  top: 6px; left: 6px; right: 6px; bottom: 6px;
  border: 1px solid rgba(220, 191, 162, 0.2);
  pointer-events: none;
}

/* 卡片和图表标题：沉稳的暗金楷体 */
.card-title, .map-title, .analysis-title {
  font-size: 18px;
  color: #e6c280;
  margin-top: 0;
  margin-bottom: 15px;
  font-weight: bold;
  font-family: "STKaiti", "楷体", serif;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}
.map-title { text-align: center; margin-top: 10px; margin-bottom: 20px; font-size: 22px; }
.analysis-title { text-align: center; font-size: 20px; margin-bottom: 20px; }

/* ================= 顶部三列布局 ================= */
.top-dashboard { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 30px; }
.left-column { width: 25%; display: flex; flex-direction: column; gap: 20px; }
.center-column { width: 50%; display: flex; }
.right-column { width: 25%; display: flex; flex-direction: column; gap: 20px; }

/* 规定高度 */
.level-card { min-height: 250px; height: auto; }
.core-color-card { min-height: 200px; height: auto; }
.qing-data-card { min-height: 150px; height: auto; }
.map-card { width: 100%; min-height: 640px; display: flex; flex-direction: column; }
.radar-card { flex: 1; min-height: 300px; }
.stats-card { flex: 1; min-height: 320px; }

/* ================= 左側卡片1：等級列表 ================= */
.level-list { display: flex; flex-direction: column; gap: 15px; margin-top: 10px; }
.level-item { display: flex; align-items: center; gap: 15px; }
.level-rank { width: 26px; height: 26px; border-radius: 50%; color: #03050a; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; flex-shrink: 0; }
.level-info { flex: 1; }
.level-name-val { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px; font-weight: bold; color: #fdf6e3; }
.level-val { color: #bfa175; font-weight: normal; }
.progress-bg { width: 100%; height: 6px; background-color: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
.progress-bar { height: 100%; border-radius: 3px; transition: width 1s ease-in-out; }

/* ================= 左側卡片2：核心色彩 ================= */
.color-blocks { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
.color-box {
  height: 70px;
  background-color: rgba(0,0,0,0.5); /* 半透明黑底 */
  border: 1px solid rgba(220, 191, 162, 0.3); /* 暗金边框 */
  border-radius: 4px;
  display: flex; justify-content: center; align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.tags-container { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; }
.tag { padding: 4px 12px; border: 1px solid rgba(220, 191, 162, 0.4); border-radius: 4px; font-size: 12px; color: #e6c280; background-color: rgba(0,0,0,0.5); }

/* ================= 左側卡片3：朝代數據 ================= */
.data-list { display: flex; flex-direction: column; gap: 12px; }
.data-item { 
  display: flex; justify-content: space-between; padding: 12px 18px; 
  background: rgba(0,0,0,0.4); border: 1px solid rgba(220, 191, 162, 0.2);
  border-radius: 4px; font-size: 14px; color: #fdf6e3;
}
.data-item strong { font-size: 18px; text-shadow: 0 0 5px rgba(255,255,255,0.2); }

/* ================= 下半部分：综合分析区 ================= */
.analysis-card { min-height: 550px; display: flex; flex-direction: column; }
.analysis-tabs { display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; }
.analysis-tabs button {
  padding: 8px 24px; border: 1px solid rgba(220, 191, 162, 0.4); background-color: rgba(0,0,0,0.5); 
  border-radius: 4px; cursor: pointer; color: #bfa175; transition: all 0.3s; font-size: 14px;
}
.analysis-tabs button.active { background-color: #e6c280; color: #03050a; border-color: #e6c280; font-weight: bold; box-shadow: 0 0 10px rgba(230, 194, 128, 0.4); }
.big-chart-container { flex: 1; }
.data-description { margin-top: 20px; padding: 15px 20px; background-color: rgba(0,0,0,0.4); border: 1px solid rgba(220, 191, 162, 0.2); border-radius: 4px; color: #ccc; font-size: 14px; line-height: 1.6; }
.data-description strong { color: #e6c280; display: block; margin-bottom: 5px; }

/* ================= 底部：朝代时间轴专属衣服 ================= */
.timeline-section {
  background: rgba(0,0,0,0.3); border: 1px dashed #bfa175; 
  border-radius: 4px; padding: 30px 40px; margin-bottom: 20px; color: white;
}
.timeline-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.timeline-header h3 { margin: 0; font-size: 20px; letter-spacing: 1px; color: #e6c280; font-family: "STKaiti", "楷体", serif;}
.autoplay-btn {
  background-color: transparent; color: #e6c280; border: 1px solid #e6c280; border-radius: 4px;
  padding: 8px 24px; font-size: 14px; font-weight: bold; cursor: pointer; transition: 0.3s;
}
.autoplay-btn.playing { background-color: #982a22; border-color: #982a22; color: #fff; }

.timeline-track { position: relative; display: flex; justify-content: space-between; align-items: flex-start; padding: 0 20px; margin-bottom: 40px; }
.track-line { position: absolute; top: 25px; left: 40px; right: 40px; height: 2px; background-color: rgba(230, 194, 128, 0.2); z-index: 1; }
.dynasty-node { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; cursor: pointer; width: 80px; }

/* 时间节点圆圈 */
.node-circle {
  width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center;
  font-size: 20px; font-weight: bold; color: white; margin-bottom: 15px;
  border: 2px solid #bfa175; background-color: #03050a; transition: all 0.3s ease;
}
.node-circle.active {
  transform: scale(1.2); 
  box-shadow: 0 0 20px rgba(255, 187, 0, 0.6); border-color: #e6c280; color: #e6c280;
}
.node-text { text-align: center; }
.d-name { font-size: 14px; color: rgba(230, 194, 128, 0.5); margin-bottom: 4px; transition: 0.3s; font-family: "STKaiti", "楷体", serif; }
.d-name.active { color: #e6c280; font-weight: bold; font-size: 18px; text-shadow: 0 0 10px rgba(230, 194, 128, 0.5); }
.d-time { font-size: 12px; color: rgba(255, 255, 255, 0.4); }
.d-dot { width: 6px; height: 6px; background-color: #e6c280; border-radius: 50%; margin: 10px auto 0; box-shadow: 0 0 5px #e6c280;}

.current-status { text-align: center; font-size: 16px; letter-spacing: 1px; color: #bfa175; }
.current-status span { font-size: 20px; margin-left: 5px; transition: color 0.3s; text-shadow: 0 0 10px currentColor; }
.map-copyright { position: absolute; bottom: 15px; right: 20px; font-size: 12px; color: rgba(255, 255, 255, 0.3); pointer-events: none; z-index: 999; }

/* 手机端适配 */
/* ================= 手机端适配 ================= */
@media (max-width: 768px) {
  .top-dashboard { flex-direction: column !important; }
  .left-column, .center-column, .right-column { width: 100% !important; }
  
  /* 💡 修复1：给外层卡片“瘦身”，缩小左右内边距，把空间还给时间轴 */
  .timeline-section { padding: 20px 10px !important; }

  /* 💡 修复2：头部标题和自动播放按钮在手机端改为上下排列，避免拥挤 */
  .timeline-header { flex-direction: column; gap: 15px; margin-bottom: 25px; }

  /* 💡 修复3：开启容器的丝滑横向滚动 */
  .timeline-track { 
    overflow-x: auto; 
    overflow-y: hidden;
    justify-content: flex-start !important; 
    
    /* 💡 修复1：给顶部增加 20px 的空间，专门留给放大和发光的特效 */
    padding-top: 20px; 
    
    padding-bottom: 15px; 
    -webkit-overflow-scrolling: touch; 
  }

  /* 💡 修复4：定制一条古典暗金色的专属手机端滚动条，暗示用户可以左右滑动 */
  .timeline-track::-webkit-scrollbar { height: 4px; }
  .timeline-track::-webkit-scrollbar-thumb { 
    background: rgba(230, 194, 128, 0.4); 
    border-radius: 4px; 
  }

  /* 锁定每个朝代节点的宽度 */
  .dynasty-node { flex-shrink: 0; width: 90px !important; }

  /* 💡 修复5：彻底修复断掉的贯穿线！
     取消 right 的限制，改为根据节点数量算出固定宽度 (唐宋元明清共4个间隔 * 90px) */
  .track-line {
    /* 💡 修复2：因为父元素顶部多了 20px，线也要跟着下移！原本是 top: 25px，现在改成 45px */
    top: 45px !important; 
    
    left: 45px !important; 
    right: auto !important; 
    width: 360px !important; 
  }
}
</style>