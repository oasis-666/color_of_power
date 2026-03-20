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
        const response = await axios.post('http://server.hairuosky.cn:1111/api/analyze?enable_ai=true', formData, {
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
/* ================= 1. 全局：深空与暗金科技底色 ================= */
.analyzer-wrapper {
  padding: 40px;
  /* 魔法：继承时空大屏的暗夜海蓝渐变，保持项目视觉统一 */
  background-color: #03050a;
  background-image: 
    url('https://www.transparenttextures.com/patterns/stucco.png'),
    linear-gradient(135deg, #0a1128 0%, #03050a 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fdf6e3;
}

/* ================= 2. 标题区：书法与科技的碰撞 ================= */
.header-titles { text-align: center; margin-bottom: 40px; }
.main-title {
  font-size: 32px;
  color: #e6c280; /* 宫廷暗金 */
  margin-bottom: 10px;
  font-family: "STKaiti", "楷体", serif;
  letter-spacing: 4px;
  text-shadow: 0 0 15px rgba(230, 194, 128, 0.3);
}
.sub-title { color: #bfa175; font-size: 15px; letter-spacing: 2px; }

/* ================= 3. 上传核心区：全息扫描视窗 ================= */
.upload-section {
  width: 100%; max-width: 800px;
  /* 玻璃拟态：半透明黑底 + 毛玻璃 */
  background: rgba(10, 17, 40, 0.6);
  border: 1px solid rgba(230, 194, 128, 0.2);
  border-radius: 8px; /* 抛弃大圆角，采用硬朗科技感 */
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
  display: flex; flex-direction: column; align-items: center;
}

/* 取景器边框 */
.upload-box {
  width: 100%; height: 350px;
  border: 1px dashed rgba(230, 194, 128, 0.4);
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
  display: flex; justify-content: center; align-items: center;
  cursor: pointer; transition: all 0.3s ease;
  position: relative; overflow: hidden;
}
/* 四个角的取景器装饰 */
.upload-box::before, .upload-box::after {
  content: ''; position: absolute; width: 20px; height: 20px; border-color: #e6c280; border-style: solid; pointer-events: none; transition: 0.3s;
}
.upload-box::before { top: 10px; left: 10px; border-width: 2px 0 0 2px; }
.upload-box::after { bottom: 10px; right: 10px; border-width: 0 2px 2px 0; }

.upload-box:hover { border-color: #e6c280; background-color: rgba(230, 194, 128, 0.05); }
.upload-box:hover::before, .upload-box:hover::after { width: 30px; height: 30px; box-shadow: 0 0 10px rgba(230, 194, 128, 0.5); }

.upload-box.has-image { border: 1px solid rgba(230, 194, 128, 0.2); background: #000; }

/* 提示文字 */
.upload-hint { text-align: center; color: #bfa175; }
.upload-icon { font-size: 48px; margin-bottom: 15px; filter: grayscale(100%) brightness(200%); opacity: 0.6; }
.upload-hint p { color: #e6c280; font-size: 18px; letter-spacing: 1px; margin-bottom: 10px; }

/* 预览与高科技扫描动画 */
.preview-container { width: 100%; height: 100%; position: relative; }
.preview-img { width: 100%; height: 100%; object-fit: contain; opacity: 0.8; }

/* 🌟 赛博古风：石青色扫描激光 */
.scanner-laser {
  position: absolute; top: 0; left: 0; width: 100%; height: 2px;
  background-color: #40fcfc; /* 科技青色 */
  box-shadow: 0 0 20px 5px rgba(64, 252, 252, 0.6);
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
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7); color: #40fcfc;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  font-family: monospace; letter-spacing: 2px;
}
.spinner {
  width: 40px; height: 40px; border: 3px solid rgba(64, 252, 252, 0.3);
  border-top-color: #40fcfc; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* 核心启动按钮：引擎质感 */
.analyze-btn {
  margin-top: 30px; width: 60%; height: 50px; border-radius: 4px;
  background: linear-gradient(90deg, #982A22, #5c1814); /* 皇家暗红 */
  border: 1px solid #ff5e00; color: #fdf6e3;
  font-size: 16px; font-family: "STKaiti", serif; letter-spacing: 2px;
  cursor: pointer; transition: all 0.3s;
  box-shadow: 0 0 15px rgba(152, 42, 34, 0.4);
}
.analyze-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 25px rgba(255, 94, 0, 0.6); }
.analyze-btn:disabled { background: #333; border-color: #555; color: #777; box-shadow: none; cursor: not-allowed; }
.analyzing-btn { background: #111 !important; border-color: #40fcfc !important; color: #40fcfc !important; cursor: wait !important; box-shadow: 0 0 20px rgba(64, 252, 252, 0.2) !important; }

/* ================= 4. 数据仪表盘：机密档案质感 ================= */
.result-dashboard {
  width: 100%; max-width: 1000px; margin-top: 40px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 30px;
}
.result-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(230, 194, 128, 0.2);
  border-radius: 4px; padding: 30px;
  box-shadow: inset 0 0 30px rgba(0,0,0,0.5);
  position: relative;
}
/* AI 面板：科技青色发光 */
.ai-card { border-top: 3px solid #40fcfc; background: linear-gradient(to bottom, rgba(64,252,252,0.05) 0%, transparent 50%); }
/* CV 面板：古典金色发光 */
.cv-card { border-top: 3px solid #e6c280; background: linear-gradient(to bottom, rgba(230,194,128,0.05) 0%, transparent 50%); }

.card-header { display: flex; align-items: center; margin-bottom: 25px; border-bottom: 1px dashed rgba(230, 194, 128, 0.2); padding-bottom: 15px; }
.card-header .icon { font-size: 22px; margin-right: 10px; filter: grayscale(100%) brightness(200%); }
.card-header h3 { font-size: 18px; color: #e6c280; margin: 0; font-family: "STKaiti", serif; letter-spacing: 1px; }
.ai-card .card-header h3 { color: #40fcfc; } /* AI 专属色 */

.info-list { display: flex; flex-direction: column; gap: 15px; }
.info-item { display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
.label { color: #bfa175; }
.value { color: #fdf6e3; font-family: monospace; font-size: 15px; }
.ai-card .highlight { color: #40fcfc; text-shadow: 0 0 8px rgba(64,252,252,0.5); font-family: "STKaiti", serif; font-size: 18px;}
.cv-card .highlight { color: #e6c280; text-shadow: 0 0 8px rgba(230,194,128,0.5); }

/* 地域标签 */
.tag { background: rgba(64,252,252,0.1); color: #40fcfc; padding: 4px 12px; border: 1px solid rgba(64,252,252,0.3); border-radius: 2px; font-size: 12px; }
.empty-tag { background: transparent; color: #666; border-color: #444; }

/* 底部总结框：机密文件框 */
.summary-box {
  margin-top: 20px; padding: 15px;
  background: rgba(0,0,0,0.5); border-left: 3px solid #40fcfc;
  font-size: 13px; color: #ccc; line-height: 1.6; font-family: "STKaiti", serif;
}
</style>


