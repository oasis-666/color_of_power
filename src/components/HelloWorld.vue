<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
/* 手机端专用样式 */
@media (max-width: 768px) {
  .container {
    padding: 20px;
    flex-direction: column; /* 如果你用了 flex，让它们上下排列 */
  }

  /* 针对你截图中重叠的文字 */
  .title-vertical {
    font-size: 2rem; /* 缩小那个巨大的垂直标题 */
    margin-bottom: 10px;
  }

  .subtitle-horizontal {
    position: static; /* 取消绝对定位，让它乖乖排在下面，不再重叠 */
    font-size: 1.2rem;
    text-align: center;
  }

  .button-group {
    display: flex;
    flex-wrap: wrap; /* 让按钮在空间不够时自动换行 */
    justify-content: center;
    gap: 10px;
  }
}
</style>
