<script setup lang="ts">
import { useElementBounding, useMouse } from '@vueuse/core'
import { nextTick, onBeforeMount, onMounted, ref, watch } from 'vue'

const NUM_BOXES = 10
const boxes = ref<any[]>([])

const pageRef = ref<HTMLElement | null>()
const { x: mouseX, y: mouseY } = useMouse()

function getBoxPosition(box: HTMLElement) {
  const { left, top } = useElementBounding(box)
  // console.log('🚀 ~ getBoxPosition ~ top:', top)
  // console.log('🚀 ~ getBoxPosition ~ left:', left)
  return { left, top }
}

/** 计算得出box的位置 */
function calcBoxesPosition() {
  boxes.value.forEach((_, i) => {
    const box = document.getElementById(_.name) as HTMLElement
    if (_.top && _.left) {
      //
    }
    else {
      const { left, top } = getBoxPosition(box)
      _.left = left.value
      _.top = top.value
    }
    boxes.value[i] = {
      ..._,
      elementX: mouseX.value - _.left,
      elementY: mouseY.value - _.top,
    }
  })
}

watch([mouseX, mouseY], () => {
  calcBoxesPosition()
})

onBeforeMount(() => {
  boxes.value = Array.from({ length: NUM_BOXES }, (_, i) => {
    return {
      name: `box-${i + 1}`,
      elementX: 0, // --x
      elementY: 0, // --y
      left: 0, // element bounding left
      top: 0, // element bounding top
    }
  })
})

onMounted(() => {
  nextTick(() => {
    calcBoxesPosition()
  })
  pageRef.value?.addEventListener('scroll', () => {
    boxes.value.forEach((_, _i) => {
      _.left = 0
      _.top = 0
    })
  })
})
</script>

<template>
  <n-card title="卡片动画">
    <div ref="pageRef" class="w-full h-full p-8 overflow-auto">
      <!-- 顶部元素（测试滚动） -->
      <div class="w-full h-[100px] bg-slate-500" />
      <!-- 鼠标位置 -->
      <p class="text-center mb-4 font-bold text-xl">
        mouseX: {{ mouseX }}, mouseY: {{ mouseY }}
      </p>
      <!-- boxes -->
      <div
        class="box-container grid grid-cols-3 gap-8"
        :style="{
          '--border-color': 'rgb(229,229,229)',
          '--bg-color': 'rgba(245,158,11,.7)',
        }"
      >
        <div
          v-for="(item, i) in boxes"
          :id="item.name"
          :key="i"
          class="box flex items-center justify-center p-[1px] rounded-xl"
          :style="{
            '--x': `${item.elementX}px`,
            '--y': `${item.elementY}px`,
          }"
        >
          <div
            class="box_inner w-full h-full bg-white rounded-xl hover:bg-opacity-70 transition-[background-opacity] text-center"
          >
            <div>{{ item.left }} - {{ item.top }}</div>
            <div>item.elementX：{{ item.elementX }}</div>
            <div>item.elementY：{{ item.elementY }}</div>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<style lang="scss" scoped>
  .box {
    width: 100%;
    height: 200px;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    position: relative;
    &::before {
      position: absolute;
      inset: -2px;
      display: block;
      content: '';
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      border-radius: 12px;
      background: radial-gradient(
        200px circle at var(--x) var(--y),
        var(--bg-color) 0,
        transparent 100%
      );
      will-change: background;
    }
  }
</style>
