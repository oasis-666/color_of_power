<template>
  <div class="analyzer-wrapper">
    <div class="header-titles">
      <h2 class="main-title">👁️ AI 智能古建特征解析舱</h2>
      <p class="sub-title">上传建筑影像，多模态大模型与CV算法联合诊断</p>
    </div>

    <div class="upload-section">
      <div class="upload-box" @click="triggerFileInput" :class="{ 'has-image': previewUrl }">
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleFileChange" 
          accept="image/*" 
          style="display: none;" 
        />
        
        <div v-if="!previewUrl" class="upload-hint">
          <div class="upload-icon">📁</div>
          <p>点击或将图片拖拽至此区域</p>
          <span>支持 JPG / PNG 高清影像，建议包含完整的建筑立面或屋顶</span>
        </div>
        
        <div v-else class="preview-container">
          <img :src="previewUrl" class="preview-img" />
          
          <div v-if="isAnalyzing" class="scanner-laser"></div>
          
          <div v-if="isAnalyzing" class="scanning-overlay">
            <div class="spinner"></div>
            <p>正在提取 19 维图像特征...</p>
            <p style="font-size: 12px; opacity: 0.8; margin-top: 5px;">大模型节点已连接</p>
          </div>
        </div>
      </div>
      
      <button 
        class="analyze-btn" 
        :class="{ 'analyzing-btn': isAnalyzing }"
        :disabled="!selectedFile || isAnalyzing"
        @click="startAnalysis"
      >
        {{ isAnalyzing ? '🚀 AI 深度解析中...' : '启动 AI 深度特征扫描' }}
      </button>
    </div>

   <div class="result-dashboard" :class="{ 'is-empty': !analysisResult }">
      
  <div class="result-card ai-card">
    <div class="card-header">
      <span class="icon">🤖</span>
      <h3>AI 多模态诊断报告</h3>
    </div>
    <div class="info-list">
      
      <div class="info-item">
        <span class="label">预估年代</span>
        <span class="value highlight">
          {{ analysisResult ? analysisResult.ai_analysis.dynasty_guess : '待扫描...' }}
        </span>
      </div>
      
      <div class="info-item">
        <span class="label">建筑风格</span>
        <span class="value">
          {{ analysisResult ? analysisResult.ai_analysis.architecture_style : '--' }}
        </span>
      </div>
      
      <div class="info-item">
        <span class="label">地域归属</span>
        <span class="value tag" :class="{ 'empty-tag': !analysisResult }">
          {{ analysisResult ? analysisResult.ai_analysis.province_level_region : '未知' }}
        </span>
      </div>

      <div class="info-item">
        <span class="label">结构特征</span>
        <span class="value">
          {{ analysisResult ? analysisResult.ai_analysis.structure_description : '--' }}
        </span>
      </div>

      <div class="summary-box">
        <strong>诊断总结：</strong> 
        {{ analysisResult ? analysisResult.ai_analyze : '请上传建筑影像并启动 AI 扫描，系统将自动输出深度诊断报告。' }}
      </div>
    </div>
  </div>

  <div class="result-card cv-card">
    <div class="card-header">
      <span class="icon">📊</span>
      <h3>CV 底层色彩与纹理基因</h3>
    </div>
    <div class="info-list">
      
      <div class="info-item">
        <span class="label">核心色彩占比 (AI)</span>
        <span class="value" style="color: #ff5e00; font-weight: bold;">
          {{ analysisResult ? analysisResult.ai_analysis.color_ratio : '--' }}
        </span>
      </div>
      
      <div class="info-item">
        <span class="label">边缘密度 (Edge Density)</span>
        <span class="value">
          {{ analysisResult && analysisResult.edge_density ? analysisResult.edge_density.toFixed(4) : '--' }}
        </span>
      </div>
      
      <div class="info-item">
        <span class="label">纹理复杂度 (GLCM熵值)</span>
        <span class="value">
          {{ analysisResult && analysisResult.entropy ? analysisResult.entropy.toFixed(4) : '--' }}
        </span>
      </div>
      
      <div class="info-item">
        <span class="label">色相均值 (H-Mean)</span>
        <span class="value">
          {{ analysisResult && analysisResult.h_mean ? analysisResult.h_mean.toFixed(4) : '--' }}
        </span>
      </div>

    </div>
  </div>
