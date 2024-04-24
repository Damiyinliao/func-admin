<script setup lang="ts">
import { computed, ref } from 'vue'
import { CreateSmartStorage } from '@/utils/smart-storage'

interface Props {
  visible: boolean
  type?: ModalType
  modalData?: any
}
interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'success'): void
}

type ModalType = 'add' | 'edit'

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  modalData: null,
})
const emit = defineEmits<Emits>()

const defaultFormModal = {
  key: '',
  value: '',
}

const formModel = ref({ ...defaultFormModal })

const modalVisible = computed({
  get() {
    return props.visible
  },
  set(visible) {
    closeModal(visible)
  },
})

const smartStorage = CreateSmartStorage({
  prefixKey: 'smart_storage_',
})

function closeModal(visible = false) {
  emit('update:visible', visible)
}

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: '添加',
    edit: '编辑',
  }
  return titles[props.type]
})

function UpdateFormModelByModalType() {
  const handlers = {
    add: () => {
      formModel.value = { ...defaultFormModal }
    },
    edit: () => {
      if (props.modalData) {
        formModel.value = {
          ...props.modalData,
          value: smartStorage.get(props.modalData.key),
        }
      }
    },
  }
  handlers[props.type]()
}

watchEffect(() => {
  if (props.visible)
    UpdateFormModelByModalType()
})

function handleSubmit() {
  smartStorage.set(formModel.value.key, formModel.value.value)
  emit('success')
  closeModal()
}
</script>

<template>
  <n-modal
    v-model:show="modalVisible"
    :mask-closable="false"
    preset="card"
    :title="title"
    class="w-400px"
    :segmented="{
      content: true,
      action: true,
    }"
  >
    <n-form label-placement="left" :model="formModel" label-align="left" :label-width="50">
      <n-grid :cols="1" :x-gap="18">
        <n-form-item-grid-item :span="12" label="键名" path="key">
          <n-input v-model:value="formModel.key" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="值" path="value">
          <n-input v-model:value="formModel.value" />
        </n-form-item-grid-item>
      </n-grid>
    </n-form>
    <template #action>
      <n-space justify="center">
        <n-button @click="closeModal()">
          取消
        </n-button>
        <n-button type="primary" @click="handleSubmit">
          提交
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>
