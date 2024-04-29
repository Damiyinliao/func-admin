<script setup lang="ts">
import Typed from './Typed.vue'

defineOptions({ name: 'PluginTyped' })
</script>

<template>
  <n-card title="打字机效果">
    <n-space>
      <div>自己写的效果：</div>
      <Typed :typed-list="['浙江蔚海海洋科技有限公司']" />
    </n-space>
    <n-space>
      <div>插件效果：</div>
    </n-space>
  </n-card>
</template>

<style lang="scss" scoped>

</style>