</div>

    </div>
  
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedFile: null,      // 用户选中的文件对象
      previewUrl: '',          // 用于在网页上预览图片的本地链接
      isAnalyzing: false,      // 是否正在分析中（控制 loading 动画）
      analysisResult: null,    // 后端返回的巨大 JSON 结果
    };
  },
  methods: {
    // 1. 触发隐藏的 input 标签
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // 2. 拿到用户选中的图片并预览
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        // 把文件变成一个本地可预览的 URL
        this.previewUrl = URL.createObjectURL(file);
        // 清空上一次的结果
        this.analysisResult = null; 
      }
    },

    // 3. 点击按钮，发送请求！
    async startAnalysis() {
      if (!this.selectedFile) return;

      this.isAnalyzing = true;
      let formData = new FormData();
      formData.append("file", this.selectedFile);

      try {
        // 请求后端接口，带上 enable_ai=true
        const response = await axios.post('http://localhost:8080/api/analyze?enable_ai=true', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data && response.data.success) {
          // 把后端返回的数据存到变量里，Vue 会自动把它们显示在页面上！
          this.analysisResult = response.data;
          console.log("解析成功！", this.analysisResult);
        } else {
          alert("解析失败：" + response.data.message);
        }
      } catch (error) {
        console.error("请求报错：", error);
        alert("网络请求失败，请检查后端服务是否开启！");
      } finally {
        this.isAnalyzing = false;
      }
    }
  }
};
</script>
<style scoped>
/* ================= 整体页面背景与标题 ================= */
.analyzer-wrapper {
  padding: 40px;
  background-color: #f5f7fa; /* 高级浅灰背景 */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header-titles {
  text-align: center;
  margin-bottom: 40px;
}
.main-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}
.sub-title {
  color: #666;
  font-size: 15px;
}

/* ================= 第一部分：上传区 ================= */
.upload-section {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.upload-box {
  width: 100%;
  height: 350px;
  border: 2px dashed #ff8833;
  border-radius: 12px;
  background-color: #fffaf7;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden; /* 防止图片和动画溢出 */
}
.upload-box:hover {
  background-color: #fff2e8;
  border-color: #ff5e00;
}
.upload-box.has-image {
  border-style: solid;
  border-color: transparent;
  background: #000; /* 图片背景变黑，显得更高级 */
}

.upload-hint {
  text-align: center;
  color: #999;
}
.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
}
.upload-hint p {
  color: #ff5e00;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* 预览与扫描动画 */
.preview-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保证图片不变形 */
  opacity: 0.9;
}

/* 🌟 赛博朋克扫描线特效 */
.scanner-laser {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #00ffcc; /* 科幻荧光绿 */
  box-shadow: 0 0 15px 5px rgba(0, 255, 204, 0.5);
  animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  z-index: 10;
}
@keyframes scan {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.scanning-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #00ffcc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  letter-spacing: 1px;
}

/* 底部按钮 */
.analyze-btn {
  margin-top: 30px;
  width: 80%;
  height: 50px;
  border-radius: 25px;
  background: linear-gradient(90deg, #ff5e00, #ff8833);
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 94, 0, 0.3);
  transition: all 0.3s;
}
.analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 94, 0, 0.4);
}
.analyze-btn:disabled {
  background: #ccc;
  box-shadow: none;
  cursor: not-allowed;
}
.analyzing-btn {
  background: #333 !important;
  cursor: wait !important;
}

/* ================= 第二部分：结果仪表盘 ================= */
.result-dashboard {
  width: 100%;
  max-width: 1000px;
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}
.result-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
}
.ai-card { border-top: 5px solid #3169b2; } /* 科技蓝 */
.cv-card { border-top: 5px solid #ff5e00; } /* 传统橙 */

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
}
.card-header .icon { font-size: 24px; margin-right: 10px; }
.card-header h3 { font-size: 18px; color: #333; margin: 0; }

.info-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
}
.label { color: #666; }
.value { color: #333; font-weight: bold; }
.highlight { color: #ff5e00; }
.tag { background: #f0f5ff; color: #3169b2; padding: 4px 10px; border-radius: 12px; font-size: 13px; }

.summary-box {
  margin-top: 15px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

/* 自定义小型进度条 */
.progress-bar-bg {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin: 0 15px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffbb00, #ff5e00);
  border-radius: 4px;
  transition: width 1s ease-out;
}
.value-num { font-weight: bold; color: #ff5e00; width: 50px; text-align: right; }

/* 动画效果 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s, transform 0.5s; }
.fade-enter, .fade-leave-to { opacity: 0; transform: translateY(20px); }
</style>


