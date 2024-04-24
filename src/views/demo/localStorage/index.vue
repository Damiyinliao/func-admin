<script lang="tsx" setup>
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, NSpace } from 'naive-ui'
import StorageModal from './StorageModal.vue'
import { CreateSmartStorage } from '@/utils/smart-storage'
import { useBoolean } from '@/hooks'

type ModalType = 'add' | 'edit'

const smartStorage = CreateSmartStorage({
  prefixKey: 'smart_storage_',
})

const formRef = ref<FormInst | null>()
const loading = ref(false)
const initialModel = {
  key: '',
  value: '',
}
const model = ref({ ...initialModel })
const listData = ref<CommonList.StorageList[]>([])
const total = ref(0)
const columns: DataTableColumns = [
  {
    title: '键名',
    align: 'center',
    key: 'key',
  },
  {
    title: '加密值',
    align: 'center',
    key: 'value',
  },
  {
    title: '操作',
    align: 'center',
    key: 'action',
    render: (row) => {
      return (
        <NSpace justify="center">
          <NButton onClick={() => showOrigin(row)}>查看原值</NButton>
          <NButton onClick={() => handleEdit(row)}>编辑</NButton>
          <NButton onClick={() => handleDelete(row)}>删除</NButton>
        </NSpace>
      )
    },
  },
]
const modalType = ref<ModalType>('add')
const { bool: visible, setTrue: openModal } = useBoolean(false)
const editData = ref<CommonList.StorageList | null>(null)

function setModalType(type: ModalType) {
  modalType.value = type
}
function showOrigin(row: any) {
  const { key } = row
  const originValue = smartStorage.get(key)
  window.$message.success(`原值为：${originValue}`)
}

function handleEdit(row: any) {
  const { key, value } = row
  editData.value = { key, value }
  setModalType('edit')
  openModal()
}
function handleDelete(row: any) {
  const { key } = row
  smartStorage.remove(key)
  if (listData.value.length > 1)
    traversalStorage()
  else
    listData.value = []
}

function handleSave() {
  smartStorage.set(model.value.key, model.value.value)
  traversalStorage()
}

function handleClear() {
  model.value = { ...initialModel }
}

function handleAddTable() {
  setModalType('add')
  openModal()
}

function changePage() {

}

function traversalStorage() {
  const list = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.includes('smart_storage'))
      continue
    const value = localStorage.getItem(key)
    list.push({
      key,
      value: value || '',
    })
    total.value = list.length
    listData.value = list
  }
}

onMounted(() => {
  traversalStorage()
  console.log(
    'Multiple styles: %cred %corange',
    'color: red',
    'color: orange',
    'Additional unformatted message',
  )
  console.log('%c ', 'padding-left: 50px; line-height: 50px; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAAEgCAMAAAAjXV6yAAAANlBMVEVHcEwzMjQvJjgxJDcvJDgwJThRNTmfxWgy2SbD9nmh8GaOP121TVnCPS/qRCvtXj3ym2j2tXmABwdyAAAABXRSTlMABTvE+i919boAAAMySURBVHgB7dzLTsNmFIXR+BqKYwLv/7KlUsWkZ9P+lS3H1vrIFEssHXmyFW6vVdcP47RB49B3tysECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAATqeog7Qz6mEhrmtiwJ1/RC6h95C1wUaq6b5/kfZewKarws0VQH6HWgG5IJyLsgFuSAX5IJckAtyQYBckAtyQS7IBbkgF+SCAAHq6rYDGqsC0AX2r6UVaAj13cn3r7fQew10n+uG4N91Z9+/WoHyuyZ07pfxhkCtEoAAAQIECBAgQIAAAQIECBAgQIAAAQIE6LL71/5AdWfZvxLQdK997qEANA19qDvJ/jUGn3l5lC1zaKob83B4iv1rbAeaprn4+aWx6hWBplAz0AYBAgQIECBAgAABAgQIECBAVwACBAgQIECAAHV1LwhUd5r/f7j8pfGPzzdQmDXmto7ay/L3v9bQsnNr6KC9LH//a/2oe4RaIR6hj7r1oK9q5q395YCmqkOBAAECBAgQIEAhQA0+gAAt1wRyQYAAAQIECBAgQIC6sisA1e29fy0J6Pl4Pn4+WWhzoOa9bOf9K/p8hh7fv/HfP+2172U7718R6Kvs8/lxQFvtZfllfAGgqepCQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECNAzFIFCVwWK+9dX6DP0vCzQ1yYB+g4QIECAAAECBAgQIECAAAECBAgQIECAAAECZPZZTz8cbkbxqFtMz4AA/b8AAQIECBAgQIAAAQIECBAgQIAAAQIECBCgEKC/+5f9C1AOECBAgAABAgQIECBAgAABAgQIECBAgAABAgQI0AooXEroykCAAAECBAgQIECAAAECBAgQIECAAAECBAgQoLLzA41VCSjXD6FlLWt2W0Ot+1eUCA2hVqCuDw1zXetfNofWrS6lbujruuyTjYqa300ZaMrP2fddE7pt0hWAbjsFCBAgQIAAAQIECBAgQNsHCBAgQIAAAQIEqKwdKD/n+P0rt/Velmt9ztLYENobqG0vyw1tz8ntvn/tuZfl4j6Vn5Nr3L8OqRkonPqGQFtKAAIECBAgQIAAAQIECBAgQIAAAQIECBCg4wME6E+7tQcAK80eGwAAAABJRU5ErkJggg==) 100% / contain no-repeat;')
})
</script>

<template>
  <NSpace vertical size="large">
    <n-card>
      <n-form ref="formRef" :model="model" label-placement="left" :show-feedback="false">
        <n-grid :x-gap="30" :cols="4">
          <n-form-item-gi label="键名" path="key">
            <n-input v-model:value="model.key" placeholder="请输入" />
          </n-form-item-gi>
          <n-form-item-gi label="值" path="value">
            <n-input v-model:value="model.value" placeholder="请输入" />
          </n-form-item-gi>
        </n-grid>
      </n-form>
      <n-flex class="mt-1em" justify="end">
        <NButton @click="handleClear">
          清除
        </NButton>
        <NButton type="primary" @click="handleSave">
          存储
        </NButton>
      </n-flex>
    </n-card>
    <n-card>
      <NSpace vertical size="large">
        <div class="flex gap-4">
          <NButton type="primary" @click="handleAddTable">
            <template #icon>
              <icon-park-outline-add-one />
            </template>
            新建
          </NButton>
        </div>
        <n-data-table :columns="columns" :data="listData" :loading="loading" />
        <Pagination :count="total" @change="changePage" />
        <StorageModal
          v-model:visible="visible"
          :type="modalType"
          :modal-data="editData"
          @success="traversalStorage"
        />
      </NSpace>
    </n-card>
  </NSpace>
</template>
