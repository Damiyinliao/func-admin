<script lang="ts" setup>
</script>

<template>
  <NSpace vertical size="large" class="reverse-color">
    <n-card title="示例">
      <div class="button-wrapper">
        <div class="button-item">
          Button
        </div>
        <div class="button-item">
          Button
        </div>
        <div class="button-item">
          Button
        </div>
      </div>
    </n-card>
  </NSpace>
</template>

<style lang="scss" scoped>
  .button-wrapper {
    display: flex;
    gap: 10px;
  }
  .button-item {
    border: 1px solid #000;
    text-align: center;
    transition: all 0.3s;
    width: 100px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: var(--bg);
    cursor: pointer;
    // color: rgb(from var(--bg) calc(1 - r) calc(1 - g) calc(1 - b));  /** 基于背景反转颜色 **/
    color: color-contrast(var(--bg) vs #fff, #000);  /** 基于背景色，自动选择对比度更高的颜色 **/
    &:nth-child(1) {
      --bg: rgb(12, 12, 12);
    }
    &:nth-child(2) {
      --bg: #CDDC39;
    }
    &:nth-child(3) {
      --bg: #82d8ff;
    }
    &:hover {
      background: hsl(from var(--bg) h s calc(l * 1.2));
    }
    &:active {
      background: hsl(from var(--bg) h s calc(l * 0.8));
    }
  }
</style>
