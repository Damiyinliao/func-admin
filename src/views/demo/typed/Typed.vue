<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  typedList: string[]
  loop?: boolean
  speed?: number
}>(), {
  loop: true,
  speed: 200,
})

const typedText = ref('')

function start() {
  let j = 0
  let k = 0
  typedText.value = ''
  if (props.typedList.length <= 0)
    throw new Error('TypedList is empty')

  let arr = props.typedList[k].split('')
  const timer = setInterval(() => {
    if (j < arr.length) {
      typedText.value += arr[j++]
    }
    else {
      if (k < props.typedList.length - 1) {
        k++
        j = 0
        typedText.value = ''
        arr = props.typedList[k].split('')
      }
      else {
        clearInterval(timer)
        if (props.loop)
          start()
      }
    }
  }, props.speed)
}

onMounted(() => start())
</script>

<template>
  <div>
    <div class="typed-text">
      {{ typedText }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @keyframes blink {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .typed-text::after {
    content: "|"; // 光标闪烁效果
    animation: blink 1s infinite;
  }
</style>
